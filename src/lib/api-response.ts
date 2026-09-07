export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiSuccessResponse<T = unknown> = {
  ok: true;
  data: T;
};

export function jsonError(
  code: string,
  message: string,
  status = 400,
  details?: unknown
) {
  return Response.json(
    {
      ok: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function jsonSuccess<T>(data: T, status = 200) {
  return Response.json(
    {
      ok: true,
      data,
    },
    { status }
  );
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unexpected error occurred.";
}
