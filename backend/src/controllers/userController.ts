import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export const getCurrentUser = (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  res.status(200).json({
    message: "Current user fetched successfully",
    user: req.user
  });
};
