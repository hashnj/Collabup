import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.nextUrl.pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  const protectedRoutes = ["/home", "/personal-room", "/previous", "/upcoming", "/meeting"];

  if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home", "/personal-room", "/previous", "/upcoming", "/meeting", "/login"],
};
