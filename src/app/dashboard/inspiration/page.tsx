import { redirect } from "next/navigation";
import { BookOpen, Film } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardFilterBar, DashboardFilterOption } from "@/components/dashboard/DashboardFilterBar";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardVideoCard, DashboardVideoCardData } from "@/components/dashboard/DashboardVideoCard";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { safeString } from "@/lib/dashboard/dashboardSafety";
import { isMissingRelationError, logSupabaseError } from "@/lib/dashboard/safeSupabaseQuery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Record<string, string | string[] | undefined>;
type AnyRow = Record<string, unknown>;

const filterOptions: DashboardFilterOption[] = [
  { label: "Platform", name: "platform", options: ["All", "Instagram", "YouTube", "Other"] },
  { label: "Category/Niche", name: "category", options: ["All", "Beauty", "Fashion", "Fitness", "Food", "Tech", "Travel", "General"] },
  {
    label: "Content Type",
    name: "contentType",
    options: ["All", "Product Demo", "Unboxing", "Testimonial", "Problem/Solution", "Before/After", "Tutorial", "Lifestyle", "Ad Creative", "Hook Example"],
  },
  { label: "Language", name: "language", options: ["All", "English", "Hindi", "Regional", "Other"] },
  { label: "Video Duration", name: "duration", options: ["All", "Under 30s", "30s-60s", "60s+"] },
  { label: "Creator Location", name: "location", options: ["All", "India", "United States", "United Kingdom", "Remote", "Other"] },
  { label: "Budget Range", name: "budget", options: ["All", "Under ₹10k", "₹10k-₹50k", "₹50k+"] },
  { label: "Saved", name: "saved", options: ["All", "Saved only"] },
];

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function rowString(row: AnyRow, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function rowNumber(row: AnyRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return null;
}

function normalizeNiche(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 2).join(", ");
  }
  return safeString(value, "").trim();
}

function isApprovedVideo(row: AnyRow) {
  const status = rowString(row, ["status"]).toLowerCase();
  return status === "approved" || status === "published";
}

function isVideoUrl(value: string) {
  const normalized = value.trim().toLowerCase().split("?")[0] ?? "";
  if (!normalized) return false;
  if (/\.(pdf|png|jpe?g|webp|gif|svg)$/i.test(normalized)) return false;
  return true;
}

function formatDuration(seconds: number | null, fallback: string) {
  if (fallback && fallback !== "0") return fallback;
  if (!seconds) return "Video";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60).toString().padStart(2, "0");
  return minutes > 0 ? `${minutes}:${remaining}` : `${Math.round(seconds)}s`;
}

function matchesFilter(value: string, filterValue: string) {
  return filterValue === "All" || !filterValue || value.toLowerCase().includes(filterValue.toLowerCase());
}

function matchesDuration(seconds: number | null, durationFilter: string) {
  if (!durationFilter || durationFilter === "All") return true;
  if (!seconds) return true;
  if (durationFilter === "Under 30s") return seconds < 30;
  if (durationFilter === "30s-60s") return seconds >= 30 && seconds <= 60;
  if (durationFilter === "60s+") return seconds > 60;
  return true;
}

function matchesBudget(value: number | null, budgetFilter: string) {
  if (!budgetFilter || budgetFilter === "All") return true;
  if (value === null) return true;
  if (budgetFilter === "Under ₹10k") return value < 10000;
  if (budgetFilter === "₹10k-₹50k") return value >= 10000 && value <= 50000;
  if (budgetFilter === "₹50k+") return value > 50000;
  return true;
}

