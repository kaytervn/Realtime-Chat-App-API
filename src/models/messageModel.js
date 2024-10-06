import mongoose from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";
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
    imageUrl: {
      type: String,
      default: null,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  schemaOptions
);

MessageSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await deleteFileByUrl(this.content);
      await MessageReaction.deleteMany({ message: this._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
