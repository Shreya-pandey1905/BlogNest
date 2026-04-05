import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    const normalizedEmail = String(email ?? "").trim().toLowerCase();
    const passwordValue = String(newPassword ?? "");

    if (!normalizedEmail || !passwordValue) {
      return errorResponse("Email and new password are required", 400);
    }

    await connectToDatabase();
    const user = await User.findOne({ email: normalizedEmail });

    if (
      !user ||
      !user.passwordResetOtpHash ||
      !user.passwordResetOtpExpiresAt ||
      !user.passwordResetOtpVerifiedAt
    ) {
      return errorResponse("Please verify OTP first", 400);
    }

    if (user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
      return errorResponse("OTP has expired", 400);
    }

    user.password = await hashPassword(passwordValue);
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpiresAt = undefined;
    user.passwordResetOtpVerifiedAt = undefined;
    await user.save();

    return okResponse({ message: "Password updated successfully" }, 200);
  } catch {
    return errorResponse("Failed to reset password", 500);
  }
}

