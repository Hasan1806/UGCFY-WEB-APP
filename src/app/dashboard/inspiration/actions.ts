"use server";

import { revalidatePath } from "next/cache";
import { requireBrand } from "@/lib/auth/requireBrand";
import { createClient } from "@/lib/supabase/server";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";

export type InspirationActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export async function shortlistCreatorFromInspiration(
  _previousState: InspirationActionState,
  formData: FormData
): Promise<InspirationActionState> {
  const brandSession = await requireBrand();
  const creatorId = String(formData.get("creatorId") || "").trim();
  const videoId = String(formData.get("videoId") || "").trim();

  if (!creatorId) {
    return {
      status: "error",
      message: "This video is not linked to a creator profile yet.",
    };
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("brand_shortlists")
      .insert({
        brand_id: brandSession.brand.id,
        creator_id: creatorId,
        notes: videoId ? `Saved from Inspiration Feed video ${videoId}` : "Saved from Inspiration Feed",
      });

    if (error) {
      if (error.code === "23505") {
        return {
          status: "success",
          message: "Creator is already in your shortlist.",
        };
      }

      if (isMissingRelationError(error)) {
        return {
          status: "error",
          message: "Shortlist setup is pending.",
        };
      }

      logSupabaseError("[Inspiration Feed shortlist]", error);
      return {
        status: "error",
        message: "Unable to shortlist this creator right now.",
      };
    }

    revalidatePath("/dashboard/inspiration");
    revalidatePath("/dashboard/shortlist");

    return {
      status: "success",
      message: "Creator added to shortlist.",
    };
  } catch (err) {
    logSupabaseError("[Inspiration Feed shortlist] handled error", err);
    return {
      status: "error",
      message: "Unable to shortlist this creator right now.",
    };
  }
}
