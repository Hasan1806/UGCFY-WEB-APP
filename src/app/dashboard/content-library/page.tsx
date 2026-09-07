import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, FolderOpen } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardRouteScaffold } from "@/components/dashboard/DashboardRouteScaffold";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LibraryItem = {
  id: string;
  caption?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default async function ContentLibraryPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let campaignIds: string[] = [];
  let items: LibraryItem[] = [];
  let tableMissing = false;

  try {
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id")
      .eq("brand_id", brandId);

    campaignIds = (campaigns ?? []).map((campaign) => campaign.id);

    if (campaignIds.length > 0) {
      const { data, error } = await supabase
        .from("ugc_submissions")
        .select("*")
        .in("campaign_id", campaignIds)
        .in("status", ["Approved", "approved"])
        .order("created_at", { ascending: false });

      if (error) {
        if (isMissingRelationError(error)) {
          tableMissing = true;
        } else {
          logSupabaseError("[Content Library]", error);
        }
      } else {
        items = data ?? [];
      }
    }
  } catch (err) {
    logSupabaseError("[Content Library] handled error", err);
  }

  return (
    <DashboardRouteScaffold
      title="Content Library"
      description="Download approved UGC assets and keep delivered content organized by campaign."
      icon={FolderOpen}
      filters={[
        { label: "Campaign", options: ["All campaigns"] },
        { label: "Content type", options: ["All types", "Video", "Image"] },
      ]}
      actions={[{ label: "Review Approvals", href: "/dashboard/approvals" }]}
      emptyTitle={tableMissing ? "Content library unavailable" : "No approved content yet"}
      emptyDescription={
        tableMissing
          ? "The submissions database is currently being configured."
          : "Approved creator submissions will appear here for download."
      }
    >
      {items.length === 0 ? (
        <DashboardEmptyState
          title={tableMissing ? "Content library unavailable" : "No approved content yet"}
          description={
            tableMissing
              ? "The submissions database is currently being configured."
              : "Approved creator submissions will appear here for download."
          }
          icon={FolderOpen}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <DashboardCard key={item.id} className="p-5">
              <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {item.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnail_url} alt={item.caption || "Approved content"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                    No preview
                  </div>
                )}
              </div>
              <h2 className="mt-4 line-clamp-2 text-sm font-extrabold text-slate-950">{item.caption || "Approved submission"}</h2>
              <p className="mt-1 text-xs font-medium text-slate-500">{formatDashboardDate(item.created_at)}</p>
              {item.video_url && (
                <Link href={item.video_url} className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl bg-brand-red-600 text-xs font-extrabold text-white transition hover:bg-brand-red-700">
                  <Download className="h-4 w-4" />
                  Download
                </Link>
              )}
            </DashboardCard>
          ))}
        </div>
      )}
    </DashboardRouteScaffold>
  );
}
