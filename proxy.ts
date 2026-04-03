import { NextRequest, NextResponse } from "next/server";
import { getTokenCookieName, verifyToken } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const token = req.cookies.get(getTokenCookieName())?.value;
  const path = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = verifyToken(token);

    if (path.startsWith("/dashboard") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
