"use client";

import React from "react";
import { ChevronDown, Grid2X2, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { SortOption, ViewMode } from "@/types/creator";
import { SORT_OPTIONS } from "@/lib/creators/filterData";

interface ResultsToolbarProps {
  totalCount: number;
  status: "idle" | "loading" | "success" | "error";
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
}

export default function ResultsToolbar({
  totalCount,
  status,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenMobileFilters,
  activeFilterCount,
}: ResultsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/90 bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] mb-4">
      {/* Left: Live Status Count & Mobile Filter Trigger */}
      <div className="flex items-center gap-3">
        {/* Mobile Filter Button */}
        <button
          type="button"
          onClick={onOpenMobileFilters}
          className="lg:hidden flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Total Count Live Badge */}
        <div className="flex items-center gap-2 text-xs" aria-live="polite">
          {status === "loading" ? (
            <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Filtering creators...</span>
            </div>
          ) : status === "success" ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-zinc-900">{totalCount.toLocaleString()}</span>{" "}
              <span className="text-zinc-500 font-medium">
                {totalCount === 1 ? "creator matched" : "creators matched"}
              </span>
            </div>
          ) : status === "error" ? (
            <div className="flex items-center gap-1.5 text-rose-600 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
              <span>Search interrupted</span>
            </div>
          ) : (
            <span className="text-zinc-500 font-medium">Ready to search</span>
          )}
        </div>
      </div>

      {/* Right: Sort and View Mode Toggle */}
      <div className="flex items-center gap-2.5">
        {/* Sort Selector */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-[34px] appearance-none rounded-xl border border-zinc-200 bg-zinc-50/60 pl-3 pr-8 text-xs font-semibold text-zinc-800 shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* View Mode Toggle (Grid / List) */}
        <div className="hidden sm:flex items-center rounded-xl bg-zinc-100 p-0.5 border border-zinc-200">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid View"
            className={`rounded-lg p-1.5 transition cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <Grid2X2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List View"
            className={`rounded-lg p-1.5 transition cursor-pointer ${
              viewMode === "list"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-400 hover:text-zinc-900"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
