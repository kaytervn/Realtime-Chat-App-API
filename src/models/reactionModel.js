import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import PostReaction from "./postReactionModel.js";
import MessageReaction from "./messageReactionModel.js";

const ReactionSchema = new mongoose.Schema(
  {
    name: {
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

addDateGetters(ReactionSchema);

ReactionSchema.pre("remove", async function (next) {
  try {
    await MessageReaction.deleteMany({ reaction: this._id });
    await PostReaction.deleteMany({ reaction: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
