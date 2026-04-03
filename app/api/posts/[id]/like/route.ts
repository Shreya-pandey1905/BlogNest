import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import { errorResponse, okResponse } from "@/lib/api";
import { getAuthUserFromRequest } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const post = await Post.findById(id).select("likes likedBy");
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    const user = getAuthUserFromRequest(req);
    const liked =
      !!user
        ? await Post.exists({
            _id: id,
            likedBy: new Types.ObjectId(user.userId),
          })
        : false;

    return okResponse({ likes: post.likes ?? 0, liked });
  } catch {
    return errorResponse("Failed to fetch like state", 500);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    await connectToDatabase();
    const { id } = await params;

    const userObjectId = new Types.ObjectId(user.userId);
    const alreadyLiked = await Post.exists({ _id: id, likedBy: userObjectId });

    const post = await Post.findById(id).select("likes");
    if (!post) {
      return errorResponse("Post not found", 404);
    }

    if (alreadyLiked) {
      const updated = await Post.findByIdAndUpdate(
        id,
        {
          $pull: { likedBy: userObjectId },
          $inc: { likes: -1 },
        },
        { new: true }
      );

      return okResponse({
        liked: false,
        likes: Math.max(0, (updated?.likes ?? 0) as number),
      });
    }

    const updated = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: { likedBy: userObjectId },
        $inc: { likes: 1 },
      },
      { new: true }
    );

    return okResponse({
      liked: true,
      likes: Math.max(0, (updated?.likes ?? 0) as number),
    });
  } catch (err) {
    console.error("Like toggle failed:", err);
    return errorResponse("Failed to toggle like", 500);
  }
}

