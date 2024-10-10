import ConversationMember from "../models/conversationMemberModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import {
  isValidObjectId,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getListConversationMembers } from "../services/conversationMemberService.js";

const addMember = async (req, res) => {
  try {
    const { conversation, user } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(conversation) || !isValidObjectId(user)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const newMember = await User.findById(user);
    if (!newMember) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    const existingMember = await ConversationMember.findOne({
      conversation,
      user: newMember._id,
    });
    if (existingMember) {
      return makeErrorResponse({ res, message: "User already a member" });
    }
    await ConversationMember.create({
      conversation,
      user: newMember._id,
    });
    const notificationData = {
      user: {
        _id: currentUser._id,
      },
      conversation: {
        _id: conversation,
      },
    };
    const conversationMembers = await ConversationMember.find({
      conversation,
      user: { $nin: [currentUser._id, newMember._id] },
    });
    await Notification.create({
      user: newMember._id,
      data: notificationData,
      message: `${currentUser.displayName} đã thêm bạn vào cuộc trò chuyện`,
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã thêm ${newMember.displayName} vào cuộc trò chuyện`,
        data: notificationData,
        user: member.user,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Member added to conversation",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversationMember = await ConversationMember.findById(id).populate(
      "user"
    );
    await conversationMember.deleteOne();
    await Notification.create({
      user: conversationMember.user,
      message: `${currentUser.displayName} đã xóa bạn khỏi cuộc trò chuyện`,
      data: {
        user: {
          _id: currentUser._id,
        },
      },
      kind: 3,
    });
    const conversationMembers = await ConversationMember.find({
      conversation: conversationMember.conversation,
      user: { $nin: [currentUser._id, conversationMember.user._id] },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã xóa ${conversationMember.user.displayName} khỏi cuộc trò chuyện`,
        data: {
          user: {
            _id: currentUser._id,
            displayName: currentUser.displayName,
            avatarUrl: currentUser.avatarUrl,
          },
          conversation: {
            _id: conversationMember.conversation,
          },
        },
        user: member.user,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Member removed from conversation",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const grantPermissionForMember = async (req, res) => {
  try {
    const { conversationMember, canMessage, canUpdate, canAddMember } =
      req.body;
    const currentUser = req.user;
    if (!isValidObjectId(conversationMember)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const member = await ConversationMember.findById(conversationMember);
    if (!member) {
      return makeErrorResponse({
        res,
        message: "Conversation member not found",
      });
    }
    member.canMessage =
      canMessage !== undefined ? canMessage : member.canMessage;
    member.canUpdate = canUpdate !== undefined ? canUpdate : member.canUpdate;
    member.canAddMember =
      canAddMember !== undefined ? canAddMember : member.canAddMember;
    await member.save();
    await Notification.create({
      user: member.user,
      message: `${currentUser.displayName} đã cập nhật quyền cho bạn trong cuộc trò chuyện`,
      data: {
        conversation: {
          _id: member.conversation,
        },
        user: {
          _id: currentUser._id,
        },
      },
    });
    return makeSuccessResponse({
      res,
      message: "Permissions updated successfully",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversationMembers = async (req, res) => {
  try {
    const result = await getListConversationMembers(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export {
  addMember,
  removeMember,
  getConversationMembers,
  grantPermissionForMember,
};
