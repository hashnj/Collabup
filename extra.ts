//login backend route

import { createToken } from "@/lib/auth";
import { comparePassword } from "@/lib/bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json({ message: "Invalid Credentials" }, { status: 401 });
  }

  const token = createToken(user._id);

  const response = NextResponse.json({ message: "Login successful" }, { status: 200 });

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, 
  });

  return response;
}

//logout backend route
import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function POST() {
  const c = await cookies();
  c.delete("auth_token");
  await signOut({ redirect: false });
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
