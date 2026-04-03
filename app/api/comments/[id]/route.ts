import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { getAuthUserFromRequest } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api";
import Comment from "@/models/Comment";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    await connectToDatabase();
    const { id } = await params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return errorResponse("Comment not found", 404);
    }

    const isAdmin = user.role === "admin";
    const isCommentOwner = comment.userId.toString() === user.userId;
    if (!isAdmin && !isCommentOwner) {
      return errorResponse("Forbidden", 403);
    }

    await comment.deleteOne();

    return okResponse({ message: "Comment deleted" });
  } catch {
    return errorResponse("Failed to delete comment", 500);
  }
}
