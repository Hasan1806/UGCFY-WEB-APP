export function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  // Filter out stock/AI-generated placeholder image domains
  const disallowedDomains = [
    "images.unsplash.com",
    "unsplash.com",
    "thispersondoesnotexist",
    "generated.photos",
    "placeholder.com",
    "via.placeholder.com",
    "picsum.photos",
  ];

  if (disallowedDomains.some((d) => trimmed.toLowerCase().includes(d))) {
    return null;
  }

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }

  return null;
}

export function getInitials(value: string | null | undefined): string {
  const fallback = "UG";

  if (!value || !value.trim()) return fallback;

  const words = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return fallback;

  return words
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || fallback;
}
