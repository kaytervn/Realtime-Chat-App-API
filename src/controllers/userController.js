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

export { loginUser, getUserProfile };
