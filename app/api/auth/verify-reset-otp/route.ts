import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { verifyOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    // OTP should be numeric; stripping non-digits avoids failures from copy/paste artifacts.
    const otpValue = String(otp ?? "").replace(/\D/g, "").trim().slice(0, 6);

    if (!normalizedEmail || !otpValue) {
      return errorResponse("Email and OTP are required", 400);
    }

    if (otpValue.length !== 6) {
      return errorResponse("Please enter the 6-digit OTP only.", 400);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return errorResponse("No account found for this email", 400);
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return errorResponse("No OTP found. Please request a new OTP.", 400);
    }

    if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      return errorResponse("OTP has expired. Please request a new OTP.", 400);
    }

    const ok = await verifyOtp(otpValue, user.passwordResetOtpHash);
    if (!ok) {
      return errorResponse("Incorrect OTP. Please try again.", 400);
    }

    user.passwordResetOtpVerifiedAt = new Date();
    await user.save();

    return okResponse({ message: "OTP verified. You can now reset your password." }, 200);
  } catch {
    return errorResponse("Failed to verify OTP", 500);
  }
}

