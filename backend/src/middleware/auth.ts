import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../models/User";
import { requireAuth } from "@clerk/express";

export type AuthRequest = Request & {
  userId?: string;
};

export const protectRoute = [
  requireAuth(),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);
      // since we call requireAuth() this if check is not necessary
      // if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      const user = await User.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: "User not found" });

      req.userId = user._id.toString();

      next();
    } catch (error) {
      res.status(500);
      next(error);
    }
  },
];
