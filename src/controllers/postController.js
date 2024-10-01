import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";
import Post from "../models/postModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const { user } = req;
    await Post.create({
      user: user._id,
      content,
      imageUrl,
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
    const { user } = req;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.updateOne({ content, imageUrl });
    if (!post.user._id.equals(user._id)) {
      await Notification.create({
        user: post.user._id,
        message: "Bài đăng của bạn đã được quản trị viên cập nhật",
      });
    }
    return makeSuccessResponse({ res, message: "Post updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { user } = req;
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.deleteOne();
    if (!post.user._id.equals(user._id)) {
      await Notification.create({
        user: post.user._id,
        message: "Bài đăng của bạn đã bị quản trị viên gỡ bỏ",
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
    aggregationPipeline.push({
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    });
    aggregationPipeline.push({
      $addFields: {
        totalComments: { $size: "$comments" },
      },
    });
    aggregationPipeline.push({
      $project: {
        comments: 0,
      },
    });
    aggregationPipeline.push({
      $lookup: {
        from: "postreactions",
        localField: "_id",
        foreignField: "post",
        as: "reactions",
      },
    });
    aggregationPipeline.push({
      $addFields: {
        totalReactions: { $size: "$reactions" },
      },
    });
    aggregationPipeline.push({
      $project: {
        reactions: 0,
      },
    });
    const post = await Post.aggregate(aggregationPipeline);

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
    const result = await getPaginatedData({
      model: Post,
      req,
      populateOptions: [
        { path: "user", populate: { path: "role", select: "-permissions" } },
      ],
      customFields: ["totalComments", "totalReactions"],
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createPost, updatePost, deletePost, getPost, getListPosts };
