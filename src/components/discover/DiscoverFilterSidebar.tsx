"use client";

import React from "react";
import { RotateCcw, SlidersHorizontal, Users, MapPin, Sparkles, UserCheck, TrendingUp } from "lucide-react";
import DualFollowerSlider from "./DualFollowerSlider";
import LocationFilter from "./LocationFilter";
import NicheFilter from "./NicheFilter";
import GenderFilter from "./GenderFilter";
import EngagementRateFilter from "./EngagementRateFilter";
import { CreatorFilterState } from "@/types/creator";
import { getActiveFilterCount } from "@/lib/creators/filterEngine";

interface DiscoverFilterSidebarProps {
  filters: CreatorFilterState;
  onFilterChange: <K extends keyof CreatorFilterState>(
    key: K,
    value: CreatorFilterState[K]
  ) => void;
  onFiltersChange: (updates: Partial<CreatorFilterState>) => void;
  onResetFilters: () => void;
  className?: string;
}

export default function DiscoverFilterSidebar({
  filters,
  onFilterChange,
  onFiltersChange,
  onResetFilters,
  className = "",
}: DiscoverFilterSidebarProps) {
  const activeCount = getActiveFilterCount(filters);

  return (
    <aside
      className={`w-full lg:w-[290px] shrink-0 bg-white rounded-2xl border border-zinc-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden transition-all ${className}`}
    >
      {/* Dashboard Console Header */}
      <div className="flex items-center justify-between px-4.5 py-3.5 bg-zinc-50/80 border-b border-zinc-200/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Filter Console
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium">Targeted Criteria</p>
          </div>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-[10px] font-bold text-white shadow-xs">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2 py-1 rounded-md border border-rose-100 transition cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4.5 space-y-5 text-zinc-800">
        {/* 1. Followers Filter */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <Users className="h-3 w-3" />
            </div>
            <span>Audience & Reach</span>
          </div>
          <DualFollowerSlider
            key={`${filters.minFollowers}:${filters.maxFollowers}`}
            minFollowers={filters.minFollowers ?? 10000}
            maxFollowers={filters.maxFollowers ?? 10000000}
            onChange={(min, max) =>
              onFiltersChange({
                minFollowers: min,
                maxFollowers: max >= 10000000 ? null : max,
              })
            }
          />
        </section>

        <div className="border-t border-zinc-100" />

        {/* 2. Location Filter */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <MapPin className="h-3 w-3" />
            </div>
            <span>Location & Geo</span>
          </div>
          <LocationFilter
            country={filters.country ?? "India"}
            state={filters.state ?? ""}
            city={filters.city ?? ""}
            onLocationChange={(state, city) =>
              onFiltersChange({ state: state || null, city: city || null })
            }
          />
        </section>

        <div className="border-t border-zinc-100" />

        {/* 3. Niche Multi-Select */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <Sparkles className="h-3 w-3" />
            </div>
            <span>Content & Niche</span>
          </div>
          <NicheFilter
            selectedNiches={filters.niches}
            onChange={(niches) => onFilterChange("niches", niches)}
          />
        </section>

        <div className="border-t border-zinc-100" />

        {/* 4. Creator Gender */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <UserCheck className="h-3 w-3" />
            </div>
            <span>Creator Gender</span>
          </div>
          <GenderFilter
            gender={filters.gender ?? "all"}
            onChange={(gender) =>
              onFilterChange("gender", gender === "all" ? null : gender)
            }
          />
        </section>

        <div className="border-t border-zinc-100" />

        {/* 5. Engagement Rate */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
              <TrendingUp className="h-3 w-3" />
            </div>
            <span>Engagement Metric</span>
          </div>
          <EngagementRateFilter
            minEngagementRate={filters.minEngagementRate ?? 0}
            onChange={(rate) =>
              onFilterChange("minEngagementRate", rate > 0 ? rate : null)
            }
          />
        </section>
      </div>
    </aside>
  );
}
