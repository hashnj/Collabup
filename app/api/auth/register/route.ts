import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { hashPassword } from "@/lib/bcrypt";

export async function POST(req: Request) {
  await connectDB();
  const { userName, email, password } = await req.json();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" });
  }
  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    userName,
    email,
    password: hashedPassword,
  });
  return NextResponse.json(
    { message: "User created", user: newUser._id },
    { status: 201 }
  );
}
