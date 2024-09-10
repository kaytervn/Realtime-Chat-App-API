import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const PostReactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reaction",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  schemaOptions
);

addDateGetters(PostReactionSchema);

const PostReaction = mongoose.model("PostReaction", PostReactionSchema);
export default PostReaction;
