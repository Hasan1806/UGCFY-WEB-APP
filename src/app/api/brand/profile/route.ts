import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { brandProfileSchema } from "@/lib/validation/brandProfile";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
  }

  if (!brandSession.brand) {
    return jsonError("BRAND_PROFILE_NOT_FOUND", "Brand profile not found.", 404);
  }

  return jsonSuccess({ profile: brandSession.brand });
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonError("UNAUTHENTICATED", userError?.message || "Please login to continue.", 401);
    }
    
    const body = await req.json();
    const validatedData = brandProfileSchema.parse(body);

    const { data: brandProfiles, error: profileError } = await supabase
      .from("brand_profiles")
      .select("id")
      .eq("user_id", user.id)
      .limit(2);

    if (profileError) {
      console.error("[supabase-form-error]", {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      });
      return jsonError("SUPABASE_QUERY_FAILED", profileError.message || "Failed to load profile", 500, {
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      });
    }

    if (brandProfiles && brandProfiles.length > 1) {
      return jsonError("BRAND_PROFILE_DUPLICATE", "Multiple brand profiles found for this user.", 409);
    }

    const profilePayload = {
      brand_name: validatedData.brand_name,
      company_name: validatedData.company_name || null,
      business_type: validatedData.business_type || null,
      website: validatedData.website || null,
      industry: validatedData.industry || null,
      contact_phone: validatedData.contact_phone || null,
      business_description: validatedData.business_description || null,
      gst_number: validatedData.gst_number || null,
      logo_url: validatedData.logo_url || null,
      onboarding_completed_at: new Date().toISOString()
    };

    const existingProfile = brandProfiles?.[0];
    const { error } = existingProfile
      ? await supabase
          .from("brand_profiles")
          .update(profilePayload)
          .eq("id", existingProfile.id)
      : await supabase
          .from("brand_profiles")
          .insert({
            id: user.id,
            user_id: user.id,
            contact_email: user.email ?? null,
            ...profilePayload,
          });

    if (error) {
      console.error("[supabase-form-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return jsonError(
        "SUPABASE_UPDATE_FAILED",
        error.message || "Failed to update profile",
        500,
        {
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );
    }

    return jsonSuccess({ updated: true });
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
