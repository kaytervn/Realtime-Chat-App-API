import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const ConversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null, // for group chats
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    kind: {
      type: Number,
      enum: [1, 2], // 1: group, 2: direct (personal chat)
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  schemaOptions
);

addDateGetters(ConversationSchema);

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
