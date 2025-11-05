import express from "express";
import multer from "multer";
import { convertFile } from "../controllers/convertController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/convert", authMiddleware, upload.array("files"), convertFile);

export default router;
