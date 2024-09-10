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

const registerUser = async (req, res) => {
  try {
    const { displayName, email, password, phone } = req.body;
    if (await User.findOne({ email })) {
      return makeErrorResponse({ res, message: "Email is taken" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({ res, message: "Phone is taken" });
    }
    const otp = createOtp();
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


export { loginUser, getUserProfile, registerUser, verifyUser };
