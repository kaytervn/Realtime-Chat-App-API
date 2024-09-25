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

router.post("/create", auth("POST_C"), createPost);
router.put("/update", auth("POST_U"), updatePost);
router.get("/get/:id", auth("POST_V"), getPost);
router.delete("/delete/:id", auth("POST_D"), deletePost);
router.get("/list", auth("POST_L"), getListPosts);

export { router as postRouter };
