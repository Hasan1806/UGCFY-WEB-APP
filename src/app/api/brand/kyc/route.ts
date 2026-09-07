import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { kycSchema } from "@/lib/validation/kyc";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }
    if (!brandSession.brand) {
      return jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404);
    }

    const body = await req.json();
    const validatedData = kycSchema.parse(body);

    const supabase = await createClient();

    // 1. Insert into brand_kyc_documents
    const { error: insertError } = await supabase
      .from("brand_kyc_documents")
      .insert({
        brand_id: brandSession.brand.id,
        document_type: validatedData.document_type,
        bucket: validatedData.bucket,
        path: validatedData.path,
        original_filename: validatedData.original_filename || null,
        mime_type: validatedData.mime_type || null,
        size_bytes: validatedData.size_bytes || null,
        status: "submitted"
      });

    if (insertError) {
      console.error("[supabase-form-error]", {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
      return jsonError("SUPABASE_INSERT_FAILED", insertError.message || "Failed to save document metadata", 500, {
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
      });
    }

    // 2. Update brand_profiles kyc_status
    const { error: updateError } = await supabase
      .from("brand_profiles")
      .update({
        kyc_status: "pending_verification",
        verification_submitted_at: new Date().toISOString()
      })
      .eq("id", brandSession.brand.id);

    if (updateError) {
      console.error("[supabase-form-error]", {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
      });
      return jsonError("SUPABASE_UPDATE_FAILED", updateError.message || "Failed to update profile status", 500, {
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
      });
    }

    // 3. Update profiles (mobile source of truth)
    const { error: baseProfileUpdateError } = await supabase
      .from("profiles")
      .update({
        kyc_status: "submitted",
        approval_status: "under_review",
        updated_at: new Date().toISOString()
      })
      .eq("id", brandSession.user.id);

    if (baseProfileUpdateError) {
      console.error("[supabase-base-profile-error]", {
        message: baseProfileUpdateError.message,
      });
    }

    return jsonSuccess({ success: true });
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
