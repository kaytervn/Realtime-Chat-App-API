import express from "express";
import auth from "../middlewares/authentication.js";
import {
  createRole,
  getListRoles,
  getRole,
  updateRole,
} from "../controllers/roleController.js";
const router = express.Router();

router.post("/create", auth("ROLE_C"), createRole);
router.put("/update", auth("ROLE_U"), updateRole);
router.get("/get/:id", auth("ROLE_V"), getRole);
router.get("/list", auth("ROLE_L"), getListRoles);

export { router as roleRoutes };
