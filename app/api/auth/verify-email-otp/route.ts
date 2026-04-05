import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { getTokenCookieName, signToken } from "@/lib/auth";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const otpValue = String(otp ?? "").replace(/\D/g, "").trim().slice(0, 6);

    if (!normalizedEmail || !otpValue) {
      return errorResponse("Email and OTP are required", 400);
    }

    if (otpValue.length !== 6) {
      return errorResponse("Please enter the 6-digit OTP only.", 400);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: normalizedEmail });

    // Avoid leaking whether the email exists: generic "invalid/expired OTP".
    if (!user) {
      return errorResponse("Invalid or expired OTP", 400);
    }

    if (user.isEmailVerified) {
      // Already verified; treat as success to avoid UX breakage.
      return okResponse({ message: "Email already verified", email: user.email }, 200);
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      return errorResponse("No OTP found. Please request a new OTP.", 400);
    }

    const now = new Date();
    if (user.emailOtpExpiresAt.getTime() < now.getTime()) {
      return errorResponse("OTP has expired. Please request a new OTP.", 400);
    }

    const otpOk = await verifyOtp(otpValue, user.emailOtpHash);
    if (!otpOk) {
      return errorResponse("Incorrect OTP. Please try again.", 400);
    }

    user.isEmailVerified = true;
    user.emailOtpHash = undefined;
    user.emailOtpExpiresAt = undefined;
    await user.save();

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.json({
      message: "Email verified successfully",
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
    return errorResponse("Failed to verify OTP", 500);
  }
}

