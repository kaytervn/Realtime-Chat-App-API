import {
  createToken,
  encodePassword,
  makeErrorResponse,
  makeSuccessResponse,
  comparePassword,
  sendEmail,
  createSecretKey,
  createOtp,
  deleteFileByUrl,
  parseDate,
  getPaginatedData,
} from "../services/apiService.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import "dotenv/config.js";
import jwt from "jsonwebtoken";
import Notification from "../models/notificationModel.js";

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "Tài khoản không tồn tại" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return makeErrorResponse({ res, message: "Sai mật khẩu" });
    }
    if (user.status != 1) {
      return makeErrorResponse({
        res,
        message: "Tài khoản chưa được kích hoạt",
      });
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
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    let secretKey;
    while (true) {
      secretKey = createSecretKey();
      if (!(await User.findOne({ secretKey }))) {
        break;
      }
    }
    const otp = createOtp();
    await User.create({
      displayName,
      email,
      password: await encodePassword(password),
      phone,
      otp,
      status: 0,
      secretKey,
      role: await Role.findOne({ kind: 1 }),
    });
    await sendEmail({ email, otp, subject: "XÁC MINH TÀI KHOẢN" });
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
      return makeErrorResponse({ res, message: "Sai mã xác thực OTP" });
    }
    await user.updateOne({ status: 1 });
    await Notification.create({
      user: user._id,
      message: `Mừng thành viên mới, ${user.displayName}!`,
    });
    return makeSuccessResponse({ res, message: "Verify success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const forgotUserPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "Tài khoản không tồn tại" });
    }
    const otp = createOtp();
    await user.updateOne({ otp });
    await sendEmail({ email, otp, subject: "ĐẶT LẠI MẬT KHẨU" });
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
      return makeErrorResponse({ res, message: "Sai mã xác thực OTP" });
    }

    user.password = await encodePassword(newPassword);
    user.otp = null;

    await user.save();

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
        message: "Mật khẩu hiện tại không chính xác",
      });
    }
    if (currentPassword === newPassword) {
      return makeErrorResponse({
        res,
        message: "Mật khẩu mới không được trùng với mật khẩu hiện tại",
      });
    }
    await user.updateOne({ password: await encodePassword(newPassword) });
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
    if (avatarUrl != user.avatarUrl) {
      await deleteFileByUrl(user.avatarUrl);
    }
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    await user.updateOne({
      displayName,
      birthDate: parsedBirthDate,
      bio,
      avatarUrl,
    });
    return makeSuccessResponse({
      res,
      message: "Update profile success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const { accessToken } = req.body;
    jwt.verify(accessToken, process.env.JWT_SECRET);
    return makeSuccessResponse({
      res,
      message: "Verify token success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const changeStatusUser = async (req, res) => {
  try {
    const { id, newStatus } = req.body;
    await User.updateOne({ _id: id }, { status: newStatus });
    return makeSuccessResponse({
      res,
      message: "Change user status success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    await user.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete user success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListUsers = async (req, res) => {
  try {
    const result = await getPaginatedData({
      model: User,
      req,
      populateOptions: [
        {
          path: "role",
          select: "-permissions",
        },
      ],
    });
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    return makeSuccessResponse({ res, data: user });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      displayName,
      email,
      password,
      phone,
      birthDate,
      bio,
      avatarUrl,
      status,
      roleId,
    } = req.body;
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    const role = await Role.findById(roleId);
    if (await User.findOne({ email })) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (await User.findOne({ phone })) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    let secretKey;
    while (true) {
      secretKey = createSecretKey();
      if (!(await User.findOne({ secretKey }))) {
        break;
      }
    }
    const otp = createOtp();
    await User.create({
      displayName,
      email,
      password: await encodePassword(password),
      phone,
      otp,
      status,
      secretKey,
      bio,
      avatarUrl,
      birthDate: parsedBirthDate,
      role,
    });
    return makeSuccessResponse({ res, message: "Create user success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      id,
      displayName,
      email,
      phone,
      birthDate,
      bio,
      avatarUrl,
      roleId,
      status,
      password,
    } = req.body;
    const { user } = req;
    const updateUser = await User.findById(id);
    if (!updateUser) {
      return makeErrorResponse({ res, message: "User not found" });
    }
    if (avatarUrl != updateUser.avatarUrl) {
      await deleteFileByUrl(updateUser.avatarUrl);
    }
    const parsedBirthDate = birthDate ? parseDate(birthDate) : null;
    const role = await Role.findById(roleId);
    if (updateUser.email != email && (await User.findOne({ email }))) {
      return makeErrorResponse({ res, message: "Email đã được sử dụng" });
    }
    if (updateUser.phone != phone && (await User.findOne({ phone }))) {
      return makeErrorResponse({
        res,
        message: "Số điện thoại đã được sử dụng",
      });
    }
    const updateData = {
      displayName,
      email,
      phone,
      status,
      bio,
      avatarUrl,
      birthDate: parsedBirthDate,
      role,
    };
    if (password) {
      updateData.password = await encodePassword(password);
    }
    await User.updateOne({ _id: id }, updateData);
    if (!updateUser._id.equals(user._id)) {
      await Notification.create({
        user: updateUser._id,
        message: "Thông tin của bạn đã được quản trị viên cập nhật",
      });
    }
    return makeSuccessResponse({ res, message: "Update user success" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return makeErrorResponse({ res, message: "Tài khoản không tồn tại" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return makeErrorResponse({ res, message: "Sai mật khẩu" });
    }
    if (user.status != 1) {
      return makeErrorResponse({
        res,
        message: "Tài khoản chưa được kích hoạt",
      });
    }
    const role = await Role.findById(user.role._id);
    if (role.kind === 1) {
      return makeErrorResponse({
        res,
        message: "Bạn không được phép đăng nhập vào trang này",
      });
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

export {
  loginUser,
  getUserProfile,
  forgotUserPassword,
  resetUserPassword,
  registerUser,
  verifyUser,
  changeUserPassword,
  updateUserProfile,
  verifyToken,
  changeStatusUser,
  deleteUser,
  getListUsers,
  getUser,
  createUser,
  updateUser,
  loginAdmin,
};
