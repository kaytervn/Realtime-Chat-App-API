import Comment from "../models/commentModel.js";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createComment = async (req, res) => {
  try {
    const { postId, content, parentId } = req.body;
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
    });
    if (parentComment) {
      await Notification.create({
        user: parentComment.user._id,
        content: `${user.displayName} đã trả lời bình luận "${parentComment.content}"`,
      });
    }
    if (user._id != post.user._id) {
      await Notification.create({
        user: post.user._id,
        content: `${user.displayName} đã bình luận vào bài viết "${post.content}"`,
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
    const { id, content } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) {
      return makeErrorResponse({ res, message: "Comment not found" });
    }
    await comment.updateOne({ content });
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

const getListCommentsByPostId = async (req, res) => {
  try {
    const { parentId } = req.params;
    const result = await Comment.find({ parent: parentId });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListCommentsByParentId = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = await Comment.aggregate([
      {
        $match: { post: mongoose.Types.ObjectId(postId) },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parent",
          as: "children",
        },
      },
      {
        $addFields: {
          totalChildren: { $size: "$children" },
        },
      },
      {
        $project: {
          children: 0,
        },
      },
    ]);
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
  getListCommentsByPostId,
  getListCommentsByParentId,
};
