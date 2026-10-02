import {
  CreatorGender,
  CreatorSearchFilters,
  SortOption,
  ViewMode,
} from "./types";
import { normalizeLocation, normalizeNiches } from "./normalization";

export const DEFAULT_CREATOR_SEARCH_FILTERS: CreatorSearchFilters = {
  query: "",
  minFollowers: 10000,
  maxFollowers: null,
  country: "India",
  state: null,
  city: null,
  niches: [],
  gender: null,
  minEngagementRate: null,
  sort: "relevance",
  page: 1,
  limit: 24,
};

const GENDERS = new Set<CreatorGender>([
  "male",
  "female",
  "other",
  "unspecified",
]);
const SORTS = new Set<SortOption>([
  "relevance",
  "followers_desc",
  "followers_asc",
  "engagement_desc",
]);

function finiteNumber(value: string | null, fallback: number | null) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** Parse and normalize shareable URL state exactly once. */
export function parseCreatorSearchParams(
  params: Pick<URLSearchParams, "get" | "getAll">
): CreatorSearchFilters & { viewMode: ViewMode } {
  const location = normalizeLocation({
    country: params.get("country") || "India",
    state: params.get("state"),
    city: params.get("city"),
  });
  const nicheValues = params
    .getAll("niches")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
  const genderValue = params.get("gender")?.toLowerCase() as CreatorGender;
  const sortValue = params.get("sort") as SortOption;
  const maxValue = finiteNumber(params.get("maxFollowers"), null);
  const minValue = finiteNumber(params.get("minFollowers"), 10000);

  return {
    query: (params.get("q") || "").trim().slice(0, 100),
    minFollowers: minValue === null ? 10000 : Math.max(0, Math.round(minValue)),
    maxFollowers:
      maxValue === null || maxValue >= 10000000
        ? null
        : Math.max(0, Math.round(maxValue)),
    country: location.country || "India",
    state: location.state,
    city: location.city,
    niches: normalizeNiches(nicheValues).niches,
    gender: GENDERS.has(genderValue) ? genderValue : null,
    minEngagementRate: finiteNumber(params.get("minEngagement"), null),
    sort: SORTS.has(sortValue) ? sortValue : "relevance",
    page: Math.max(1, Math.round(finiteNumber(params.get("page"), 1) || 1)),
    limit: 24,
    viewMode: params.get("view") === "list" ? "list" : "grid",
  };
}

export function creatorFiltersToSearchParams(
  filters: CreatorSearchFilters & { viewMode?: ViewMode }
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.minFollowers !== 10000 && filters.minFollowers !== null) {
    params.set("minFollowers", String(filters.minFollowers));
  }
  if (filters.maxFollowers !== null) {
    params.set("maxFollowers", String(filters.maxFollowers));
  }
  if (filters.country && filters.country.toLowerCase() !== "india") {
    params.set("country", filters.country);
  }
  if (filters.state) params.set("state", filters.state);
  if (filters.city) params.set("city", filters.city);
  if (filters.niches.length) params.set("niches", filters.niches.join(","));
  if (filters.gender) params.set("gender", filters.gender);
  if (filters.minEngagementRate !== null && filters.minEngagementRate > 0) {
    params.set("minEngagement", String(filters.minEngagementRate));
  }
  if (filters.sort !== "relevance") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.viewMode && filters.viewMode !== "grid") {
    params.set("view", filters.viewMode);
  }
  return params;
}

export function normalizeCreatorSearchFilters(
  input: CreatorSearchFilters
): CreatorSearchFilters {
  const location = normalizeLocation(input);
  return {
    query: input.query.trim().replace(/^@/, "").toLowerCase(),
    minFollowers: input.minFollowers,
    maxFollowers:
      input.maxFollowers !== null && input.maxFollowers >= 10000000
        ? null
        : input.maxFollowers,
    country: location.country || null,
    state: location.state,
    city: location.city,
    niches: normalizeNiches(input.niches).niches.map((niche) =>
      niche.toLowerCase()
    ),
    gender: input.gender,
    minEngagementRate:
      input.minEngagementRate && input.minEngagementRate > 0
        ? input.minEngagementRate
        : null,
    sort: input.sort,
    page: input.page,
    limit: input.limit,
  };
}

export function createCreatorSearchKey(filters: CreatorSearchFilters): string {
  const value = normalizeCreatorSearchFilters(filters);
  return [
    value.country?.toLowerCase() || "any",
    value.state?.toLowerCase() || "any",
    value.city?.toLowerCase() || "any",
    [...value.niches].sort().join("+") || "any",
    value.gender || "any",
    value.minFollowers ?? "any",
    value.maxFollowers ?? "unbounded",
    value.minEngagementRate ?? "any",
    value.sort,
    value.page,
    value.limit,
    value.query || "any",
  ].join("|");
}

export function getActiveCreatorFilterCount(filters: CreatorSearchFilters) {
  let count = 0;
  if (filters.query) count += 1;
  if (filters.minFollowers !== 10000 || filters.maxFollowers !== null) count += 1;
  if (filters.state) count += 1;
  if (filters.city) count += 1;
  count += filters.niches.length;
  if (filters.gender) count += 1;
  if (filters.minEngagementRate) count += 1;
  return count;
}
