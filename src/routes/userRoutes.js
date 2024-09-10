import express from "express";
import {
  loginUser,
  getUserProfile,
  resetUserPassword,
  forgotUserPassword,
  registerUser,
  verifyUser,
} from "../controllers/UserController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

// Login user
router.post("/login", auth(""), loginUser);

// Get user profile
router.get("/profile", auth(""), getUserProfile);
router.post("/register", auth(""), registerUser);
router.post("/verify", auth(""), verifyUser);

// Reset Password
router.post("/reset-password", auth(""), resetUserPassword);
// Forgot Password
router.post("/forgot-password", auth(""), forgotUserPassword);

export { router as userRoutes };
