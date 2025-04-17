"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import CustomInput from "./CustomInput";
import api from "@/lib/axios";
import {  Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();
  const { loginWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = signIn("credentials", {
        email,
        password,
        callbackUrl: "/home", // redirect after login
        redirect: true,
      });
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    console.log(`Trying to login with ${provider}`);
    await loginWithOAuth(provider);
  };
  

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleLocalLogin}
        className="flex flex-col space-y-4 w-full max-w-lg"
      >
        <CustomInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-gradient-to-r from-white/70 to-50% hover:from-white/80 hover:to-blue-600 to-blue-500 mx-auto px-4 py-2 rounded-lg flex items-center justify-center"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      
      <span className="mt-2">or</span>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => handleOAuthLogin("google")}
          className="p-2 rounded cursor-pointer text-xl"
        >
          <FaGoogle />
        </button>
        <button
          onClick={() => handleOAuthLogin("github")}
          className="p-2 rounded cursor-pointer text-xl"
        >
          <FaGithub />
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-500 cursor-default">
        Don't have an account?{" "}
        <button 
          onClick={() => router.push("/register")} 
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default SignIn;
