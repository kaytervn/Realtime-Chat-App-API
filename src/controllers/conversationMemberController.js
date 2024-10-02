import ConversationMember from "../models/conversationMemberModel.js";
import Notification from "../models/notificationModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const addMember = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
    const member = await ConversationMember.create({
      conversation: conversationId,
      user: userId,
    });
    await Notification.create({
      user: userId,
      message: `Bạn đã được thêm vào cuộc trò chuyện "${conversationId}"`,
    });
    return makeSuccessResponse({
      res,
      message: "Member added to conversation",
      data: member,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
    await ConversationMember.findOneAndDelete({
      conversation: conversationId,
      user: userId,
    });
    await Notification.create({
      user: userId,
      message: `Bạn đã bị xóa khỏi cuộc trò chuyện "${conversationId}"`,
    });
    return makeSuccessResponse({
      res,
      message: "Member removed from conversation",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversationMembers = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: ConversationMember,
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

export { addMember, removeMember, getConversationMembers };
