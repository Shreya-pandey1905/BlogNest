import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { getAuthUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    await connectToDatabase();
    const posts = await Post.find({ author: user.userId })
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .lean();

    return okResponse({ posts });
  } catch {
    return errorResponse("Failed to fetch your posts", 500);
  }
}
