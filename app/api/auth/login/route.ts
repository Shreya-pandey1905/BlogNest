import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { comparePassword, getTokenCookieName, signToken } from "@/lib/auth";
import { errorResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("Email and password are required", 400);
    }

    await connectToDatabase();
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    const storedPasswordHash = user.password;
    if (storedPasswordHash == null || storedPasswordHash === "") {
      return errorResponse("Invalid email or password", 401);
    }

    if (!user.isEmailVerified) {
      return errorResponse("Please verify your email before logging in", 403);
    }

    const validPassword = await comparePassword(password, storedPasswordHash);
    if (!validPassword) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set(getTokenCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return errorResponse("Failed to login", 500);
  }
}
