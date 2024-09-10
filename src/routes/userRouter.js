import express from "express";
import {
  loginUser,
  getUserProfile,
  resetUserPassword,
  forgotUserPassword,
  registerUser,
  verifyUser,
  changeUserPassword,
  updateUserProfile,
} from "../controllers/userController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

// Login user
router.post("/login", loginUser);

// Get user profile
router.get("/profile", auth(""), getUserProfile);

router.post("/register", registerUser);

router.post("/verify", verifyUser);

// Reset Password
router.post("/reset-password", resetUserPassword);
// Forgot Password
router.post("/forgot-password", forgotUserPassword);

// Change Password
router.post("/change-password", auth(""), changeUserPassword);
// Update Profile
router.post("/update-profile", auth(""), updateUserProfile);

export { router as userRouter };
