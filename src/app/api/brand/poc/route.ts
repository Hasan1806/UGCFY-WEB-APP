import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { z } from "zod";

const pocPayloadSchema = z.object({
  full_name: z.string().optional(),
  name: z.string().optional(),
  work_email: z.string().email("Valid work email required").optional(),
  email: z.string().email("Valid work email required").optional(),
  phone: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  role_title: z.string().optional().nullable(),
  poc_platform_id: z.string().uuid("Invalid POC platform").optional().nullable(),
  is_primary: z.boolean().optional().default(false),
});

async function requireBrandForPoc() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    return {
      ok: false as const,
      response: jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401),
    };
  }

  if (!brandSession.brand) {
    return {
      ok: false as const,
      response: jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404),
    };
  }

  return { ok: true as const, brandSession };
}

export async function GET() {
  const auth = await requireBrandForPoc();

  if (!auth.ok) return auth.response;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brand_poc")
    .select("*")
    .eq("brand_id", auth.brandSession.brand.id)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonError("SUPABASE_SELECT_FAILED", error.message || "Failed to load POCs", 500, {
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
  }

  return jsonSuccess(data ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireBrandForPoc();

    if (!auth.ok) return auth.response;

    const body = await req.json();
    const validatedData = pocPayloadSchema.parse(body);
    const fullName = (validatedData.full_name || validatedData.name || "").trim();
    const workEmail = (validatedData.work_email || validatedData.email || "").trim();
    const designation = (validatedData.designation || validatedData.role_title || validatedData.role || "").trim();

    if (!fullName) {
      return jsonError("VALIDATION_ERROR", "Full name is required.", 400);
    }

    if (!workEmail) {
      return jsonError("VALIDATION_ERROR", "Work email is required.", 400);
    }

    const supabase = await createClient();

    const { data: insertedData, error: insertError } = await supabase
      .from("brand_poc")
      .insert({
        brand_id: auth.brandSession.brand.id,
        full_name: fullName,
        work_email: workEmail,
        role_title: designation || "Point of Contact",
        designation: designation || null,
        phone: validatedData.phone || null,
        poc_platform_id: validatedData.poc_platform_id || crypto.randomUUID(),
        is_primary: validatedData.is_primary,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[supabase-form-error]", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      return jsonError(
        "SUPABASE_INSERT_FAILED",
        insertError.message || "Failed to save POC",
        500,
        {
          code: insertError.code,
          details: insertError.details,
          hint: insertError.hint,
        }
      );
    }

    return jsonSuccess(insertedData);
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireBrandForPoc();

    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("BAD_REQUEST", "Missing id parameter", 400);
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from("brand_poc")
      .delete()
      .eq("id", id)
      .eq("brand_id", auth.brandSession.brand.id);

    if (error) {
      console.error("[supabase-form-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return jsonError(
        "SUPABASE_DELETE_FAILED",
        error.message || "Failed to delete POC",
        500,
        {
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );
    }

    return jsonSuccess({ deleted: true });
  } catch (err) {
    console.error("[form-api] unexpected error", err);
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
