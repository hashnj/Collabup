import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function POST() {
  const c = await cookies();
  c.delete("auth_token");
  await signOut({ redirect: false });
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
