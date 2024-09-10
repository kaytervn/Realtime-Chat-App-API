import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

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
      enum: [1, 2, 3], // 1: pending, 2: accepted, 3: blocked
      default: 1,
    },
  },
  schemaOptions
);

addDateGetters(FriendshipSchema);

const Friendship = mongoose.model("Friendship", FriendshipSchema);
export default Friendship;
