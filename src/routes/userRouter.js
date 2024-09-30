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
  getListUsers,
  getUser,
  createUser,
  updateUser,
  loginAdmin,
} from "../controllers/userController.js";
import auth from "../middlewares/authentication.js";
const router = express.Router();

router.post("/login", loginUser);
router.post("/verify-token", verifyToken);
router.get("/profile", auth(""), getUserProfile);
router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/reset-password", resetUserPassword);
router.post("/forgot-password", forgotUserPassword);
router.post("/change-password", auth(""), changeUserPassword);
router.put("/update-profile", auth(""), updateUserProfile);
router.delete("/delete/:id", auth("USER_D"), deleteUser);
router.put("/change-status/:id", auth("USER_C_S"), changeStatusUser);
router.get("/list", auth("USER_L"), getListUsers);
router.get("/get/:id", auth("USER_V"), getUser);
router.post("/create", auth("USER_C"), createUser);
router.put("/update", auth("USER_U"), updateUser);
router.post("/login-admin", loginAdmin);

export { router as userRouter };
