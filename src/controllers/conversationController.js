import Conversation from "../models/conversationModel.js";
import ConversationMember from "../models/conversationMemberModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import Notification from "../models/notificationModel.js";

const createConversation = async (req, res) => {
  try {
    const { name, avatarUrl, memberIds } = req.body;
    const { user } = req;
    if (memberIds.length < 2) {
      return makeErrorResponse({
        res,
        message: "Number of members must be at least 2",
      });
    }
    const conversation = await Conversation.create({
      name,
      avatarUrl,
      kind: 1,
      owner: user._id,
    });
    // Add current user to conversation
    await ConversationMember.create({
      conversation: conversation._id,
      user: user._id,
    });
    // Add members to conversation
    await ConversationMember.create(
      memberIds.map((userId) => ({
        conversation: conversation._id,
        user: userId,
      }))
    );
    await Notification.create(
      memberIds.map((userId) => ({
        message: `Bạn được ${user.displayName} thêm vào cuộc trò chuyện "${name}"`,
        user: userId,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Create conversation success",
      data: conversation,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { id, name, avatarUrl } = req.body;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    await conversation.updateOne({ name, avatarUrl });
    return makeSuccessResponse({ res, message: "Conversation updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    await conversation.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete conversation success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const conversation = await Conversation.findById(id).populate([
      { path: "owner", populate: { path: "role", select: "-permissions" } },
    ]);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    return makeSuccessResponse({ res, data: conversation });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListConversations = async (req, res) => {
  try {
    const { user } = req;
    const result = await getPaginatedData({
      model: ConversationMember,
      req,
      queryOptions: { user: user._id },
      populateOptions: [
        { path: "owner", populate: { path: "role", select: "-permissions" } },
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
  createConversation,
  updateConversation,
  deleteConversation,
  getConversation,
  getListConversations,
};
