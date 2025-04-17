"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  loginWithOAuth: (provider: "google" | "github") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  loginWithOAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <AuthContextWrapper>{children}</AuthContextWrapper>
    </SessionProvider>
  );
};

const AuthContextWrapper = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(status === "loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session.user as any).id, // Ensure NextAuth user has `id`
        name: session.user.name || "",
        email: session.user.email || "",
      });
      setLoading(false);
    } else {
      axios
        .get("/api/auth/me", { withCredentials: true })
        .then(({ data }) => setUser(data))
        .catch(() => setError("You are not logged in"))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const loginWithOAuth = async (provider: "google" | "github") => {
    console.log(`OAuth login triggered for ${provider}`);
    await signIn(provider, { callbackUrl: "/home" });
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    await signOut({ redirect: false });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, loginWithOAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
