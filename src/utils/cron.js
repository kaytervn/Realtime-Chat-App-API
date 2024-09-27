import cron from "cron";
import Notification from "../models/notificationModel.js";
import dayjs from "dayjs";
import User from "../models/userModel.js";

const birthDateNotification = async () => {
  const today = dayjs().format("DD/MM");
  const users = await User.find({
    birthDate: {
      $ne: null,
      $expr: {
        $eq: [
          { $dateToString: { format: "%d/%m", date: "$birthDate" } },
          today,
        ],
      },
    },
  });
  for (const user of users) {
    await Notification.create({
      user: user._id,
      message: `Chúc mừng sinh nhật ${user.displayName}! 🎉`,
    });
    console.log(
      `Đã gửi thông báo sinh nhật cho người dùng: ${user.displayName}`
    );
  }
};

const job = new cron.CronJob("0 0 * * *", async function () {
  try {
    await birthDateNotification();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    // Delete notifications older than 7 days
    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });
    console.log(
      `Deleted ${result.deletedCount} notifications older than 7 days.`
    );
    // Delete users with status 0 and createdAt older than 7 days
    const users = await User.find({
      status: 0,
      createdAt: { $lt: cutoffDate },
    });
    for (const user of users) {
      await User.deleteOne({ _id: user._id });
      console.log(`Deleted user with id: ${user._id}`);
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
