import { NextRequest } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { campaignSchema } from "@/lib/validation/campaign";
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

    const normalizedBody = {
      ...body,
      platforms: Array.isArray(body.platforms)
        ? body.platforms
        : typeof body.platforms === "string"
          ? [body.platforms]
          : typeof body.platform === "string"
            ? [body.platform]
            : [],
    };

    const validatedData = campaignSchema.parse(normalizedBody);
    const budget = Number(validatedData.budget);

    if (!Number.isFinite(budget) || budget <= 0) {
      return jsonError("VALIDATION_ERROR", "Campaign budget must be greater than zero before payment.", 400);
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        brand_id: brandSession.brand.id,
        title: validatedData.title,
        description: validatedData.description || null,
        objective: null,
        platforms: validatedData.platforms,
        deliverables: validatedData.deliverables,
        budget,
        currency: validatedData.currency,
        start_date: null,
        end_date: null,
        requirements: validatedData.requirements,
        guidelines: null,
        created_by: brandSession.user.id,
        status: "draft",
        payment_status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("[supabase-form-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return jsonError("CAMPAIGN_CREATE_FAILED", "Unable to create campaign draft.", 500);
    }

    return jsonSuccess({
      campaign: {
        id: data.id,
        status: data.status,
        payment_status: data.payment_status
      },
      paymentRequired: true,
      nextAction: "continue_to_payment"
    }, 201);
  } catch (err: unknown) {
    console.error("[form-api] unexpected error", err);
    if (err instanceof ZodError) {
      return Response.json(
        {
          ok: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid campaign payload.",
            issues: err.issues
          }
        },
        { status: 400 }
      );
    }
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
