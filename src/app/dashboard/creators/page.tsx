import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgePlus, Eye, MapPin, UserRoundCheck, Users } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardRouteScaffold } from "@/components/dashboard/DashboardRouteScaffold";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CreatorRow = {
  id: string;
  full_name?: string | null;
  display_name?: string | null;
  niche?: string[] | string | null;
  avatar_url?: string | null;
  location?: string | null;
  instagram_handle?: string | null;
  instagram_url?: string | null;
  youtube_handle?: string | null;
  youtube_url?: string | null;

  portfolio_links?: Array<{ url?: string; name?: string }> | null;
  rate_card?: Record<string, number | string | null> | null;
  availability?: string | null;
};

function normalizeNiche(niche: CreatorRow["niche"]) {
  if (Array.isArray(niche)) return niche.filter(Boolean).slice(0, 2).join(", ");
  if (typeof niche === "string") return niche;
  return "Niche not specified";
}

function getPlatforms(creator: CreatorRow) {
  return [
    creator.instagram_handle || creator.instagram_url ? "Instagram" : null,
    creator.youtube_handle || creator.youtube_url ? "YouTube" : null,

  ].filter(Boolean) as string[];
}

function getStartingPrice(rateCard: CreatorRow["rate_card"]) {
  if (!rateCard) return null;
  const values = Object.values(rateCard)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length > 0 ? Math.min(...values) : null;
}

export default async function CreatorDiscoveryPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  let creators: CreatorRow[] = [];
  let tableMissing = false;

  try {
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(48);

    if (error) {
      if (isMissingRelationError(error)) {
        tableMissing = true;
      } else {
        logSupabaseError("[Creator Discovery]", error);
      }
    } else {
      creators = data ?? [];
    }
  } catch (err) {
    logSupabaseError("[Creator Discovery] handled error", err);
  }

  const filters = [
    { label: "Niche/Category", options: ["All categories", "Beauty", "Fashion", "Fitness", "Food", "Tech", "Travel"] },
    { label: "Platform", options: ["All platforms", "Instagram", "YouTube"] },
    { label: "Location", options: ["All locations", "India", "United States", "United Kingdom", "Remote"] },
    { label: "Budget", options: ["Any budget", "Under ₹10k", "₹10k-₹50k", "₹50k+"] },
    { label: "Availability", options: ["Any availability", "Available", "Limited", "Unavailable"] },
  ];

  return (
    <DashboardRouteScaffold
      title="Creator Discovery"
      description="Find creators by niche, platform, location, budget, and availability."
      icon={Users}
      filters={filters}
      actions={[{ label: "View Shortlist", href: "/dashboard/shortlist" }]}
      emptyTitle={tableMissing ? "Creator discovery unavailable" : "No creators available yet"}
      emptyDescription={
        tableMissing
          ? "The creator profile database is currently being configured."
          : "Creator profiles will appear here once creators complete onboarding."
      }
    >
      {creators.length === 0 ? (
        <DashboardEmptyState
          title={tableMissing ? "Creator discovery unavailable" : "No creators available yet"}
          description={
            tableMissing
              ? "The creator profile database is currently being configured."
              : "Creator profiles will appear here once creators complete onboarding."
          }
          icon={Users}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {creators.map((creator) => {
            const name = creator.display_name || creator.full_name || "Creator";
            const platforms = getPlatforms(creator);
            const startingPrice = getStartingPrice(creator.rate_card);

            return (
              <DashboardCard key={creator.id} className="flex h-full flex-col p-5">
                <div className="flex items-start gap-4">
                  <SafeAvatar
                    src={creator.avatar_url ?? null}
                    name={name}
                    alt={name}
                    className="h-14 w-14 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-extrabold text-slate-950">{name}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{normalizeNiche(creator.niche)}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {creator.location || "Location not specified"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {platforms.length > 0 ? (
                    platforms.map((platform) => (
                      <span key={platform} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {platform}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                      Platforms not listed
                    </span>
                  )}
                </div>

                <dl className="mt-5 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-400">Portfolio</dt>
                    <dd className="mt-1 font-extrabold text-slate-950">{creator.portfolio_links?.length ?? 0}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-400">From</dt>
                    <dd className="mt-1 font-extrabold text-slate-950">{startingPrice ? `₹${startingPrice}` : "N/A"}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <dt className="font-bold text-slate-400">Status</dt>
                    <dd className="mt-1 font-extrabold text-slate-950">{creator.availability || "Unknown"}</dd>
                  </div>
                </dl>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <Link href="/dashboard/shortlist" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 transition hover:border-brand-red-200 hover:text-brand-red-600">
                    <UserRoundCheck className="h-3.5 w-3.5" />
                    Shortlist
                  </Link>
                  <Link href="/dashboard/campaigns" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl border border-slate-200 text-xs font-extrabold text-slate-700 transition hover:border-brand-red-200 hover:text-brand-red-600">
                    <BadgePlus className="h-3.5 w-3.5" />
                    Invite
                  </Link>
                  <Link href={`/dashboard/creators/${creator.id}`} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl bg-brand-red-600 text-xs font-extrabold text-white transition hover:bg-brand-red-700">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Link>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </DashboardRouteScaffold>
  );
}
