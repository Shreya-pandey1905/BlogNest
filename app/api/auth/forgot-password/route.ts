import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { okResponse, errorResponse } from "@/lib/api";
import { DEFAULT_OTP_EXPIRY_MINUTES, generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();

    if (!normalizedEmail) {
      return errorResponse("Email is required", 400);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      const otp = generateOtp();
      user.passwordResetOtpHash = await hashOtp(otp);
      user.passwordResetOtpExpiresAt = new Date(
        Date.now() + DEFAULT_OTP_EXPIRY_MINUTES * 60 * 1000,
      );
      await user.save();

      await sendOtpEmail({
        to: user.email,
        otp,
        purpose: "password_reset",
        expiresInMinutes: DEFAULT_OTP_EXPIRY_MINUTES,
      });
    }

    // Don't reveal whether the user exists.
    return okResponse({ message: "If your email exists, an OTP has been sent." }, 200);
  } catch {
    return errorResponse("Failed to send OTP", 500);
  }
}

