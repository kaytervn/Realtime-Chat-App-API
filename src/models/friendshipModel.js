import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import Conversation from "./conversationModel.js";

const FriendshipSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 2], // 1: pending, 2: accepted
      default: 1,
    },
  },
  schemaOptions
);

addDateGetters(FriendshipSchema);

FriendshipSchema.pre("remove", async function (next) {
  try {
    await Conversation.deleteMany({ friendship: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Friendship = mongoose.model("Friendship", FriendshipSchema);
export default Friendship;
