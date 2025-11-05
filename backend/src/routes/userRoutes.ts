import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);

export default router;
