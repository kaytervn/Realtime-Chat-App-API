import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import PostReaction from "./postReactionModel.js";
import Comment from "./commentModel.js";
import { deleteFileByUrl } from "../services/apiService.js";

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      enum: [1, 2, 3], // 1: pending, 2: accepted, 3: rejected
      default: 1,
    },
  },
  schemaOptions
);

addDateGetters(PostSchema);

PostSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.imageUrl);
      const comments = await Comment.find({ post: this._id });
      for (const comment of comments) {
        await comment.deleteOne();
      }
      await PostReaction.deleteMany({ post: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
