import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CampaignsClient } from "./CampaignsClient";
import { normalizePlatforms, NormalizedPlatform } from "@/lib/dashboard/normalizeDashboardData";
import { logSupabaseError, isMissingRelationError } from "@/lib/dashboard/safeSupabaseQuery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export type CampaignListItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  fundsState?: string | null;
  budget: number | null;
  currency: string;
  platforms: NormalizedPlatform[];
  createdAt: string | null;
};

export default async function CampaignsPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;

  let initialCampaigns: CampaignListItem[] = [];
  
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      if (!isMissingRelationError(error)) {
        logSupabaseError("[Campaigns]", error);
      }
    } else if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialCampaigns = data.map((row: any) => ({
        id: row.id,
        title: row.title ?? "Untitled campaign",
        description: row.description ?? null,
        status: typeof row.status === "string" && row.status.trim() ? row.status : "draft",
        fundsState: row.status === "pending_payment" ? "Payment pending" : null,
        budget: typeof row.budget === "number" ? row.budget : null,
        currency: row.currency ?? "INR",
        platforms: normalizePlatforms(row.platforms),
        createdAt: row.created_at ?? null,
      }));
    }
  } catch (err) {
    logSupabaseError("[Campaigns] Handled error fetching campaigns", err);
  }

  return <CampaignsClient initialCampaigns={initialCampaigns} />;
}
