export function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

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
