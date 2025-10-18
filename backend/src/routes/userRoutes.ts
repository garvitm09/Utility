import express from "express";
import authMiddleware, { AuthRequest } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, (req: AuthRequest, res) => {
  res.json({
    message: "User fetched successfully",
    user: req.user
  });
});

export default router;
