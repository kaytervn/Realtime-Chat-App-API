import cron from "cron";
import Notification from "../models/notificationModel.js";
import dayjs from "dayjs";
import User from "../models/userModel.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const birthDateNotification = async () => {
  const today = dayjs().tz("Asia/Ho_Chi_Minh").format("DD/MM");
  const users = await User.find({
    birthDate: { $ne: null },
    $expr: {
      $eq: [
        {
          $dateToString: {
            format: "%d/%m",
            date: "$birthDate",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        today,
      ],
    },
  });

  if (users.length > 0) {
    const notifications = users.map((user) => ({
      user: user._id,
      message: `Chúc mừng sinh nhật ${user.displayName}! 🎉`,
    }));

    await Notification.insertMany(notifications);
    const superAdmin = await User.findOne({ isSuperAdmin: 1 });

    await Notification.create({
      user: superAdmin._id,
      message: `Hệ thống đã gửi thông báo sinh nhật cho ${users.length} người dùng!`,
    });
  }
};

const job = new cron.CronJob("0 0 * * *", async function () {
  try {
    await birthDateNotification();
    const cutoffDate = dayjs()
      .tz("Asia/Ho_Chi_Minh")
      .subtract(7, "day")
      .toDate();

    const { deletedCount } = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    const superAdmin = await User.findOne({ isSuperAdmin: 1 });
    if (deletedCount > 0) {
      await Notification.create({
        user: superAdmin._id,
        message: `Hệ thống đã xóa ${deletedCount} thông báo quá hạn 7 ngày!`,
      });
    }
  } catch (error) {
    console.error("Error running cron job:", error);
  }
});

export default job;

// CRON JOB EXPLANATION:
// Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
// send 1 GET request for every 14 minutes

// Schedule:
// You define a schedule using a cron expression, which consists of five fields representing:

//! MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK

//? EXAMPLES && EXPLANATION:
//* 14 * * * * - Every 14 minutes
//* 0 0 * * 0 - At midnight on every Sunday
//* 30 3 15 * * - At 3:30 AM, on the 15th of every month
//* 0 0 1 1 * - At midnight, on January 1st
//* 0 * * * * - Every hour
