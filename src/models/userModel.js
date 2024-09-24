import mongoose from "mongoose";
import {
  addDateGetters,
  formatDate,
  schemaOptions,
} from "../configurations/schemaConfig.js";
import Message from "./messageModel.js";
import ConversationMember from "./conversationMemberModel.js";
import Conversation from "./conversationModel.js";
import Comment from "./commentModel.js";
import MessageReaction from "./messageReactionModel.js";
import PostReaction from "./postReactionModel.js";
import Post from "./postModel.js";
import Notification from "./notificationModel.js";

const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
      get: formatDate,
    },
    otp: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
    secretKey: {
      type: String,
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    isSuperAdmin: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
  },
  schemaOptions
);

addDateGetters(UserSchema);

UserSchema.pre("remove", async function (next) {
  try {
    const conversations = await Conversation.find({ owner: this._id });
    for (const conversation of conversations) {
      await conversation.remove();
    }
    const messages = await Message.find({ user: this._id });
    for (const message of messages) {
      await message.remove();
    }
    const comments = await Comment.find({ user: this._id });
    for (const comment of comments) {
      await comment.remove();
    }
    await Notification.deleteMany({ user: this._id });
    await ConversationMember.deleteMany({ user: this._id });
    await Post.deleteMany({ user: this._id });
    await MessageReaction.deleteMany({ user: this._id });
    await PostReaction.deleteMany({ user: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
