import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";
import { getAuthUserFromRequest } from "@/lib/auth";
import { errorResponse, okResponse } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUserFromRequest(req);
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return errorResponse("No file uploaded", 400);
    }

    if (!file.type.startsWith("image/")) {
      return errorResponse("Only image files are allowed", 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return okResponse({ url: `/uploads/${fileName}` }, 201);
  } catch {
    return errorResponse("Failed to upload image", 500);
  }
}
