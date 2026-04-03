import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { errorResponse, okResponse } from "@/lib/api";
import { getAuthUserFromRequest } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const user = getAuthUserFromRequest(req);
    const post = await Post.findById(id).select("views author");

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    // Do not count views from the post owner.
    if (user && post.author?.toString() === user.userId) {
      return okResponse({ views: post.views ?? 0 });
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updated) {
      return errorResponse("Post not found", 404);
    }

    return okResponse({ views: updated.views ?? 0 });
  } catch (err) {
    console.error("Increase views failed:", err);
    return errorResponse("Failed to increase views", 500);
  }
}

