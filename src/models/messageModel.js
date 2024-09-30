import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import MessageReaction from "./messageReactionModel.js";
import { deleteFileByUrl } from "../services/apiService.js";

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
      enum: [1, 2], // 1: text, 2: image
      default: 1,
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

MessageSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      if (this.kind == 2) {
        await deleteFileByUrl(this.content);
      }
      await MessageReaction.deleteMany({ message: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
