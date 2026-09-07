export const KNOWN_PLATFORMS = [
  "instagram",
  "youtube",

  "facebook",
  "linkedin",
  "x",
  "snapchat",
  "other",
] as const;

export type NormalizedPlatform = (typeof KNOWN_PLATFORMS)[number];

export function normalizePlatform(value: unknown): NormalizedPlatform {
  if (typeof value !== "string") return "other";

  const normalized = value.trim().toLowerCase();

  if (!normalized) return "other";
  if (normalized === "twitter") return "x";

  if ((KNOWN_PLATFORMS as readonly string[]).includes(normalized)) {
    return normalized as NormalizedPlatform;
  }

  return "other";
}

export function normalizePlatforms(value: unknown): NormalizedPlatform[] {
  if (Array.isArray(value)) {
    return Array.from(new Set(value.map(normalizePlatform)));
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return normalizePlatforms(parsed);
      }
    } catch {
      // String platform fallback.
    }

    return [normalizePlatform(value)];
  }

  return [];
}
