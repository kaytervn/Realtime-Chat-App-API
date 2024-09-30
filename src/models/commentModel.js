import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import CommentReaction from "./commentReactionModel.js";

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

CommentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const commentId = this._id;
    try {
      await this.model("Comment").deleteMany({ parent: commentId });
      await CommentReaction.deleteMany({ comment: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
