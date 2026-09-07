import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validation/contact";
import { ZodError } from "zod";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Parse JSON & Validate payload
    const validatedData = contactSchema.parse(body);

    // 2. Normalize fields
    const insertPayload = {
      name: validatedData.name ?? null,
      email: validatedData.email,
      phone: validatedData.phone ?? null,
      company_name: validatedData.company_name ?? null,
      subject: validatedData.subject ?? null,
      message: validatedData.message ?? validatedData.query ?? null,
      query: validatedData.query ?? null,
      form_type: validatedData.form_type ?? "contact",
      source: "brand_web",
      status: "new",
      metadata: validatedData.metadata ?? {},
    };

    // 3. Insert using admin client to bypass RLS for public submissions
    const { data, error } = await supabaseAdmin
      .from("contact_submissions")
      .insert(insertPayload)
      .select("id, form_type, created_at")
      .single();

    if (error) {
      console.error("[contact-submit-error]", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return jsonError(
        "CONTACT_SUBMISSION_FAILED",
        "Unable to save your submission. Please try again.",
        500,
        {
          code: error.code,
          details: error.details,
          hint: error.hint,
        }
      );
    }

    // 4. Return success response
    return jsonSuccess(data, 201);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return jsonError(
        "VALIDATION_FAILED",
        err.issues[0]?.message || "Please provide a valid email address.",
        400
      );
    }
    
    console.error("[form-api] unexpected error", err);
    return jsonError(
      "INTERNAL_ERROR",
      "Unable to submit this form. Please check server logs.",
      500
    );
  }
}
