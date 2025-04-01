import { createToken, setAuthCookies } from "@/lib/auth";
import { comparePassword } from "@/lib/bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST (req:Request){
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({email});
  if( !user || !(await comparePassword(password,user.password))) {
    return NextResponse.json({message: 'Invalid Credentials'}, {status:401});
  }

  const token = createToken(user._id);
  setAuthCookies(token);

  return NextResponse.json({message:'login successful'},{status:200});

}