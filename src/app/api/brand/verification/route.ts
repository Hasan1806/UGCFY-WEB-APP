import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { brandVerificationSchema } from "@/lib/validation/kyc";

export const dynamic = "force-dynamic";

const statusForAction = {
  save_draft: "draft",
  submit: "submitted",
} as const;

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

export async function PATCH(req: NextRequest) {
  try {
    const brandSession = await verifyBrand();

    if (!brandSession.ok) {
      const status = brandSession.code === "UNAUTHENTICATED" ? 401 : 403;
      return jsonError(brandSession.code, brandSession.message || "Please login to continue.", status);
    }

    const body = await req.json();
    const payload = brandVerificationSchema.parse(body);
    const now = new Date().toISOString();
    const isSubmit = payload.action === "submit";
    const formData = {
      ...payload.form,
      uploads: payload.uploads,
      agreements: payload.agreements,
    };

    const brandUpdate = {
      brand_name: payload.form.brandName,
      company_name: payload.form.brandName,
      legal_name: payload.form.legalName,
      platform_handle: payload.form.platformHandle,
      bio: payload.form.bio,
      business_description: payload.form.bio,
      business_address: payload.form.hqAddress,
      location: payload.form.hqAddress,
      gst_number: payload.form.gstin,
      pan_number: payload.form.pan,
      cin_number: payload.form.cin || null,
      director_name: payload.form.directorName,
      din_number: payload.form.din,
      contact_email: payload.form.contactEmail,
      finance_email: payload.form.financeEmail,
      kyc_status: isSubmit ? "pending_verification" : "draft",
      onboarding_completed: isSubmit,
      onboarding_completed_at: isSubmit ? now : null,
      verification_submitted_at: isSubmit ? now : null,
      kyc_submitted_at: isSubmit ? now : null,
      updated_at: now,
    };

    const { error: profileError } = await supabaseAdmin
      .from("brand_profiles")
      .update(brandUpdate)
      .eq("id", brandSession.brand.id);

    if (profileError) {
      console.error("[Brand Verification] profile update failed", { table: "brand_profiles", operation: "update", ...serializeError(profileError) });
      return jsonError("SUPABASE_UPDATE_FAILED", "Unable to save verification details.", 500, process.env.NODE_ENV !== "production" ? serializeError(profileError) : undefined);
    }

    const { error: baseProfileError } = await supabaseAdmin
      .from("profiles")
      .update({
        kyc_status: isSubmit ? "submitted" : "draft",
        approval_status: isSubmit ? "under_review" : "pending",
        updated_at: now,
      })
      .eq("id", brandSession.user.id);

    if (baseProfileError) {
      console.error("[Brand Verification] base profile update failed", { table: "profiles", operation: "update", ...serializeError(baseProfileError) });
    }

    const documentUrls = payload.uploads.map((upload) => upload.path);
    const { error: submissionError } = await supabaseAdmin
      .from("kyc_submissions")
      .upsert({
        user_id: brandSession.user.id,
        role: "brand",
        current_step: isSubmit ? "submitted" : "draft",
        form_data: formData,
        document_urls: documentUrls,
        status: isSubmit ? "pending" : "draft",
        submitted_at: isSubmit ? now : null,
        updated_at: now,
      }, { onConflict: "user_id" });

    if (submissionError) {
      console.error("[Brand Verification] submission upsert failed", { table: "kyc_submissions", operation: "upsert", ...serializeError(submissionError) });
      return jsonError("SUPABASE_UPDATE_FAILED", "Unable to save verification submission.", 500, process.env.NODE_ENV !== "production" ? serializeError(submissionError) : undefined);
    }

    if (isSubmit && payload.uploads.length > 0) {
      const rows = payload.uploads.map((upload) => ({
        brand_id: brandSession.brand.id,
        document_type: upload.document_type,
        file_name: upload.original_filename,
        storage_path: upload.path,
        file_url: null,
        mime_type: upload.mime_type || null,
        file_size: upload.size_bytes || null,
        status: "uploaded",
        created_at: now,
        updated_at: now,
      }));

      const { error: docsError } = await supabaseAdmin.from("brand_kyc_documents").insert(rows);

      if (docsError) {
        console.error("[Brand Verification] document metadata insert failed", { table: "brand_kyc_documents", operation: "insert", ...serializeError(docsError) });
        return jsonError("SUPABASE_INSERT_FAILED", "Verification was saved, but document metadata could not be recorded.", 500, process.env.NODE_ENV !== "production" ? serializeError(docsError) : undefined);
      }
    }

    return jsonSuccess({
      status: statusForAction[payload.action],
      submitted: isSubmit,
    });
  } catch (err: unknown) {
    console.error("[Brand Verification] unexpected error", serializeError(err));

    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", "Please review the highlighted fields.", 400, {
        ...err.flatten(),
        issues: err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }

    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
