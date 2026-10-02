import { z } from "zod";

export const CreatorSearchQuerySchema = z
  .object({
    query: z
      .string()
      .trim()
      .max(100, "Search query cannot exceed 100 characters")
      .default(""),
    minFollowers: z
      .number()
      .int()
      .min(0, "Minimum followers must be at least 0")
      .max(100000000, "Minimum followers cannot exceed 100,000,000")
      .nullable()
      .default(10000),
    maxFollowers: z
      .number()
      .int()
      .min(0, "Maximum followers must be at least 0")
      .max(100000000, "Maximum followers cannot exceed 100,000,000")
      .nullable()
      .default(null),
    country: z.string().trim().max(50).nullable().default("India"),
    state: z.string().trim().max(50).nullable().default(null),
    city: z.string().trim().max(50).nullable().default(null),
    niches: z
      .union([
        z.array(z.string().trim().max(50)),
        z.string().transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean)),
      ])
      .default([]),
    gender: z
      .enum(["male", "female", "other", "unspecified"])
      .nullable()
      .default(null),
    minEngagementRate: z
      .number()
      .min(0, "Engagement rate cannot be negative")
      .max(100, "Engagement rate cannot exceed 100%")
      .nullable()
      .default(null),
    sort: z
      .enum(["relevance", "followers_desc", "followers_asc", "engagement_desc"])
      .default("relevance"),
    page: z
      .number()
      .int()
      .min(1, "Page must be at least 1")
      .max(1000, "Page cannot exceed 1000")
      .default(1),
    limit: z
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .default(24),
  })
  .refine(
    (data) =>
      data.minFollowers === null ||
      data.maxFollowers === null ||
      data.minFollowers <= data.maxFollowers,
    {
    message: "minFollowers cannot be greater than maxFollowers",
    path: ["minFollowers"],
    }
  );

export const CreatorIngestionSchema = z.object({
  rawUsername: z.string().min(1, "Username is required").max(100),
  displayName: z.string().max(100).nullable().optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  bio: z.string().max(1000).nullable().optional(),
  followersCount: z.number().int().min(0).nullable().optional(),
  followingCount: z.number().int().min(0).nullable().optional(),
  rawGender: z.string().nullable().optional(),
  rawCountry: z.string().max(50).nullable().optional(),
  rawState: z.string().max(50).nullable().optional(),
  rawCity: z.string().max(50).nullable().optional(),
  locationSource: z
    .enum(["creator_provided", "provider", "inferred", "unknown"])
    .optional()
    .default("unknown"),
  locationConfidence: z.number().min(0).max(1).nullable().optional(),
  rawNiches: z.array(z.string()).nullable().optional(),
  engagementRate: z.number().min(0).max(100).nullable().optional(),
  avgLikes: z.number().int().min(0).nullable().optional(),
  avgComments: z.number().int().min(0).nullable().optional(),
  avgReelViews: z.number().int().min(0).nullable().optional(),
  verified: z.boolean().nullable().optional(),
  providerName: z.string().min(1).max(50),
  providerCreatorId: z.string().max(100).nullable().optional(),
  rawPayload: z.record(z.string(), z.unknown()).optional(),
});

export const UsernameParamSchema = z.object({
  username: z.string().min(1).max(50),
});
