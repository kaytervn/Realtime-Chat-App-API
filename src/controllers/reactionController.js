import Reaction from "../models/reactionModel.js";
import {
  getPaginatedData,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createReaction = async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    await Reaction.create({
      name,
      imageUrl,
    });
    return makeSuccessResponse({
      res,
      message: "Create reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateReaction = async (req, res) => {
  try {
    const { id, name, imageUrl } = req.body;
    const reaction = await Reaction.findById(id);
    if (!reaction) {
      return makeErrorResponse({ res, message: "Reaction not found" });
    }
    await reaction.updateOne({ name, imageUrl });
    return makeSuccessResponse({ res, message: "Reaction updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteReaction = async (req, res) => {
  try {
    const id = req.params.id;
    const reaction = await Reaction.findById(id);
    if (!reaction) {
      return makeErrorResponse({ res, message: "Reaction not found" });
    }
    await reaction.remove();
    return makeSuccessResponse({
      res,
      message: "Delete reaction success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getReaction = async (req, res) => {
  try {
    const id = req.params.id;
    const reaction = await Reaction.findById(id);
    if (!reaction) {
      return makeErrorResponse({ res, message: "Reaction not found" });
    }
    return makeSuccessResponse({ res, data: reaction });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListReactions = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: Reaction,
      req,
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
  createReaction,
  updateReaction,
  deleteReaction,
  getReaction,
  getListReactions,
};
