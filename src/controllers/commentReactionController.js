import CommentReaction from "../models/commentReactionModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createCommentReaction = async (req, res) => {
  try {
    const { comment, reaction } = req.body;
    const { user } = req;
    await CommentReaction.create({
      user: user._id,
      comment,
      reaction,
    });
    return makeSuccessResponse({
      res,
      message: "Create comment reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteCommentReaction = async (req, res) => {
  try {
    const id = req.params.id;
    const commentReaction = await CommentReaction.findById(id);
    if (!commentReaction) {
      return makeErrorResponse({ res, message: "Comment reaction not found" });
    }
    await commentReaction.remove();
    return makeSuccessResponse({
      res,
      message: "Delete comment reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getCommentReactions = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: CommentReaction,
      req,
      populateOptions: "user reaction comment",
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createCommentReaction, deleteCommentReaction, getCommentReactions };
