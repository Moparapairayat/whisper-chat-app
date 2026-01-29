import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      // get user info from clerk and save to db
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const primaryEmail =
        clerkUser.emailAddresses.find((email) => email.id === clerkUser.primaryEmailAddressId)
          ?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

      if (!primaryEmail) {
        res.status(400).json({ message: "No email address found for this user" });
        return;
      }

      const name = clerkUser.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
        : primaryEmail.split("@")[0];

      // If the same email already exists (e.g., Clerk user recreated), link it to the new clerkId.
      user = await User.findOneAndUpdate(
        { email: primaryEmail },
        { clerkId, name, email: primaryEmail, avatar: clerkUser.imageUrl || "" },
        { new: true, upsert: true, runValidators: true }
      );
    }

    res.json(user);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && (error as { code?: number }).code === 11000) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    res.status(500);
    next(error);
  }
}
