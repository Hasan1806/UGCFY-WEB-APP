import Link from "next/link";
import { redirect } from "next/navigation";
import { GitCompare, Trash2, UserRoundCheck } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardRouteScaffold } from "@/components/dashboard/DashboardRouteScaffold";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";
import { StartCollaborationButton } from "./StartCollaborationButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ShortlistRow = {
  id: string;
  creator_id: string | null;
  campaign_id?: string | null;
  notes?: string | null;
  source?: string | null;
  created_at?: string | null;
};

type CreatorRow = {
  id: string;
  full_name?: string | null;
  display_name?: string | null;
  niche?: string[] | string | null;
  avatar_url?: string | null;
  location?: string | null;
};

function normalizeNiche(niche: CreatorRow["niche"]) {
  if (Array.isArray(niche)) return niche.filter(Boolean).slice(0, 2).join(", ");
  if (typeof niche === "string" && niche.trim()) return niche;
  return "Niche not specified";
}

export default async function ShortlistPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let shortlists: ShortlistRow[] = [];
  const creatorsById: Record<string, CreatorRow> = {};
  let tableMissing = false;
  let creatorTableMissing = false;

  try {
    const { data, error } = await supabase
      .from("brand_shortlists")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      if (isMissingRelationError(error)) {
        tableMissing = true;
      } else {
        logSupabaseError("[Shortlist]", error);
      }
    } else {
      shortlists = data ?? [];
    }

    const creatorIds = Array.from(new Set(shortlists.map((item) => item.creator_id).filter(Boolean))) as string[];
    if (creatorIds.length > 0) {
      const { data: creators, error: creatorError } = await supabase
        .from("creator_profiles")
        .select("*")
        .in("id", creatorIds);

      if (creatorError) {
        if (isMissingRelationError(creatorError)) {
          creatorTableMissing = true;
        } else {
          logSupabaseError("[Shortlist creator_profiles]", creatorError);
        }
      } else {
        (creators ?? []).forEach((creator) => {
          creatorsById[creator.id] = creator;
        });
      }
    }
  } catch (err) {
    logSupabaseError("[Shortlist] handled error", err);
  }

  const emptyTitle = tableMissing || creatorTableMissing ? "Shortlist unavailable" : "No shortlisted creators yet";
  const emptyDescription =
    tableMissing || creatorTableMissing
      ? "The shortlist database is currently being configured."
      : "No shortlisted creators yet. Save creators from Discovery or Inspiration Feed to build your campaign team.";

  return (
    <DashboardRouteScaffold
      title="Shortlist"
      description="Manage saved creators, notes, campaign fit, and invite actions."
      icon={UserRoundCheck}
      filters={[
        { label: "Campaign", options: ["All campaigns"] },
        { label: "Saved From", options: ["All sources", "Discovery", "Inspiration Feed"] },
      ]}
      actions={[
        { label: "Discover Creators", href: "/dashboard/creators" },
        { label: "Explore Inspiration", href: "/dashboard/inspiration" },
      ]}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    >
      {shortlists.length === 0 || tableMissing || creatorTableMissing ? (
        <DashboardEmptyState title={emptyTitle} description={emptyDescription} icon={UserRoundCheck} />
      ) : (
        <div className="space-y-4">
          <DashboardCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <GitCompare className="mt-1 h-5 w-5 text-brand-red-600" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-950">Compare creators</h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Comparison is planned for this workspace. Use notes and campaign filters while it is being implemented.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
              Placeholder
            </span>
          </DashboardCard>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {shortlists.map((item) => {
              const creator = item.creator_id ? creatorsById[item.creator_id] : undefined;
              const name = creator?.display_name || creator?.full_name || "Creator";

              return (
                <DashboardCard key={item.id} className="flex h-full flex-col p-5">
                  <div className="flex items-start gap-4">
                    <SafeAvatar
                      src={creator?.avatar_url ?? null}
                      name={name}
                      alt={name}
                      className="h-14 w-14 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-extrabold text-slate-950">{name}</h2>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{normalizeNiche(creator?.niche)}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Saved {formatDashboardDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Notes</p>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                      {item.notes || "No notes added yet."}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                    <StartCollaborationButton 
                      campaignId={item.campaign_id ?? null} 
                      creatorId={item.creator_id ?? null} 
                    />
                    <Link href={item.creator_id ? `/dashboard/creators/${item.creator_id}` : "/dashboard/creators"} className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 transition hover:border-brand-red-200 hover:text-brand-red-600">
                      Profile
                    </Link>
                    <button type="button" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-500">
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </DashboardCard>
              );
            })}
          </div>
        </div>
      )}
    </DashboardRouteScaffold>
  );
}
