import express from "express";
import auth from "../middlewares/authentication.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getListFriendships,
  deleteFriendRequest,
} from "../controllers/friendshipController.js";
const router = express.Router();

router.post("/send", auth("FR_C"), sendFriendRequest);
router.put("/accept/:friendshipId", auth(""), acceptFriendRequest);
router.put("/reject/:friendshipId", auth(""), rejectFriendRequest);
router.get("/list", auth("FR_L"), getListFriendships);
router.delete("/delete/:friendshipId", auth("FR_D"), deleteFriendRequest);

export { router as friendshipRouter };
