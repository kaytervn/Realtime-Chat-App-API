import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import ConversationMember from "./conversationMemberModel.js";
import Message from "./messageModel.js";

const ConversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null, // for group chats
    },
    avatarUrl: {
      type: String,
      default: null, // for group chats
    },
    kind: {
      type: Number,
      enum: [1, 2], // 1: group, 2: direct (personal chat)
      required: true,
    },
    friendship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Friendship",
      required: false, // for direct chats
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // for group chats
    },
  },
  schemaOptions
);

addDateGetters(ConversationSchema);

ConversationSchema.pre("remove", async function (next) {
  try {
    await ConversationMember.deleteMany({ conversation: this._id });
    const messages = await Message.find({ conversation: this._id });
    for (const message of messages) {
      await message.remove();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
