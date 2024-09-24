import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createReaction,
  updateReaction,
  deleteReaction,
  getReaction,
  getListReactions,
} from "../controllers/reactionController.js";
const router = express.Router();

router.post("/create", auth("RE_C"), createReaction);
router.put("/update", auth("RE_U"), updateReaction);
router.get("/get/:id", auth("RE_V"), getReaction);
router.delete("/delete/:id", auth("RE_D"), deleteReaction);
router.get("/list", auth("RE_L"), getListReactions);

export { router as reactionRouter };
