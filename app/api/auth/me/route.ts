import { connectDB } from "@/lib/db";
import User from "@/models/user";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();

    const nextReq = req as NextRequest;
    const token = await getToken({ req: nextReq, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(token.id).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
