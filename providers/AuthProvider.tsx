'use client';

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
  loading:boolean;
  error:string|null;
  loginWithOAuth: (provider: "google" | "github") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user:null,
  loading:true,
  error:null,
  loginWithOAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({children}:{children:ReactNode}) => {
  const { data:session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name!,
        email: session.user.email!,
      });
    } else {
      axios
        .get("/api/auth/me", { withCredentials: true })
        .then(({ data }) => setUser(data))
        .catch(() => setError("You are not logged in"))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const loginWithOAuth = (provider: "google" | "github") => signIn(provider);
  const logout = async () => {
    await axios.post("/api/auth/logout");
    await signOut({ redirect: false });
    setUser(null);
  };

  return (
    <SessionProvider>
    <AuthContext.Provider value={{ user, loading:status==='loading', error,loginWithOAuth,logout }}>
      {children}
    </AuthContext.Provider>
    </SessionProvider>
  );
};

export const useAuth = () => useContext(AuthContext);
