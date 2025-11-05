import express from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadAndConvertFile } from "../controllers/fileController.js";

const router = express.Router();

// --- MULTER SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// --- ROUTE ---
router.post("/upload", authMiddleware, upload.single("file"), uploadAndConvertFile);

router.post("/upload-images", upload.array("files", 10), uploadAndConvertFile);

export default router;
