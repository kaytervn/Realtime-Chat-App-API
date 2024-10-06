import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import {
  deleteFileByUrl,
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import {
  formatMessageData,
  getListMessages,
} from "../services/messageService.js";

const createMessage = async (req, res) => {
  try {
    const { conversation, content, parent, imageUrl } = req.body;
    const currrentUser = req.user;
    let parentMessage;
    if (isValidObjectId(parent)) {
      parentMessage = await Message.findById(parent);
      if (!parentMessage) {
        return makeErrorResponse({
          res,
          message: "Parent message not found",
        });
      }
    }
    if (!isValidObjectId(conversation)) {
      return makeErrorResponse({ res, message: "Invalid conversation" });
    }
    const getConversation = await Conversation.findById(conversation);
    if (!getConversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    await Message.create({
      conversation: getConversation._id,
      user: currrentUser._id,
      content,
      imageUrl: isValidUrl(imageUrl) ? imageUrl : null,
      parent: parentMessage ? parentMessage._id : null,
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
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id);
    if (message.imageUrl !== imageUrl) {
      await deleteFileByUrl(message.imageUrl);
    }
    await message.updateOne({
      content,
      imageUrl: isValidUrl(imageUrl) ? imageUrl : null,
    });
    return makeSuccessResponse({ res, message: "Message updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id);
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
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const message = await Message.findById(id).populate("user parent");
    return makeSuccessResponse({
      res,
      data: await formatMessageData(message, currentUser),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const result = await getListMessages(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createMessage, updateMessage, deleteMessage, getMessage, getMessages };
