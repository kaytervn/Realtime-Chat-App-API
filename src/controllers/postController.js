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
    const post = await Post.findById(id);
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.updateOne({ content, imageUrl });
    return makeSuccessResponse({ res, message: "Post updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    await post.deleteOne();
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
    const post = await Post.findById(id).populate("user");
    if (!post) {
      return makeErrorResponse({ res, message: "Post not found" });
    }
    return makeSuccessResponse({ res, data: post });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListPosts = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: Post,
      req,
      populateOptions: "user",
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
