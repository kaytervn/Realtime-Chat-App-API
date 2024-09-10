import mongoose from "mongoose";
import { addDateGetters, schemaOptions } from "../configurations/schemaConfig";

const MessageSchema = new mongoose.Schema(
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
    content: {
      type: String,
      default: null,
    },
    kind: {
      type: Number,
      enum: [1, 2, 3], // 1: text, 2: file, 3: image
      default: 1,
    },
    isDeleted: {
      type: Number,
      enum: [0, 1], // 0: false, 1: true
      default: 0,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  schemaOptions
);

addDateGetters(MessageSchema);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
