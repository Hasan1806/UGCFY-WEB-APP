export * from "@/lib/creators/types";

import { CreatorSearchFilters, ViewMode } from "@/lib/creators/types";

export interface CreatorFilterState extends CreatorSearchFilters {
  viewMode: ViewMode;
}

export const DEFAULT_FILTERS: CreatorFilterState = {
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
  viewMode: "grid",
  page: 1,
  limit: 24,
};
