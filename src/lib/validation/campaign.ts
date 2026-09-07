import { z } from "zod";
export const campaignSchema = z.object({
  title: z.string().trim().min(1, "Campaign title is required"),
  description: z.string().trim().optional().nullable().transform((val) => val || null),
  platforms: z
    .array(z.enum(["instagram", "youtube"]))
    .min(1, "Select at least one platform"),
  deliverables: z
    .string()
    .trim()
    .min(1, "Deliverables are required"),
  requirements: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => value || null),
  budget: z.coerce.number().positive("Budget must be positive"),
  currency: z.literal("INR").default("INR"),
  inspirationReference: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable()
    .transform((value) => value || null),
  inspirationVideoId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .transform((value) => value || null),
});

export type NormalizedCampaignInput = z.infer<typeof campaignSchema>;
