import mongoose, { Schema } from "mongoose";
import { schemaOptions } from "../configurations/schemaConfig.js";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },
    kind: {
      type: Number,
      enum: [1, 2, 3], // 1: info, 2: success, 3: fail
      default: 1,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 2], // 1: sent, 2: read
      default: 1,
    },
  },
  schemaOptions
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
