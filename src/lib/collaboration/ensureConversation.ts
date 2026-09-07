import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function ensureConversationForCampaignCreator({
  brandId,
  campaignId,
  creatorId,
  title,
}: {
  brandId: string;
  campaignId: string;
  creatorId: string;
  title?: string | null;
}) {
  // First query conversations by brand_id, campaign_id, creator_id.
  const { data: existing, error: queryError } = await supabaseAdmin
    .from("conversations")
    .select("*")
    .eq("brand_id", brandId)
    .eq("campaign_id", campaignId)
    .eq("creator_id", creatorId)
    .single();

  if (existing) {
    return existing;
  }

  if (queryError && queryError.code !== "PGRST116") {
    // Some other query error occurred
    throw new Error(`Failed to query existing conversation: ${queryError.message}`);
  }

  // If missing, insert it.
  const { data: newConv, error: insertError } = await supabaseAdmin
    .from("conversations")
    .insert({
      brand_id: brandId,
      campaign_id: campaignId,
      creator_id: creatorId,
      title: title || "New Collaboration",
      status: "active",
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") { // Unique violation
      // Race condition: another request created it just now. Fetch and return it.
      const { data: refetched, error: refetchError } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("brand_id", brandId)
        .eq("campaign_id", campaignId)
        .eq("creator_id", creatorId)
        .single();
      
      if (refetched) {
        return refetched;
      }
      throw new Error(`Failed to refetch conversation after unique violation: ${refetchError?.message}`);
    }
    throw new Error(`Failed to insert conversation: ${insertError.message}`);
  }

  return newConv;
}
