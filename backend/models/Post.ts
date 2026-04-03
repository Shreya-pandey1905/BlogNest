import { Schema, model, models, Document, Model, Types } from "mongoose";
import "./User";

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  tags: string[];
  coverImage?: string;
  views: number;
  likes: number;
  likedBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
    coverImage: { type: String, default: "" },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", content: "text", category: "text", tags: "text" });

let PostModel: Model<IPost>;

if (models.Post) {
  const existingSchema = models.Post.schema;

  if (!existingSchema.path("views")) {
    existingSchema.add({ views: { type: Number, default: 0 } });
  }
  if (!existingSchema.path("likes")) {
    existingSchema.add({ likes: { type: Number, default: 0 } });
  }
  if (!existingSchema.path("likedBy")) {
    existingSchema.add({ likedBy: { type: [Schema.Types.ObjectId], ref: "User", default: [] } });
  }

  PostModel = models.Post as Model<IPost>;
} else {
  PostModel = model<IPost>("Post", PostSchema);
}

export default PostModel;
