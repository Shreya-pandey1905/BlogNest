import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { text } = await req.json();
    if (!text) {
      return errorResponse("Comment text is required", 400);
    }

    await connectToDatabase();
    const { id } = await params;

    const post = await Post.findById(id);
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const comment = await Comment.create({
      postId: id,
      userId: user.userId,
      text,
    });

    return okResponse({ message: "Comment added", comment }, 201);
  } catch {
    return errorResponse("Failed to add comment", 500);
  }
}
