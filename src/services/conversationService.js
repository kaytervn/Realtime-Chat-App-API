import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import ConversationMember from "../models/conversationMemberModel.js";

const formatConversationData = async (conversation, currentUser) => {
  const lastMessage = await Message.findOne({
    conversation: conversation._id,
  })
    .populate("user")
    .sort({ createdAt: -1 });
  conversation.isOwner = currentUser._id.equals(conversation.owner) ? 1 : 0;
  conversation.lastMessage = lastMessage;
  if (conversation.kind === 2) {
    const isSender = conversation.friendship.sender._id.equals(currentUser._id);
    conversation.avatarUrl = isSender
      ? conversation.friendship.receiver.avatarUrl
      : conversation.friendship.sender.avatarUrl;
    conversation.name = isSender
      ? conversation.friendship.receiver.displayName
      : conversation.friendship.sender.displayName;
    conversation.lastLogin = isSender
      ? conversation.friendship.receiver.lastLogin
      : conversation.friendship.sender.lastLogin;
  }
  const currentMember = await ConversationMember.findOne({
    conversation: conversation._id,
    user: currentUser._id,
  });
  const totalMembers = await ConversationMember.countDocuments({
    conversation: conversation._id,
  });
  const totalUnreadMessages = await Message.countDocuments({
    conversation: conversation._id,
    createdAt: {
      $gt: currentMember?.lastReadMessage?.createdAt || new Date(0),
    },
  });
  return {
    _id: conversation._id,
    name: conversation.name,
    kind: conversation.kind,
    avatarUrl: conversation.avatarUrl,
    ...(conversation.kind === 2
      ? {
          lastLogin: formatDistanceToNow(conversation.lastLogin),
        }
      : {
          isOwner: conversation.isOwner,
          owner: {
            _id: conversation.owner,
          },
          canMessage: currentMember.canMessage,
          canUpdate: currentMember.canUpdate,
          canAddMember: currentMember.canAddMember,
        }),
    lastMessage: lastMessage
      ? {
          _id: lastMessage._id,
          user: {
            _id: lastMessage.user._id,
            displayName: lastMessage.user.displayName,
          },
          content: lastMessage.content,
          imageUrl: lastMessage.imageUrl,
          createdAt: formatDistanceToNow(lastMessage.createdAt),
        }
      : null,
    totalUnreadMessages: totalUnreadMessages,
    totalMembers: totalMembers,
  };
};

const getListConversations = async (req) => {
  const {
    name,
    kind,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {
    $or: [],
  };

  if (name) {
    query.$or.push(
      { name: { $regex: name, $options: "i" } },
      {
        $and: [
          {
            "friendship.sender.displayName": { $regex: name, $options: "i" },
          },
          { "friendship.sender._id": { $ne: currentUser._id } },
        ],
      },
      {
        $and: [
          {
            "friendship.receiver.displayName": { $regex: name, $options: "i" },
          },
          { "friendship.receiver._id": { $ne: currentUser._id } },
        ],
      }
    );
  }
  if (kind) {
    query.kind = Number(kind);
  }

  const conversations = await Conversation.find(query).populate({
    path: "friendship",
    populate: {
      path: "sender receiver",
    },
  });

  const conversationsWithMessages = await Promise.all(
    conversations.map(async (conversation) => {
      const lastMessage = await Message.findOne({
        conversation: conversation._id,
      })
        .populate("user")
        .sort({ createdAt: -1 });

      return { conversation, lastMessage };
    })
  );

  const sortedConversations = conversationsWithMessages
    .filter(({ lastMessage }) => lastMessage)
    .sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt)
    .map(({ conversation, lastMessage }) => ({
      ...conversation.toObject(),
      lastMessage,
    }));

  const paginatedConversations = sortedConversations.slice(
    offset,
    offset + limit
  );

  const result = await Promise.all(
    paginatedConversations.map((conversation) =>
      formatConversationData(conversation, currentUser)
    )
  );

  const totalElements = await Conversation.countDocuments(query);
  const totalPages = Math.ceil(totalElements / limit);

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatConversationData, getListConversations };
