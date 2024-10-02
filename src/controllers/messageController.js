import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import {
  deleteFileByUrl,
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createMessage = async (req, res) => {
  try {
    const { conversationId, content, parentId, imageUrl } = req.body;
    const { user } = req;
    let parentMessage;
    if (parentId) {
      parentMessage = await Message.findById(parentId);
      if (!parentMessage) {
        return makeErrorResponse({
          res,
          message: "Parent message not found",
        });
      }
    }
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    await Message.create({
      conversation: conversation._id,
      user: user._id,
      content,
      imageUrl,
      parent: parentMessage?._id,
    });
    return makeSuccessResponse({
      res,
      message: "Create message success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id, content, imageUrl } = req.body;
    const message = await Message.findById(id);
    if (!message) {
      return makeErrorResponse({ res, message: "Message not found" });
    }
    if (message.imageUrl !== imageUrl) {
      await deleteFileByUrl(message.imageUrl);
    }
    await message.updateOne({ content });
    return makeSuccessResponse({ res, message: "Message updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const message = await Message.findById(id);
    if (!message) {
      return makeErrorResponse({ res, message: "Message not found" });
    }
    await message.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete message success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const id = req.params.id;
    const message = await Message.findById(id).populate([
      { path: "user", populate: { path: "role", select: "-permissions" } },
      {
        path: "conversation",
        populate: {
          path: "owner",
          populate: { path: "role", select: "-permissions" },
        },
      },
    ]);
    if (!message) {
      return makeErrorResponse({ res, message: "Message not found" });
    }
    return makeSuccessResponse({ res, data: message });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListMessages = async (req, res) => {
  try {
    req.query.getMessages = "1";
    const result = await getPaginatedData({
      model: Message,
      req,
      populateOptions: [
        { path: "user", populate: { path: "role", select: "-permissions" } },
      ],
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  createMessage,
  updateMessage,
  deleteMessage,
  getMessage,
  getListMessages,
};
