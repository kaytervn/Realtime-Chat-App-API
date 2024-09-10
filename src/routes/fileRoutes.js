import express from "express";
import auth from "../middlewares/authentication.js";
import multer from "multer";
import { uploadFile } from "../controllers/fileController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", auth(""), upload.single("file"), uploadFile);

export { router as fileRoutes };
