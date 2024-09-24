import express from "express";
import auth from "../middlewares/authentication.js";
import {
  addMember,
  removeMember,
  getConversationMembers,
} from "../controllers/conversationMemberController.js";
const router = express.Router();

router.post("/add", auth("CON_M_C"), addMember);
router.delete("/remove", auth("CON_M_D"), removeMember);
router.get("/list/:conversationId", auth("CON_M_L"), getConversationMembers);

export { router as conversationMemberRouter };
