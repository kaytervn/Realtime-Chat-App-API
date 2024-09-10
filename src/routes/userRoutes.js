import express from "express";
import { loginUser, getUserProfile, registerUser, verifyUser } from "../controllers/UserController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

router.post("/login", auth(""), loginUser);
router.get("/profile", auth(""), getUserProfile);
router.post("/register", auth(""), registerUser);
router.post("/verify", auth(""), verifyUser);

export { router as userRoutes };
