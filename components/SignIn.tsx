"use client";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import CustomeInput from "./CustomInput";

const SignIn = () => {
  const router = useRouter();
  const { loginWithOAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      router.push("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleLocalLogin}
        className="flex flex-col space-y-4 w-full max-w-lg"
      >
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
          className=" p-2 rounded"
        >
          <FaGoogle />
        </button>
        <button
          onClick={() => loginWithOAuth("github")}
          className=" p-2 rounded"
        >
          <FaGithub />
        </button>
      </div>
      
        <p className="mt-4 text-sm text-gray-500 cursor-default">
          Don't have an account?{" "}
          <button onClick={()=>router.push("/register")} className="text-blue-500 cursor-pointer hover:underline">
            Register
          </button>
        </p>
    </div>
  );
};



export default SignIn;
