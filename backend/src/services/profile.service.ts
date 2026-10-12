import { db } from "../config/db.config";
import { UpdateProfileInput } from "../models/profile.dto";

export class ProfileService {
  static async getProfile(userId: string) {
    let profile = await db.profile.findUnique({
      where: { userId },
    });

    // If profile does not exist yet, create default profile
    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId,
          bio: "",
          timezone: "UTC",
          themePreference: "dark",
          aiTonePreference: "encouraging",
        },
      });
    }

    return profile;
  }

  static async updateProfile(userId: string, data: UpdateProfileInput) {
    const updateData: {
      bio?: string;
      timezone?: string;
      themePreference?: string;
      aiTonePreference?: string;
    } = {};

    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.themePreference !== undefined) updateData.themePreference = data.themePreference;
    if (data.aiTonePreference !== undefined) updateData.aiTonePreference = data.aiTonePreference;

    return await db.profile.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        bio: data.bio ?? "",
        timezone: data.timezone ?? "UTC",
        themePreference: data.themePreference ?? "dark",
        aiTonePreference: data.aiTonePreference ?? "encouraging",
      },
    });
  }
}
