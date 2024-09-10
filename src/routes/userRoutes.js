import express from "express";
import { loginUser, getUserProfile } from "../controllers/UserController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

router.post("/login", auth(""), loginUser);
router.get("/profile", auth(""), getUserProfile);

export { router as userRoutes };
