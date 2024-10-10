import Friendship from "../models/friendshipModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import StoryView from "../models/storyViewModel.js";
import Story from "../models/storyModel.js";
import mongoose from "mongoose";

const formatStoryData = async (story, currentUser) => {
  const views = await StoryView.find({ story: story._id });
  story.isOwner = story.user._id.equals(currentUser._id) ? 1 : 0;
  story.totalViews = views.length;
  story.isViewed = (await StoryView.exists({
    user: currentUser._id,
    story: story._id,
  }))
    ? 1
    : 0;
  return {
    _id: story._id,
    imageUrl: story.imageUrl,
    user: {
      _id: story.user._id,
      displayName: story.user.displayName,
      avatarUrl: story.user.avatarUrl,
    },
    createdAt: formatDistanceToNow(story.createdAt),
    isViewed: story.isViewed,
    isOwner: story.isOwner,
    totalViews: story.totalViews,
  };
};

const getListStories = async (req) => {
  const {
    user,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const friendships = await Friendship.find({
    $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    status: 2,
  });

  const friendIds = friendships.map((friendship) =>
    friendship.sender.equals(currentUser._id)
      ? friendship.receiver
      : friendship.sender
  );

  let query = { user: { $in: [...friendIds, currentUser._id] } };
  if (mongoose.isValidObjectId(user)) {
    query.user = new mongoose.Types.ObjectId(user);
  }

  const [totalElements, stories] = await Promise.all([
    Story.countDocuments(query),
    Story.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const viewedStoryIds = new Set(
    (await StoryView.find({ user: currentUser._id }).distinct("story")).map(
      String
    )
  );

  const sortedStories = stories.map((story) => ({
    ...story.toObject(),
    isViewed: viewedStoryIds.has(story._id.toString()),
  }));

  sortedStories.sort((a, b) => {
    if (a.isViewed !== b.isViewed) return a.isViewed ? 1 : -1;
    return b.createdAt - a.createdAt;
  });

  const result = await Promise.all(
    sortedStories.map((story) => formatStoryData(story, currentUser))
  );

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { formatStoryData, getListStories };
