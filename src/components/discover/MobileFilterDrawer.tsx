"use client";

import React, { useEffect } from "react";
import { X, RotateCcw, SlidersHorizontal, Users, MapPin, Sparkles, UserCheck, TrendingUp } from "lucide-react";
import DualFollowerSlider from "./DualFollowerSlider";
import LocationFilter from "./LocationFilter";
import NicheFilter from "./NicheFilter";
import GenderFilter from "./GenderFilter";
import EngagementRateFilter from "./EngagementRateFilter";
import { CreatorFilterState } from "@/types/creator";
import { getActiveFilterCount } from "@/lib/creators/filterEngine";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CreatorFilterState;
  onFilterChange: <K extends keyof CreatorFilterState>(
    key: K,
    value: CreatorFilterState[K]
  ) => void;
  onFiltersChange: (updates: Partial<CreatorFilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onFiltersChange,
  onResetFilters,
  totalResultsCount,
}: MobileFilterDrawerProps) {
  const activeCount = getActiveFilterCount(filters);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-200 border-t border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 bg-zinc-50/80 rounded-t-3xl">
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

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-900 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
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

        {/* Sticky Action Footer */}
        <div className="border-t border-zinc-200 bg-white p-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-[2] rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-md hover:bg-black transition"
          >
            Show {totalResultsCount} {totalResultsCount === 1 ? "Creator" : "Creators"}
          </button>
        </div>
      </div>
    </div>
  );
}
