export function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function safeLower(value: unknown): string {
  return safeString(value).toLowerCase();
}

export function safeTrim(value: unknown): string {
  return safeString(value).trim();
}

export function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function normalizeStatus(value: unknown, fallback = "pending"): string {
  const trimmed = safeTrim(value);
  return trimmed ? trimmed.toLowerCase() : fallback;
}
