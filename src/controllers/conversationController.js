import Conversation from "../models/conversationModel.js";
import ConversationMember from "../models/conversationMemberModel.js";
import {
  deleteFileByUrl,
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import Notification from "../models/notificationModel.js";
import {
  formatConversationData,
  getListConversations,
} from "../services/conversationService.js";

const createConversation = async (req, res) => {
  try {
    const { name, avatarUrl, conversationMembers } = req.body;
    const currentUser = req.user;
    if (conversationMembers.length < 2) {
      return makeErrorResponse({
        res,
        message: "Number of members must be at least 2",
      });
    }
    const conversation = await Conversation.create({
      name,
      kind: 1,
      avatarUrl: isValidUrl(avatarUrl) ? avatarUrl : null,
      owner: currentUser._id,
    });
    // Add current user to conversation
    await ConversationMember.create({
      conversation: conversation._id,
      user: currentUser._id,
      canAddMember: 1,
      canUpdate: 1,
    });
    // Add members to conversation
    await ConversationMember.create(
      conversationMembers.map((member) => ({
        conversation: conversation._id,
        user: member,
      }))
    );
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `Bạn đã được ${currentUser.displayName} thêm vào cuộc trò chuyện "${conversation.name}"`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Create conversation success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateConversation = async (req, res) => {
  try {
    const { id, name, avatarUrl } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    if (conversation.avatarUrl !== avatarUrl) {
      await deleteFileByUrl(conversation.avatarUrl);
    }
    await conversation.updateOne({ name, avatarUrl });
    const conversationMembers = await ConversationMember.find({
      conversation: id,
      user: { $ne: currentUser._id },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã cập nhật thông tin nhóm`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
    return makeSuccessResponse({ res, message: "Conversation updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    const conversationMembers = await ConversationMember.find({
      conversation,
      user: { $ne: currentUser._id },
    });
    await conversation.deleteOne();
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã xóa cuộc trò chuyện`,
        data: {
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
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
    const currentUser = req.user;
    const conversation = await Conversation.findById(id)
      .populate({
        path: "friendship",
        populate: {
          path: "sender receiver",
        },
      })
      .populate({
        path: "lastMessage",
        populate: {
          path: "user",
        },
      });
    if (!conversation) {
      return makeErrorResponse({ res, message: "Conversation not found" });
    }
    return makeSuccessResponse({
      res,
      data: await formatConversationData(conversation, currentUser),
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const result = await getListConversations(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateConversationPermission = async (req, res) => {
  try {
    const { id, canMessage, canUpdate, canAddMember } = req.body;
    const currentUser = req.user;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return makeErrorResponse({
        res,
        message: "Conversation not found",
      });
    }
    conversation.canMessage =
      canMessage !== undefined ? canMessage : conversation.canMessage;
    conversation.canUpdate =
      canUpdate !== undefined ? canUpdate : conversation.canUpdate;
    conversation.canAddMember =
      canAddMember !== undefined ? canAddMember : conversation.canAddMember;
    await conversation.save();
    const conversationMembers = await ConversationMember.find({
      conversation: id,
      user: { $ne: currentUser._id },
    });
    await Notification.create(
      conversationMembers.map((member) => ({
        message: `${currentUser.displayName} đã cập nhật quyền cho thành viên trong nhóm`,
        data: {
          conversation: {
            _id: conversation._id,
          },
          user: {
            _id: currentUser._id,
          },
        },
        user: member.user,
      }))
    );
    return makeSuccessResponse({
      res,
      message: "Permissions updated successfully",
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
  getConversations,
  updateConversationPermission,
};
