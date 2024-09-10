import Permission from "../models/permissionModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";

const createPermission = async (req, res) => {
  try {
    const { name, permissionCode } = req.body;
    if (await Permission.findOne({ permissionCode })) {
      return makeErrorResponse({ res, message: "Permission code existed" });
    }
    const newPermission = await Permission.create({
      name,
      permissionCode,
    });
    return makeSuccessResponse({
      res,
      message: "Permission created",
      data: newPermission,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    return makeSuccessResponse({
      res,
      data: {
        content: permissions,
      },
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createPermission, getListPermissions };
