import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET() {
  try {
    const brandSession = await verifyBrand();
    if (!brandSession.ok) {
      return jsonError("UNAUTHENTICATED", brandSession.message || "Please login to continue.", 401);
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("brand_id", brandSession.brand.id)
      .order("created_at", { ascending: false });

    if (error) {
      return jsonError("SUPABASE_SELECT_FAILED", error.message || "Failed to load payments", 500, {
        code: error.code,
        details: error.details,
      });
    }

    return jsonSuccess(data ?? []);
  } catch (err) {
    console.error("[payments] unexpected error", err);
    return jsonError("INTERNAL_ERROR", "Internal Server Error", 500);
  }
}
