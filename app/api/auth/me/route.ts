import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api";

export async function GET(req: NextRequest) {
  const user = getAuthUserFromRequest(req);
  if (!user) {
    return errorResponse("Unauthorized", 401);
  }
  return okResponse({ user });
}
