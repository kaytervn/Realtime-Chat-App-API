import Post from "../models/postModel.js";
import PostReaction from "../models/postReactionModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createPostReaction = async (req, res) => {
  try {
    const { postId } = req.body;
    const { user } = req;
    const post = await Post.findById(postId).populate("user");
    await PostReaction.create({
      user: user._id,
      post,
    });
    if (user._id != post.user._id) {
      await Notification.create({
        user: post.user._id,
        message: `${user.displayName} đã thả tim bài đăng "${post.content}"`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create post reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePostReaction = async (req, res) => {
  try {
    const id = req.params.id;
    const postReaction = await PostReaction.findById(id);
    if (!postReaction) {
      return makeErrorResponse({ res, message: "Post reaction not found" });
    }
    await postReaction.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete post reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPostReactions = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: PostReaction,
      req,
      populateOptions: "user post",
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createPostReaction, deletePostReaction, getPostReactions };
