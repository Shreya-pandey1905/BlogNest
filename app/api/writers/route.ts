import { connectToDatabase } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/User";
import { errorResponse, okResponse } from "@/lib/api";

export type WriterPublic = {
  _id: string;
  name: string;
  count: number;
  role: string;
};

export async function GET() {
  try {
    await connectToDatabase();

    const writersData = await Post.aggregate([
      { $group: { _id: "$author", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "authorInfo" } },
      { $unwind: "$authorInfo" },
      { $project: { _id: 1, name: "$authorInfo.name", count: 1, role: "$authorInfo.role" } },
    ]);

    const writers = JSON.parse(JSON.stringify(writersData)) as WriterPublic[];
    return okResponse({ writers });
  } catch {
    return errorResponse("Failed to fetch writers", 500);
  }
}
