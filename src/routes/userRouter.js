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
  verifyToken,
  deleteUser,
  changeStatusUser,
} from "../controllers/userController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

// Login user
router.post("/login", loginUser);
router.post("/verify-token", verifyToken);

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

router.delete("/delete/:id", auth("USER_D"), deleteUser);

router.put("/change-status/:id", auth("USER_C_S"), changeStatusUser);

export { router as userRouter };
