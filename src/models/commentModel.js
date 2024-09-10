import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  schemaOptions
);

addDateGetters(CommentSchema);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
