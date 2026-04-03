import { NextResponse } from "next/server";
import { getTokenCookieName } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully" });
  res.cookies.set(getTokenCookieName(), "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return res;
}
