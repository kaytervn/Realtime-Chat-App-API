import mongoose from "mongoose";
import {
  addDateGetters,
  formatDate,
  schemaOptions,
} from "../configurations/schemaConfig.js";

const UserSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
      get: formatDate,
    },
    otp: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
    secretKey: {
      type: String,
      default: null,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    isSuperAdmin: {
      type: Number,
      enum: [0, 1], // 0: inactive, 1: active
      default: 0,
    },
  },
  schemaOptions
);

addDateGetters(UserSchema);

const User = mongoose.model("User", UserSchema);
export default User;
