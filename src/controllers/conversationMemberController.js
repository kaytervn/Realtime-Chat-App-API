import ConversationMember from "../models/conversationMemberModel.js";
import Notification from "../models/notificationModel.js";
import {
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
      content: `Bạn đã được thêm vào cuộc trò chuyện "${conversationId}"`,
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
      content: `Bạn đã bị xóa khỏi cuộc trò chuyện "${conversationId}"`,
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
    const { conversationId } = req.params;
    const members = await ConversationMember.find({
      conversation: conversationId,
    }).populate("user");
    return makeSuccessResponse({
      res,
      data: members,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { addMember, removeMember, getConversationMembers };
