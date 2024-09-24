import mongoose from "mongoose";
import {
  addDateGetters,
  schemaOptions,
} from "../configurations/schemaConfig.js";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

addDateGetters(NotificationSchema);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
