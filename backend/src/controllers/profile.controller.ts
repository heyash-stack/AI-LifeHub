import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { ProfileService } from "../services/profile.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getProfileHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const profile = await ProfileService.getProfile(userId);
    res.status(200).json({
      status: "success",
      data: profile,
    });
  }
);

export const updateProfileHandler = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const updatedProfile = await ProfileService.updateProfile(userId, req.body);
    res.status(200).json({
      status: "success",
      data: updatedProfile,
    });
  }
);
