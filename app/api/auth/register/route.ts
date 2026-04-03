import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { DEFAULT_OTP_EXPIRY_MINUTES, generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse("Name, email, and password are required", 400);
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const otpExpiresAt = new Date(Date.now() + DEFAULT_OTP_EXPIRY_MINUTES * 60 * 1000);

    // If user exists but hasn't verified email yet, resend OTP.
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return errorResponse("Email is already in use", 409);
      }

      existingUser.emailOtpHash = otpHash;
      existingUser.emailOtpExpiresAt = otpExpiresAt;
      await existingUser.save();

      await sendOtpEmail({
        to: email,
        otp,
        purpose: "email_verification",
        expiresInMinutes: DEFAULT_OTP_EXPIRY_MINUTES,
      });

      return okResponse({ message: "OTP sent to email", email }, 200);
    }

    const hashedPassword = await hashPassword(password);
    const isFirstUser = (await User.countDocuments()) === 0;
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isFirstUser ? "admin" : "user",
      isEmailVerified: false,
      emailOtpHash: otpHash,
      emailOtpExpiresAt: otpExpiresAt,
    });

    await sendOtpEmail({
      to: user.email,
      otp,
      purpose: "email_verification",
      expiresInMinutes: DEFAULT_OTP_EXPIRY_MINUTES,
    });

    return okResponse(
      {
        message: "OTP sent to email",
        email: user.email,
        // Frontend redirects user to /verify-email with this email.
      },
      201
    );
  } catch {
    return errorResponse("Failed to register user", 500);
  }
}
