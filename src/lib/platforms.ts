export const BRAND_CAMPAIGN_PLATFORMS = [
  { label: "All Platforms", value: "all" },
  { label: "Instagram", value: "instagram" },
  { label: "YouTube", value: "youtube" },
] as const;

export const SELECTABLE_CAMPAIGN_PLATFORMS = BRAND_CAMPAIGN_PLATFORMS.filter(
  (platform) => platform.value !== "all"
);

export type CampaignPlatform = (typeof SELECTABLE_CAMPAIGN_PLATFORMS)[number]["value"];

export function normalizeCampaignPlatforms(input: unknown): CampaignPlatform[] {
  if (!Array.isArray(input)) return [];

  return input
    .map((value) => String(value).toLowerCase().trim())
    .filter((value): value is CampaignPlatform =>
      SELECTABLE_CAMPAIGN_PLATFORMS.some((platform) => platform.value === value)
    );
}
