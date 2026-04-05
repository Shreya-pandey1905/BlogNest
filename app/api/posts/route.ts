import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";
import { getAuthUserFromRequest } from "@/lib/auth";
import { getCategoryMeta } from "@/utils/categories";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const author = searchParams.get("author");

    const query: Record<string, unknown> = {};
    if (category) {
      query.category = category;
    }
    if (author && Types.ObjectId.isValid(author)) {
      query.author = author;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query).populate("author", "name").sort({ createdAt: -1 });
    const categoryNames = await Post.distinct("category");
    const categories = categoryNames.map((name: string) => getCategoryMeta(name));
    return okResponse({ posts, categories });
  } catch {
    return errorResponse("Failed to fetch posts", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { title, content, category, tags, coverImage } = await req.json();
    if (!title || !content || !category) {
      return errorResponse("Title, content, and category are required", 400);
    }

    await connectToDatabase();
    const post = await Post.create({
      title,
      content,
      category,
      tags: Array.isArray(tags) ? tags : [],
      coverImage: coverImage || "",
      author: user.userId,
    });

    return okResponse({ message: "Post created", post }, 201);
  } catch {
    return errorResponse("Failed to create post", 500);
  }
}
