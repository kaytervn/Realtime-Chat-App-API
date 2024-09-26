import Message from "../models/messageModel.js";
import MessageReaction from "../models/messageReactionModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.body;
    const { user } = req;
    const message = await Message.findById(messageId).populate("user");
    await MessageReaction.create({
      user: user._id,
      message,
    });
    if (user._id != message.user._id) {
      await Notification.create({
        user: message.user._id,
        content: `${user.displayName} đã thả tim tin nhắn của bạn`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create message reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteMessageReaction = async (req, res) => {
  try {
    const id = req.params.id;
    const messageReaction = await MessageReaction.findById(id);
    if (!messageReaction) {
      return makeErrorResponse({ res, message: "Message reaction not found" });
    }
    await messageReaction.remove();
    return makeSuccessResponse({
      res,
      message: "Delete message reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessageReactions = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: MessageReaction,
      req,
      populateOptions: "user message",
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createMessageReaction, deleteMessageReaction, getMessageReactions };
