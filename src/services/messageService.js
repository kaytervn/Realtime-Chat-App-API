import mongoose from "mongoose";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import Message from "../models/messageModel.js";
import MessageReaction from "../models/messageReactionModel.js";
import { isValidObjectId } from "./apiService.js";
import ConversationMember from "../models/conversationMemberModel.js";

const formatMessageData = async (message, currentUser) => {
  const reactions = await MessageReaction.find({ message: message._id });
  message.isOwner = message.user._id.equals(currentUser._id) ? 1 : 0;
  message.isUpdated =
    message.updatedAt.getTime() !== message.createdAt.getTime() ? 1 : 0;
  message.isReacted = (await MessageReaction.exists({
    user: currentUser._id,
    message: message._id,
  }))
    ? 1
    : 0;
  message.isChildren = message.parent ? 1 : 0;
  message.totalReactions = reactions.length;

  return {
    _id: message._id,
    conversation: {
      _id: message.conversation,
    },
    user: {
      _id: message.user._id,
      displayName: message.user.displayName,
      avatarUrl: message.user.avatarUrl,
    },
    content: message.content,
    imageUrl: message.imageUrl,
    createdAt: formatDistanceToNowStrict(message.createdAt, {
      addSuffix: true,
      locale: vi,
    }),
    isOwner: message.isOwner,
    isUpdated: message.isUpdated,
    isReacted: message.isReacted,
    isChildren: message.isChildren,
    ...(message.isChildren === 1 &&
      message.parent && {
        parent: {
          _id: message.parent._id,
          user: {
            _id: message.parent.user._id,
            displayName: message.parent.user.displayName,
            avatarUrl: message.parent.user.avatarUrl,
          },
        },
      }),
    totalReactions: message.totalReactions,
  };
};

const getListMessages = async (req) => {
  const {
    content,
    parent,
    isPaged,
    conversation,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (isValidObjectId(parent)) {
    query.parent = new mongoose.Types.ObjectId(parent);
  }
  if (content) {
    query.content = { $regex: content, $options: "i" };
  }
  if (isValidObjectId(conversation)) {
    query.conversation = new mongoose.Types.ObjectId(conversation);
    const [lastMessage, conversationMembers] = await Promise.all([
      Message.findOne({ conversation }).sort({ createdAt: -1 }),
      ConversationMember.find({ conversation }).select("user"),
    ]);
    if (
      lastMessage &&
      conversationMembers.some((member) => member.user.equals(currentUser._id))
    ) {
      await ConversationMember.findOneAndUpdate(
        {
          conversation,
          user: currentUser._id,
        },
        {
          lastReadMessage: lastMessage._id,
        }
      );
    }
  }

  const [totalElements, messages] = await Promise.all([
    Message.countDocuments(query),
    Message.find(query)
      .populate("user parent")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = await Promise.all(
    messages.map(async (message) => {
      return await formatMessageData(message, currentUser);
    })
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatMessageData, getListMessages };
