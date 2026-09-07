import { NextRequest } from "next/server";
import { z, ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const completeSignupSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  email: z.string().trim().email("Work email is invalid."),
});

function serializeError(error: unknown) {
  if (error && typeof error === "object") {
    const value = error as { message?: string; code?: string; details?: string; hint?: string };
    return {
      message: value.message,
      code: value.code,
      details: value.details,
      hint: value.hint,
    };
  }

  return { message: error instanceof Error ? error.message : "Unknown error" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = completeSignupSchema.parse(body);
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonError("UNAUTHENTICATED", "Your session expired. Please verify your email again.", 401);
    }

    const normalizedEmail = payload.email.toLowerCase();
    if (user.email && user.email.toLowerCase() !== normalizedEmail) {
      return jsonError("EMAIL_MISMATCH", "Verified session does not match this signup email.", 400);
    }

    const fallbackFirstName = 
      payload.firstName || 
      user.user_metadata?.first_name || 
      user.user_metadata?.full_name?.split(" ")[0] || 
      normalizedEmail.split("@")[0] || 
      "Brand";

    const fallbackLastName = 
      payload.lastName || 
      user.user_metadata?.last_name || 
      (user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "") || 
      "";

    const fullName = `${fallbackFirstName} ${fallbackLastName}`.trim();

    const { error: metadataError } = await supabase.auth.updateUser({
      data: {
        role: "brand",
        first_name: fallbackFirstName,
        last_name: fallbackLastName,
        full_name: fullName,
      },
    });

    if (metadataError) {
      console.error("[complete-signup] user metadata update failed", serializeError(metadataError));
    }

    const { error: repairError } = await supabase.rpc("repair_missing_role_profile");
    if (repairError) {
      console.warn("[complete-signup] repair_missing_role_profile failed", serializeError(repairError));
    }

    return jsonSuccess({ redirectTo: "/dashboard/verification" });
  } catch (error) {
    if (error instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Please review the signup details.", 400, {
        issues: error.issues.map((issue) => ({ path: issue.path, message: issue.message })),
      });
    }

    console.error("[complete-signup] unexpected failure", serializeError(error));
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
