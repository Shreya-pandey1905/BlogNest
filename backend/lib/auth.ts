import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

const TOKEN_COOKIE = "blog_token";

export type AuthUser = {
  userId: string;
  role: "admin" | "user";
  name: string;
  email: string;
};

export function getTokenCookieName() {
  return TOKEN_COOKIE;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export function signToken(payload: AuthUser) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.verify(token, JWT_SECRET) as AuthUser;
}

export function getAuthUserFromRequest(req: NextRequest): AuthUser | null {
  const bearer = req.headers.get("authorization");
  const cookieToken = req.cookies.get(TOKEN_COOKIE)?.value;
  const token = bearer?.startsWith("Bearer ")
    ? bearer.replace("Bearer ", "")
    : cookieToken;

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getAuthUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}
