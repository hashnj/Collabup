import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id || !token?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const roomName = params.id;
  const identity = token.email; 



}
