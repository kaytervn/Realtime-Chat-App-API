import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const ConversationMemberSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    canMessage: {
      type: Number,
      enum: [0, 1], // 0: false, 1: true
      default: 1,
    },
    canUpdate: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    canAddMember: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  schemaOptions
);

addDateGetters(ConversationMemberSchema);

const ConversationMember = mongoose.model(
  "ConversationMember",
  ConversationMemberSchema
);
export default ConversationMember;
