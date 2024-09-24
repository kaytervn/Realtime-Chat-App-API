import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import PostReaction from "./postReactionModel.js";
import Comment from "./commentModel.js";

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
  },
  schemaOptions
);

addDateGetters(PostSchema);

PostSchema.pre("remove", async function (next) {
  try {
    const comments = await Comment.find({ post: this._id });
    for (const comment of comments) {
      await comment.remove();
    }
    await PostReaction.deleteMany({ post: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
