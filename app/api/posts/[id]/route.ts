import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { getAuthUserFromRequest } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const post = await Post.findById(id).populate("author", "name");
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const comments = await Comment.find({ postId: id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    return okResponse({ post, comments });
  } catch {
    return errorResponse("Failed to fetch post", 500);
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = getAuthUserFromRequest(req);
    const { id } = await params;
    const { title, content, category, tags, coverImage } = await req.json();

    await connectToDatabase();
    const existing = await Post.findById(id);
    if (!existing) {
      return errorResponse("Post not found", 404);
    }

    if (!user || (user.role !== "admin" && existing.author.toString() !== user.userId)) {
      return errorResponse("Unauthorized", 401);
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        tags: Array.isArray(tags) ? tags : [],
        coverImage: coverImage || "",
      },
      { new: true }
    );

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    return okResponse({ message: "Post updated", post });
  } catch {
    return errorResponse("Failed to update post", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = getAuthUserFromRequest(req);
    await connectToDatabase();
    const { id } = await params;
    const existing = await Post.findById(id);
    if (!existing) {
      return errorResponse("Post not found", 404);
    }

    if (!user || (user.role !== "admin" && existing.author.toString() !== user.userId)) {
      return errorResponse("Unauthorized", 401);
    }

    const post = await Post.findByIdAndDelete(id);
    await Comment.deleteMany({ postId: id });

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    return okResponse({ message: "Post deleted" });
  } catch {
    return errorResponse("Failed to delete post", 500);
  }
}
