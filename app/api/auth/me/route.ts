import { decodeToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function GET(){
  await connectDB();
  const userId=decodeToken();
  if(!userId){
    return NextResponse.json({message:'unAuthorized'},{status:401});
  }

  const user = await User.findById(userId).select('-password');
  return NextResponse.json(user,{status:200});
}