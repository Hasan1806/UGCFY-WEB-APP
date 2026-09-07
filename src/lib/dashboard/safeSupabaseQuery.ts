export type SafeQueryError = {
  code?: string;
  message: string;
  details?: string | null;
  hint?: string | null;
};

export type SafeQueryResult<T> = {
  data: T;
  available: boolean;
  error: SafeQueryError | null;
};

export function normalizeSupabaseError(error: unknown): SafeQueryError | null {
  if (!error) return null;

  if (typeof error === "object" && error !== null && "message" in error) {
    const err = error as {
      message?: string;
      code?: string;
      details?: string | null;
      hint?: string | null;
    };

    return {
      code: err.code ?? "UNKNOWN",
      message: err.message ?? "Unknown Supabase error",
      details: err.details ?? null,
      hint: err.hint ?? null,
    };
  }

  return {
    message: String(error),
  };
}

export function isMissingRelationError(error: unknown) {
  const err = normalizeSupabaseError(error);
  const message = err?.message?.toLowerCase() ?? "";
  const details = err?.details?.toLowerCase() ?? "";

  return (
    err?.code === "42P01" ||
    err?.code === "PGRST200" ||
    message.includes("could not find a relationship") ||
    details.includes("could not find a relationship") ||
    (message.includes("relation") && message.includes("does not exist"))
  );
}

export function logSupabaseError(scope: string, error: unknown) {
  const normalized = normalizeSupabaseError(error);
  if (!normalized) return;

  console.error(scope, normalized);
}
