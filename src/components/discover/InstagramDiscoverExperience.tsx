"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Creator,
  CreatorFilterState,
  DEFAULT_FILTERS,
  PaginationMetadata,
  CreatorSearchFilters,
  CreatorSearchResponse,
} from "@/types/creator";
import {
  createCreatorSearchKey,
  creatorFiltersToSearchParams,
  getActiveCreatorFilterCount,
  parseCreatorSearchParams,
} from "@/lib/creators/searchFilters";

import DiscoverHeader from "./DiscoverHeader";
import DiscoverFilterSidebar from "./DiscoverFilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import ActiveFilterChips from "./ActiveFilterChips";
import ResultsToolbar from "./ResultsToolbar";
import CreatorCard from "./CreatorCard";
import CreatorSkeleton from "./CreatorSkeleton";
import CreatorEmptyState from "./CreatorEmptyState";
import CreatorProfileModal from "./CreatorProfileModal";
import { ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

type SearchStatus = "idle" | "loading" | "success" | "error";

interface SearchState {
  status: SearchStatus;
  exactMatches: Creator[];
  potentialMatches: Creator[];
  creators: Creator[];
  pagination: PaginationMetadata;
  error: string | null;
}

const EMPTY_PAGINATION: PaginationMetadata = {
  page: 1,
  limit: 24,
  total: 0,
  totalPages: 0,
  hasMore: false,
};
const CLIENT_TIMEOUT_MS = 14_000;

export default function InstagramDiscoverExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const filters = useMemo<CreatorFilterState>(
    () => parseCreatorSearchParams(new URLSearchParams(serializedParams)),
    [serializedParams]
  );
  const requestFilters = useMemo<CreatorSearchFilters>(
    () => ({
      query: filters.query,
      minFollowers: filters.minFollowers,
      maxFollowers: filters.maxFollowers,
      country: filters.country,
      state: filters.state,
      city: filters.city,
      niches: filters.niches,
      gender: filters.gender,
      minEngagementRate: filters.minEngagementRate,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters]
  );
  const requestKey = createCreatorSearchKey(requestFilters);
  // Keep the payload referentially stable when only presentation state changes.
  const stableRequestFilters = useMemo(() => requestFilters, [requestKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
    exactMatches: [],
    potentialMatches: [],
    creators: [],
    pagination: EMPTY_PAGINATION,
    error: null,
  });
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedCreatorForModal, setSelectedCreatorForModal] =
    useState<Creator | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [savedCreatorIds, setSavedCreatorIds] = useState<Set<string>>(
    () => new Set()
  );

  const sequenceRef = useRef(0);
  const activeRequestRef = useRef<{
    id: number;
    key: string;
    controller: AbortController;
  } | null>(null);
  const completedKeyRef = useRef<string | null>(null);

  const updateFilters = useCallback(
    (
      updates: Partial<CreatorFilterState>,
      options: { resetPage?: boolean; replace?: boolean } = {}
    ) => {
      const next: CreatorFilterState = {
        ...filters,
        ...updates,
        page: options.resetPage === false ? updates.page ?? filters.page : 1,
      };
      const query = creatorFiltersToSearchParams(next).toString();
      const href = query ? `/platform/discover?${query}` : "/platform/discover";
      const currentHref = serializedParams
        ? `/platform/discover?${serializedParams}`
        : "/platform/discover";
      if (href === currentHref) return;
      if (options.replace) router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    },
    [filters, router, serializedParams]
  );

  const executeSearch = useCallback(
    async (force = false) => {
      if (!force) {
        if (activeRequestRef.current?.key === requestKey) return;
        // Returning to a previously completed key while a different request is
        // active must cancel that request and re-establish the requested state.
        if (
          completedKeyRef.current === requestKey &&
          activeRequestRef.current === null
        ) {
          return;
        }
      }

      const requestId = ++sequenceRef.current;
      activeRequestRef.current?.controller.abort();
      const controller = new AbortController();
      activeRequestRef.current = { id: requestId, key: requestKey, controller };
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, CLIENT_TIMEOUT_MS);

      setSearchState((previous) => ({
        ...previous,
        status: "loading",
        error: null,
      }));

      try {
        const response = await fetch("/api/creators/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stableRequestFilters),
          signal: controller.signal,
          cache: "no-store",
        });
        const rawBody = await response.text();
        let data: CreatorSearchResponse;
        try {
          data = JSON.parse(rawBody) as CreatorSearchResponse;
        } catch {
          throw new Error("The creator search returned an invalid response.");
        }
        if (!response.ok || !data.success) {
          throw new Error(
            !data.success
              ? data.error.message
              : `Creator search failed with HTTP ${response.status}.`
          );
        }
        if (sequenceRef.current !== requestId) return;

        const exactMatches = Array.isArray((data as any).exactMatches) ? (data as any).exactMatches : [];
        const potentialMatches = Array.isArray((data as any).potentialMatches) ? (data as any).potentialMatches : [];
        const combinedCreators = Array.isArray(data.creators) ? data.creators : [...exactMatches, ...potentialMatches];

        completedKeyRef.current = requestKey;
        activeRequestRef.current = null;
        setSearchState({
          status: "success",
          exactMatches,
          potentialMatches,
          creators: combinedCreators,
          pagination: data.pagination,
          error: null,
        });
      } catch (error) {
        if (sequenceRef.current !== requestId) return;
        activeRequestRef.current = null;
        if (error instanceof Error && error.name === "AbortError" && !timedOut) {
          return;
        }
        setSearchState((previous) => ({
          ...previous,
          status: "error",
          error: timedOut
            ? "The creator search took too long. Please try again."
            : error instanceof Error
              ? error.message
              : "Unable to load creators.",
        }));
      } finally {
        clearTimeout(timeout);
      }
    },
    [requestKey, stableRequestFilters]
  );

  useEffect(() => {
    void executeSearch();
  }, [executeSearch]);

  const handleFilterChange = useCallback(
    <K extends keyof CreatorFilterState>(
      key: K,
      value: CreatorFilterState[K]
    ) => updateFilters({ [key]: value } as Partial<CreatorFilterState>),
    [updateFilters]
  );

  const handleResetFilters = useCallback(() => {
    updateFilters(
      { ...DEFAULT_FILTERS, viewMode: filters.viewMode },
      { replace: true }
    );
  }, [filters.viewMode, updateFilters]);

  const handleToggleSave = useCallback((creatorId: string) => {
    setSavedCreatorIds((previous) => {
      const next = new Set(previous);
      if (next.has(creatorId)) next.delete(creatorId);
      else next.add(creatorId);
      return next;
    });
  }, []);

  const handleViewProfile = useCallback((creator: Creator) => {
    setSelectedCreatorForModal(creator);
    setIsProfileModalOpen(true);
  }, []);

  const { status, creators, pagination } = searchState;
  const activeFilterCount = getActiveCreatorFilterCount(requestFilters);

  return (
    <div className="w-full">
      <DiscoverHeader
        key={filters.query}
        search={filters.query}
        onSearchChange={(query) => handleFilterChange("query", query)}
      />

      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="hidden lg:block lg:sticky lg:top-24">
          <DiscoverFilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onFiltersChange={(updates) => updateFilters(updates)}
            onResetFilters={handleResetFilters}
          />
        </div>

        <MobileFilterDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFiltersChange={(updates) => updateFilters(updates)}
          onResetFilters={handleResetFilters}
          totalResultsCount={pagination.total}
        />

        <div className="flex-1 w-full min-w-0">
          <ResultsToolbar
            totalCount={pagination.total}
            status={status}
            sortBy={filters.sort}
            onSortChange={(sort) => handleFilterChange("sort", sort)}
            viewMode={filters.viewMode}
            onViewModeChange={(viewMode) =>
              updateFilters({ viewMode }, { resetPage: false, replace: true })
            }
            onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
            activeFilterCount={activeFilterCount}
          />

          <ActiveFilterChips
            filters={filters}
            onRemoveSearch={() => handleFilterChange("query", "")}
            onRemoveFollowers={() =>
              updateFilters({ minFollowers: 10000, maxFollowers: null })
            }
            onRemoveLocation={() =>
              updateFilters({ state: null, city: null })
            }
            onRemoveNiche={(niche) =>
              handleFilterChange(
                "niches",
                filters.niches.filter((item) => item !== niche)
              )
            }
            onRemoveGender={() => handleFilterChange("gender", null)}
            onRemoveEngagement={() =>
              handleFilterChange("minEngagementRate", null)
            }
            onClearAll={handleResetFilters}
          />

          {status === "idle" || status === "loading" ? (
            <CreatorSkeleton viewMode={filters.viewMode} count={6} />
          ) : status === "error" ? (
            <div className="flex min-h-[320px] w-full flex-col items-center justify-center rounded-xl border border-[#E8E8E8] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-600 mb-3">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Couldn&apos;t load creators
              </h3>
              <p className="mt-1 text-xs text-[#666666] max-w-sm">
                Something interrupted the creator search. Please try again.
              </p>
              {searchState.error && (
                <p className="mt-1.5 text-[11px] text-[#8A8A8A]">
                  {searchState.error}
                </p>
              )}
              <button
                type="button"
                onClick={() => void executeSearch(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#222222] transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          ) : creators.length === 0 ? (
            <CreatorEmptyState onResetFilters={handleResetFilters} />
          ) : (
            <div className="space-y-8">
              {/* EXACT MATCHES SECTION */}
              {searchState.exactMatches.length > 0 ? (
                filters.viewMode === "list" ? (
                  <div className="space-y-3">
                    {searchState.exactMatches.map((creator) => (
                      <CreatorCard
                        key={creator.id}
                        creator={creator}
                        viewMode="list"
                        isSaved={savedCreatorIds.has(creator.id)}
                        onToggleSave={handleToggleSave}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {searchState.exactMatches.map((creator) => (
                      <CreatorCard
                        key={creator.id}
                        creator={creator}
                        viewMode="grid"
                        isSaved={savedCreatorIds.has(creator.id)}
                        onToggleSave={handleToggleSave}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                )
              ) : searchState.potentialMatches.length > 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900">
                  <span className="font-semibold">No exact matches verified for all strict filter bounds.</span> Showing potential creator candidates below.
                </div>
              ) : null}

              {/* POTENTIAL MATCHES SECTION */}
              {searchState.potentialMatches.length > 0 && (
                <div className={searchState.exactMatches.length > 0 ? "pt-6 border-t border-[#E8E8E8]" : ""}>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-stone-100 border border-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                        Potential Matches ({searchState.potentialMatches.length})
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#666666]">
                      Some requested profile information could not be independently verified from public search evidence.
                    </p>
                  </div>

                  {filters.viewMode === "list" ? (
                    <div className="space-y-3">
                      {searchState.potentialMatches.map((creator) => (
                        <CreatorCard
                          key={creator.id}
                          creator={creator}
                          viewMode="list"
                          isSaved={savedCreatorIds.has(creator.id)}
                          onToggleSave={handleToggleSave}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {searchState.potentialMatches.map((creator) => (
                        <CreatorCard
                          key={creator.id}
                          creator={creator}
                          viewMode="grid"
                          isSaved={savedCreatorIds.has(creator.id)}
                          onToggleSave={handleToggleSave}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {pagination.totalPages > 1 && status === "success" && (
            <div className="mt-8 flex items-center justify-between border border-[#E8E8E8] bg-white rounded-xl px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div className="text-xs font-medium text-[#666666]">
                Page <span className="font-semibold text-[#111111]">{pagination.page}</span> of{" "}
                <span className="font-semibold text-[#111111]">{pagination.totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    updateFilters(
                      { page: Math.max(1, pagination.page - 1) },
                      { resetPage: false }
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E8E8E8] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] hover:border-[#D0D0D0] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasMore}
                  onClick={() =>
                    updateFilters(
                      { page: pagination.page + 1 },
                      { resetPage: false }
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E8E8E8] bg-white px-3 py-1.5 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] hover:border-[#D0D0D0] disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreatorProfileModal
        creator={selectedCreatorForModal}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        isSaved={
          selectedCreatorForModal
            ? savedCreatorIds.has(selectedCreatorForModal.id)
            : false
        }
        onToggleSave={handleToggleSave}
      />
    </div>
  );
}
