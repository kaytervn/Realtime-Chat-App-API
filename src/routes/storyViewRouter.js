import express from "express";
import auth from "../middlewares/authentication.js";
import { getListStoryViews } from "../services/storyViewService.js";
const router = express.Router();

router.get("/list", auth("ST_V_L"), getListStoryViews);

export { router as storyViewRouter };
