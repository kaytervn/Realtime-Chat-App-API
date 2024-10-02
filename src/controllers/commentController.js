import Comment from "../models/commentModel.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import {
  deleteFileByUrl,
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createComment = async (req, res) => {
  try {
    const { postId, content, parentId, imageUrl } = req.body;
    const { user } = req;
    let parentComment;
    if (parentId) {
      parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return makeErrorResponse({ res, message: "Parent comment not found" });
      }
    }
    const post = await Post.findById(postId);
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await Comment.create({
      user: user._id,
      post: post._id,
      content,
      parent: parentComment?._id,
      imageUrl,
    });
    if (parentComment) {
      await Notification.create({
        user: parentComment.user._id,
        message: `${user.displayName} đã trả lời bình luận "${parentComment.content}"`,
      });
    }
    if (!user._id.equals(post.user._id)) {
      await Notification.create({
        user: post.user._id,
        message: `${user.displayName} đã bình luận vào bài viết "${post.content}"`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Create comment success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id, content, imageUrl } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) {
      return makeErrorResponse({ res, message: "Comment not found" });
    }
    if (comment.imageUrl !== imageUrl) {
      await deleteFileByUrl(comment.imageUrl);
    }
    await comment.updateOne({ content, imageUrl });
    return makeSuccessResponse({ res, message: "Comment updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const comment = await Comment.findById(id);
    if (!comment) {
      return makeErrorResponse({ res, message: "Comment not found" });
    }
    await comment.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete comment success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    return makeSuccessResponse({ res, data: post });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListComments = async (req, res) => {
  try {
    req.query.getComments = "1";
    const result = await getPaginatedData({
      model: Comment,
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

export {
  createComment,
  updateComment,
  deleteComment,
  getComment,
  getListComments,
};
