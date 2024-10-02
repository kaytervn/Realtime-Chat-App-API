import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { getPostAggregationPipeline } from "../services/postUtils.js";

const createPost = async (req, res) => {
  try {
    const { content, imageUrl, status } = req.body;
    const { user } = req;
    await Post.create({
      user: user._id,
      content,
      imageUrl,
      status: status ? status : 1,
    });
    return makeSuccessResponse({
      res,
      message: "Create post success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id, content, imageUrl } = req.body;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.updateOne({ content, imageUrl });
    return makeSuccessResponse({ res, message: "Post updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const changeStatusPost = async (req, res) => {
  try {
    const { id, status, reason } = req.body;
    const { user } = req;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.updateOne({ status });
    if (!post.user._id.equals(user._id)) {
      await Notification.create({
        user: post.user._id,
        message:
          status === 2
            ? "Bài đăng của bạn đã được xét duyệt thành công"
            : `Bài đăng của bạn đã bị từ chối\nLý do: ${reason}`,
      });
    }
    return makeSuccessResponse({ res, message: "Post status changed" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const { user } = req;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.deleteOne();
    if (!post.user._id.equals(user._id)) {
      await Notification.create({
        user: post.user._id,
        message: `Bài đăng của bạn đã bị gỡ bỏ\nLý do: ${reason}`,
      });
    }
    return makeSuccessResponse({
      res,
      message: "Delete user success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.aggregate(getPostAggregationPipeline(id));
    if (!post || post.length === 0) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    return makeSuccessResponse({ res, data: post[0] });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListPosts = async (req, res) => {
  try {
    req.query.getPosts = "1";
    const result = await getPaginatedData({
      model: Post,
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
  createPost,
  updatePost,
  deletePost,
  getPost,
  getListPosts,
  changeStatusPost,
};
