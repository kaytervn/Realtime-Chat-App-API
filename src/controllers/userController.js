import {
  createToken,
  encodePassword,
  makeErrorResponse,
  makeSuccessResponse,
  comparePassword,
  createOtp,
  sendEmail,
} from "../services/apiService.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return makeErrorResponse({ res, message: "Invalid password" });
    }
    if (user.status != 1) {
      return makeErrorResponse({ res, message: "User is not activated" });
    }
    return makeSuccessResponse({
      res,
      message: "Login success!",
      data: { accessToken: createToken(user._id) },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

// Get user profile

const getUserProfile = async (req, res) => {
  try {
    const { user } = req;
    return makeSuccessResponse({
      res,
      data: user,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { displayName, email, password, phone } = req.body;
    if (await User.findOne({ email })) {
      return makeErrorResponse({ res, message: "Email is taken" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({ res, message: "Phone is taken" });
    }
    const otp = createOtp;
    await User.create({
      displayName,
      email,
      password: await encodePassword(password),
      phone,
      otp,
      status: 0,
      role: await Role.findOne({ name: "User" }),
    });
    await sendEmail({ email, otp, subject: "Verify your account" });
    return makeSuccessResponse({
      res,
      message: "Register success, please check your email",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyUser = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (user.otp !== otp) {
      return makeErrorResponse({ res, message: "Invalid OTP" });
    }
    user.updateOne({ status: 1 });
    return makeSuccessResponse({ message: "Verify success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    await user.updateOne({ otp: createOtp });
    await sendEmail({ email, otp, subject: "Reset your password" });
    return makeSuccessResponse({
      res,
      message: "Request forgot password success, please check your email",
    });
  } catch (error) {
    return makeSuccessResponse({ res, message: error.message });
  }
};

// Reset Password
const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (user.otp !== otp) {
      return makeErrorResponse({ res, message: "Invalid OTP" });
    }
    user.updateOne({ password: await encodePassword(newPassword), otp: null });
    return makeSuccessResponse({
      res,
      message: "Reset password success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { user } = req;
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return makeErrorResponse({
        res,
        message: "Current password does not match",
      });
    }
    if (currentPassword == newPassword) {
      return makeErrorResponse({
        res,
        message: "New password must be different from current password",
      });
    }
    user.updateOne({ password: await encodePassword(newPassword) });
    return makeSuccessResponse({
      res,
      message: "Change password success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { displayName, birthDate, bio, avatarUrl } = req.body;
    const { user } = req;
    await user.updateOne({ displayName, birthDate, bio, avatarUrl });
    return makeSuccessResponse({
      res,
      message: "Update profile success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};
export {
  loginUser,
  getUserProfile,
  forgotUserPassword,
  resetUserPassword,
  registerUser,
  verifyUser,
  changeUserPassword,
  updateUserProfile,
};
