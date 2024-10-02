import Comment from "../models/commentModel.js";
import CommentReaction from "../models/commentReactionModel.js";
import Notification from "../models/notificationModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createCommentReaction = async (req, res) => {
  try {
    const { commentId } = req.body;
    const { user } = req;
    const comment = Comment.findById(commentId).populate("user");
    if (!comment) {
      return makeErrorResponse({ res, message: "Comment not found" });
    }
    await CommentReaction.create({
      user: user._id,
      comment: comment._id,
      reaction,
    });
    if (!user._id.equals(comment.user._id)) {
      await Notification.create({
        user: comment.user._id,
        message: `${user.displayName} đã thả tim bình luận "${comment.content}"`,
      });
    }
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
    const commentId = req.params.id;
    const commentReaction = await CommentReaction.findOne({
      comment: commentId,
      user: req.user._id,
    });
    if (!commentReaction) {
      return makeErrorResponse({ res, message: "Comment reaction not found" });
    }
    await commentReaction.deleteOne();
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
      populateOptions: [
        { path: "user", populate: { path: "role", select: "-permissions" } },
      ],
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
