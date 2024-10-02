import mongoose from "mongoose";

const getPostByFriends = (aggregationPipeline, currentUserId) => {
  aggregationPipeline.push(
    {
      $lookup: {
        from: "friendships",
        let: { postUserId: "$user" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $or: [
                      {
                        $eq: [
                          "$sender",
                          new mongoose.Types.ObjectId(currentUserId),
                        ],
                      },
                      {
                        $eq: [
                          "$receiver",
                          new mongoose.Types.ObjectId(currentUserId),
                        ],
                      },
                    ],
                  },
                  {
                    $or: [
                      { $eq: ["$sender", "$$postUserId"] },
                      { $eq: ["$receiver", "$$postUserId"] },
                    ],
                  },
                ],
              },
            },
          },
          {
            $match: { status: 2 },
          },
          {
            $project: {
              sender: 1,
              receiver: 1,
            },
          },
        ],
        as: "friendships",
      },
    },
    {
      $match: {
        "friendships.0": { $exists: true },
      },
    },
    {
      $project: {
        friendships: 0,
      },
    }
  );
};

const addFieldTotalComments = (aggregationPipeline) => {
  aggregationPipeline.push(
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        totalComments: { $size: "$comments" },
      },
    },
    {
      $project: {
        comments: 0,
      },
    }
  );
};

const addFieldTotalChildrenToComments = (aggregationPipeline) => {
  aggregationPipeline.push(
    {
      $match: {
        parent: null,
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "parent",
        as: "childrenComments",
      },
    },
    {
      $addFields: {
        totalChildren: { $size: "$childrenComments" },
      },
    },
    {
      $project: {
        childrenComments: 0,
      },
    }
  );
};

const addFieldTotalReactionsToComments = (aggregationPipeline) => {
  aggregationPipeline.push(
    {
      $lookup: {
        from: "commentreactions",
        localField: "_id",
        foreignField: "comment",
        as: "reactions",
      },
    },
    {
      $addFields: {
        totalReactions: { $size: "$reactions" },
      },
    },
    {
      $project: {
        reactions: 0,
      },
    }
  );
};

const addFieldTotalReactionsToMessages = (aggregationPipeline) => {
  aggregationPipeline.push(
    {
      $lookup: {
        from: "messagereactions",
        localField: "_id",
        foreignField: "message",
        as: "reactions",
      },
    },
    {
      $addFields: {
        totalReactions: { $size: "$reactions" },
      },
    },
    {
      $project: {
        reactions: 0,
      },
    }
  );
};

const addFieldTotalReactions = (aggregationPipeline) => {
  aggregationPipeline.push(
    {
      $lookup: {
        from: "postreactions",
        localField: "_id",
        foreignField: "post",
        as: "reactions",
      },
    },
    {
      $addFields: {
        totalReactions: { $size: "$reactions" },
      },
    },
    {
      $project: {
        reactions: 0,
      },
    }
  );
};

const getPostAggregationPipeline = (id) => {
  let aggregationPipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "roles",
        localField: "user.role",
        foreignField: "_id",
        as: "user.role",
      },
    },
    { $unwind: "$user.role" },
    {
      $project: {
        "user.role.permissions": 0,
      },
    },
  ];
  addFieldTotalComments(aggregationPipeline);
  addFieldTotalReactions(aggregationPipeline);
  return aggregationPipeline;
};

export {
  getPostByFriends,
  addFieldTotalComments,
  addFieldTotalReactions,
  getPostAggregationPipeline,
  addFieldTotalChildrenToComments,
  addFieldTotalReactionsToComments,
  addFieldTotalReactionsToMessages,
};
