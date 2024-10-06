import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import Notification from "../models/notificationModel.js";

const formatNotificationData = (notification) => {
  return {
    _id: notification._id,
    status: notification.status,
    kind: notification.kind,
    data: notification.data,
    createdAt: formatDistanceToNowStrict(notification.createdAt, {
      addSuffix: true,
      locale: vi,
    }),
  };
};

const getListNotifications = async (req) => {
  const {
    message,
    status,
    isPaged,
    kind,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = { user: currentUser._id };
  if (message) {
    query.message = { $regex: message, $options: "i" };
  }
  if (kind) {
    query.kind = Number(kind);
  }
  if (status) {
    query.status = Number(status);
  }

  const [totalElements, notifications] = await Promise.all([
    Notification.countDocuments(query),
    Notification.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = notifications.map((notification) => {
    return formatNotificationData(notification);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListNotifications };
