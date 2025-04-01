"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import CustomeInput from "./CustomInput";
import api from "@/lib/axios";

const SignIn = () => {
  const router = useRouter();
  const { loginWithOAuth } = useAuth();
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post(
        "/auth/register",
        { userName, email, password },
      );
      if (res.status === 201) {
        router.push("/login"); 
      }
    } catch (err) {
      setError("Registration failed. User may already exist.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleRegister}
        className="flex flex-col space-y-4 w-full max-w-lg"
      >
        <CustomeInput
          type="text"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUsername(e.target.value)} />
        <CustomeInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <CustomeInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-gradient-to-r from-white/70 to-50% hover:from-white/80 hover:to-blue-600 to-blue-500 mx-auto px-4 py-2 rounded-lg">Login</button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      
      <span className="mt-2">or</span>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => loginWithOAuth("google")}
          className="p-2 rounded cursor-pointer text-xl"
        >
          <FaGoogle />
        </button>
        <button
          onClick={() => loginWithOAuth("github")}
          className=" p-2 rounded cursor-pointer text-xl"
        >
          <FaGithub />
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-500 cursor-default">
          Have an account?{" "}
          <button onClick={()=>router.push("/login")} className="text-blue-500 cursor-pointer hover:underline">
            Register
          </button>{" "}
          Instead
        </p>
    </div>
  );
};



export default SignIn;
