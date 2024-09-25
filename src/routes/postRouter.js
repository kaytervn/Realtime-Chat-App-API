import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createPost,
  deletePost,
  getListPosts,
  getPost,
  updatePost,
} from "../controllers/postController.js";
const router = express.Router();

router.post("/create", auth(""), createPost);
router.put("/update", auth(""), updatePost);
router.get("/get/:id", auth(""), getPost);
router.delete("/delete/:id", auth(""), deletePost);
router.get("/list", auth(""), getListPosts);

export { router as postRouter };