export default async function InspirationFeedPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const selectedValues: Record<string, string> = Object.fromEntries(
    filterOptions.map((filter) => [filter.name, getParam(params, filter.name) || "All"])
  );
  const searchValue = getParam(params, "q").trim();

  const supabase = await createClient();
  let submissionRows: AnyRow[] = [];
  let setupPending = false;

  try {
    const { data, error } = await supabase
      .from("ugc_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(80);

    if (error) {
      if (isMissingRelationError(error)) {
        setupPending = true;
      } else {
        logSupabaseError("[Inspiration Feed]", error);
      }
    } else {
      submissionRows = data ?? [];
    }
  } catch (err) {
    logSupabaseError("[Inspiration Feed] handled error", err);
  }

  const videoRows = submissionRows.filter((row) => {
    const videoUrl = rowString(row, ["video_url", "content_url", "file_url", "media_url"]);
    return isApprovedVideo(row) && isVideoUrl(videoUrl);
  });

  const creatorIds = Array.from(new Set(videoRows.map((row) => rowString(row, ["creator_id"])).filter(Boolean)));
  const creatorsById: Record<string, AnyRow> = {};

  if (creatorIds.length > 0) {
    try {
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .in("id", creatorIds);

      if (!error) {
        (data ?? []).forEach((creator) => {
          creatorsById[String(creator.id)] = creator;
        });
      }
    } catch (err) {
      logSupabaseError("[Inspiration Feed creator_profiles] handled error", err);
    }
  }

  const mappedVideos = videoRows.map((row): DashboardVideoCardData & {
    searchable: string;
    language: string;
    location: string;
    budget: number | null;
    durationSeconds: number | null;
  } => {
    const creatorId = rowString(row, ["creator_id"]) || null;
    const creator = creatorId ? creatorsById[creatorId] : undefined;
    const category = normalizeNiche(creator?.niche) || rowString(row, ["category", "niche"], "General");
    const contentType = rowString(row, ["content_type", "contentType", "submission_type", "creative_type"], "Approved UGC");
    const platform = rowString(row, ["platform"], rowString(creator ?? {}, ["primary_platform"], "Other"));
    const durationSeconds = rowNumber(row, ["duration_seconds", "video_duration_seconds", "duration"]);
    const creatorName =
      rowString(creator ?? {}, ["display_name", "full_name", "name"]) ||
      rowString(row, ["creator_name", "creator_display_name"], "Creator");
    const language = rowString(row, ["language"], "All");
    const location = rowString(creator ?? {}, ["location"], rowString(row, ["creator_location", "location"], "Other"));
    const budget = rowNumber(row, ["budget", "proposed_rate", "price", "amount"]);

    return {
      id: rowString(row, ["id"]),
      videoUrl: rowString(row, ["video_url", "content_url", "file_url", "media_url"]),
      thumbnailUrl: rowString(row, ["thumbnail_url", "poster_url", "preview_url"]) || null,
      creatorId,
      creatorName,
      creatorAvatarUrl: rowString(creator ?? {}, ["avatar_url", "profile_image_url"]) || null,
      category,
      platform,
      contentType,
      duration: formatDuration(durationSeconds, rowString(row, ["duration_label", "video_duration"])),
      createdAtLabel: formatDashboardDate(rowString(row, ["created_at", "updated_at"])),
      searchable: [
        creatorName,
        category,
        platform,
        contentType,
        language,
        location,
        rowString(row, ["caption", "notes", "description"]),
      ].join(" ").toLowerCase(),
      language,
      location,
      budget,
      durationSeconds,
    };
  });

  const filteredVideos = mappedVideos.filter((video) => {
    const selected = (key: string) => selectedValues[key] ?? "All";

    if (selected("saved") === "Saved only") return false;
    if (searchValue && !video.searchable.includes(searchValue.toLowerCase())) return false;
    return (
      matchesFilter(video.platform, selected("platform")) &&
      matchesFilter(video.category, selected("category")) &&
      matchesFilter(video.contentType, selected("contentType")) &&
      matchesFilter(video.language, selected("language")) &&
      matchesFilter(video.location, selected("location")) &&
      matchesDuration(video.durationSeconds, selected("duration")) &&
      matchesBudget(video.budget, selected("budget"))
    );
  });

  const activeFilters = [
    searchValue ? `Search: ${searchValue}` : null,
    ...filterOptions
      .map((filter) => selectedValues[filter.name])
      .filter((value) => value && value !== "All"),
  ].filter(Boolean);

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="Inspiration Feed"
        description="Watch approved UGC videos, study hooks and creative formats, then shortlist creators for campaigns."
        action={
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold text-slate-600 shadow-sm">
            <Film className="h-4 w-4 text-brand-red-600" />
            Video-only
          </div>
        }
      />

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-red-100 bg-brand-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-red-600">
              
              Approved creator videos
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Find creative references without leaving your workflow.
            </h1>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
              Product demos, unboxings, testimonials, hooks, tutorials, lifestyle clips, and ad creative examples appear here only when real approved videos exist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Available</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-950">{mappedVideos.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Showing</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-950">{filteredVideos.length}</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardFilterBar
        filters={filterOptions}
        values={selectedValues}
        searchValue={searchValue}
      />

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span key={filter} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
              {filter}
            </span>
          ))}
        </div>
      )}

      {setupPending ? (
        <DashboardEmptyState
          title="Inspiration Feed setup is pending"
          description="Approved creator videos will appear here once the video library is connected."
          icon={BookOpen}
        />
      ) : filteredVideos.length === 0 ? (
        <DashboardEmptyState
          title="No inspiration videos available yet"
          description="UGC examples from creators will appear here once content is submitted and approved."
          icon={BookOpen}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredVideos.map((video) => (
            <DashboardVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
