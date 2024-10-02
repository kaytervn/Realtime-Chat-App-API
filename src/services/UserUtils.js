import mongoose from "mongoose";

const getListUsersIgnoreFriendships = (aggregationPipeline, currentUserId) => {
  aggregationPipeline.push({
    $lookup: {
      from: "friendships",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $eq: ["$sender", "$$userId"] },
                { $eq: ["$receiver", "$$userId"] },
              ],
            },
          },
        },
        {
          $match: {
            $or: [
              { sender: new mongoose.Types.ObjectId(currentUserId) },
              { receiver: new mongoose.Types.ObjectId(currentUserId) },
            ],
          },
        },
      ],
      as: "friendshipInfo",
    },
  });
  aggregationPipeline.push({
    $match: {
      friendshipInfo: { $eq: [] },
    },
  });
};

const getUserFriendships = (aggregationPipeline, currentUserId) => {
  aggregationPipeline.push(
    {
      $match: {
        $or: [
          { sender: new mongoose.Types.ObjectId(currentUserId) },
          { receiver: new mongoose.Types.ObjectId(currentUserId) },
        ],
      },
    },
    {
      $addFields: {
        friend: {
          $cond: {
            if: {
              $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)],
            },
            then: "$receiver",
            else: "$sender",
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "friend",
        foreignField: "_id",
        as: "friendInfo",
      },
    },
    {
      $unwind: "$friendInfo",
    }
  );
};

const getUserConversations = (aggregationPipeline, currentUserId) => {
  aggregationPipeline.push({
    $lookup: {
      from: "conversationmembers",
      let: { conversationId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$conversation", "$$conversationId"] },
                { $eq: ["$user", new mongoose.Types.ObjectId(currentUserId)] },
              ],
            },
          },
        },
      ],
      as: "groupMembers",
    },
  });
  aggregationPipeline.push({
    $match: {
      $or: [{ kind: 1, groupMembers: { $ne: [] } }, { kind: 2 }],
    },
  });
  aggregationPipeline.push({
    $lookup: {
      from: "friendships",
      localField: "friendship",
      foreignField: "_id",
      as: "friendshipDetails",
    },
  });
  aggregationPipeline.push({
    $match: {
      $or: [
        { kind: 1 },
        {
          kind: 2,
          friendshipDetails: {
            $elemMatch: {
              $or: [
                { sender: new mongoose.Types.ObjectId(currentUserId) },
                { receiver: new mongoose.Types.ObjectId(currentUserId) },
              ],
            },
          },
        },
      ],
    },
  });
};

export {
  getListUsersIgnoreFriendships,
  getUserFriendships,
  getUserConversations,
};
