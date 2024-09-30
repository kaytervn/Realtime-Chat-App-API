import Role from "../models/roleModel.js";
import {
  makeErrorResponse,
  makeSuccessResponse,
  getPaginatedData,
} from "../services/apiService.js";

const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (await Role.findOne({ name })) {
      return makeErrorResponse({ res, message: "Name existed" });
    }
    await Role.create({ name, permissions });
    return makeSuccessResponse({ res, message: "Role created" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id, name, permissions } = req.body;
    const role = await Role.findById(id);
    if (!role) {
      return makeErrorResponse({ res, message: "Role not found" });
    }
    if (name !== role.name && (await Role.findOne({ name }))) {
      return makeErrorResponse({ res, message: "Name existed" });
    }
    await role.updateOne({ name, permissions });
    return makeSuccessResponse({ res, message: "Role updated" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findById(id).populate("permissions");
    if (!role) {
      return makeErrorResponse({ res, message: "Role not found" });
    }
    return makeSuccessResponse({ res, data: role });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getListRoles = async (req, res) => {
  try {
    const { isPaged } = req.query;
    let result;
    if (isPaged === "0") {
      result = await Role.find();
    } else {
      result = await getPaginatedData({
        model: Role,
        req,
      });
    }
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createRole, updateRole, getListRoles, getRole };
