import PostReaction from "../models/postReactionModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createPostReaction = async (req, res) => {
  try {
    const { post, reaction } = req.body;
    const { user } = req;
    await PostReaction.create({
      user: user._id,
      post,
      reaction,
    });
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
    await postReaction.remove();
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
      populateOptions: "user reaction post",
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
