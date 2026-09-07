import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { z, ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

const shortlistSchema = z.object({
  creator_id: z.string().uuid("Invalid creator ID"),
  campaign_id: z.string().uuid("Invalid campaign ID").optional(),
  action: z.enum(["add", "remove"])
});

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
    const validatedData = shortlistSchema.parse(body);

    const supabase = await createClient();

    if (validatedData.action === "add") {
      const { data, error } = await supabase
        .from("brand_shortlists")
        .insert({
          brand_id: brandSession.brand.id,
          creator_id: validatedData.creator_id,
          campaign_id: validatedData.campaign_id || null,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          return jsonSuccess({ status: "already_shortlisted" });
        }
        console.error("[supabase-form-error]", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return jsonError("SUPABASE_INSERT_FAILED", error.message || "Failed to shortlist creator", 500, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
      return jsonSuccess(data);
    } else {
      let query = supabase
        .from("brand_shortlists")
        .delete()
        .eq("brand_id", brandSession.brand.id)
        .eq("creator_id", validatedData.creator_id);

      if (validatedData.campaign_id) {
        query = query.eq("campaign_id", validatedData.campaign_id);
      } else {
        query = query.is("campaign_id", null);
      }

      const { error } = await query;

      if (error) {
        console.error("[supabase-form-error]", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return jsonError("SUPABASE_DELETE_FAILED", error.message || "Failed to remove from shortlist", 500, {
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
      return jsonSuccess({ status: "removed" });
    }
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return jsonError("VALIDATION_ERROR", err.issues[0]?.message || "Validation failed", 400);
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
