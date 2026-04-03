import { Schema, model, models, Document, Model, Types } from "mongoose";
import "./Post";
import "./User";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Comment = (models.Comment as Model<IComment>) || model<IComment>("Comment", CommentSchema);

export default Comment;
