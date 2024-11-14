import permissionData from "../data/permissionData.js";
import roleData from "../data/roleData.js";
import settingData from "../data/settingData.js";
import userData from "../data/userData.js";
import Permission from "../models/permissionModel.js";
import Role from "../models/roleModel.js";
import Setting from "../models/settingModel.js";
import User from "../models/userModel.js";

const initDb = async () => {
  try {
    const permissionCount = await Permission.countDocuments();
    if (permissionCount === 0) {
      await Permission.insertMany(permissionData);
    }
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      await Role.insertMany(roleData);
    }
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.insertMany(settingData);
    }
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(userData);
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initDb;
