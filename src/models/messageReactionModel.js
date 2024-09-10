import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const MessageReactionSchema = new mongoose.Schema(
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
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
  },
  schemaOptions
);

addDateGetters(MessageReactionSchema);

const MessageReaction = mongoose.model(
  "MessageReaction",
  MessageReactionSchema
);
export default MessageReaction;
