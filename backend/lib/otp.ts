import bcrypt from "bcryptjs";

export const DEFAULT_OTP_LENGTH = 6;
export const DEFAULT_OTP_EXPIRY_MINUTES = 10;

export function generateOtp(length = DEFAULT_OTP_LENGTH) {
  // Generates a numeric OTP like 483920
  const min = length === 6 ? 100000 : 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function hashOtp(otp: string) {
  // OTP is short-lived; bcrypt is fast enough for this use case.
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(otp: string, otpHash: string) {
  return bcrypt.compare(otp, otpHash);
}

