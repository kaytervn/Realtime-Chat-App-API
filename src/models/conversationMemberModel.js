import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";

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
  },
  schemaOptions
);

addDateGetters(ConversationMemberSchema);

const ConversationMember = mongoose.model(
  "ConversationMember",
  ConversationMemberSchema
);
export default ConversationMember;
