"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import { CreatorFilterState, DEFAULT_FILTERS } from "@/types/creator";
import { formatFollowerCount } from "@/lib/creators/filterEngine";

interface ActiveFilterChipsProps {
  filters: CreatorFilterState;
  onRemoveSearch: () => void;
  onRemoveFollowers: () => void;
  onRemoveLocation: () => void;
  onRemoveNiche: (niche: string) => void;
  onRemoveGender: () => void;
  onRemoveEngagement: () => void;
  onClearAll: () => void;
}

export default function ActiveFilterChips({
  filters,
  onRemoveSearch,
  onRemoveFollowers,
  onRemoveLocation,
  onRemoveNiche,
  onRemoveGender,
  onRemoveEngagement,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasSearch = !!filters.query.trim();
  const hasFollowers =
    filters.minFollowers !== DEFAULT_FILTERS.minFollowers ||
    filters.maxFollowers !== DEFAULT_FILTERS.maxFollowers;
  const hasLocation = !!filters.state || !!filters.city;
  const hasNiches = filters.niches.length > 0;
  const hasGender = filters.gender !== null;
  const hasEngagement = (filters.minEngagementRate ?? 0) > 0;

  const hasAnyActive =
    hasSearch ||
    hasFollowers ||
    hasLocation ||
    hasNiches ||
    hasGender ||
    hasEngagement;

  if (!hasAnyActive) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pb-4">
      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
        Applied Filters:
      </span>

      {/* Search Query Chip */}
      {hasSearch && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs">
          <span className="text-zinc-400 font-normal">Search:</span> &quot;{filters.query}&quot;
          <button
            type="button"
            onClick={onRemoveSearch}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label="Remove search filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Followers Range Chip */}
      {hasFollowers && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs">
          <span className="text-zinc-400 font-normal">Reach:</span>{" "}
          {formatFollowerCount(filters.minFollowers)} –{" "}
          {filters.maxFollowers === null || filters.maxFollowers >= 10000000
            ? "10M+"
            : formatFollowerCount(filters.maxFollowers)}
          <button
            type="button"
            onClick={onRemoveFollowers}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label="Remove followers filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Location Chip */}
      {hasLocation && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs">
          <span className="text-zinc-400 font-normal">Geo:</span>{" "}
          {filters.city ? filters.city : ""}
          {filters.city && filters.state ? ", " : ""}
          {filters.state ? filters.state : ""}
          <button
            type="button"
            onClick={onRemoveLocation}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label="Remove location filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Niche Chips */}
      {filters.niches.map((niche) => (
        <span
          key={niche}
          className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs"
        >
          <span className="text-zinc-400 font-normal">Niche:</span> {niche}
          <button
            type="button"
            onClick={() => onRemoveNiche(niche)}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label={`Remove ${niche} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Gender Chip */}
      {hasGender && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs capitalize">
          <span className="text-zinc-400 font-normal">Gender:</span> {filters.gender}
          <button
            type="button"
            onClick={onRemoveGender}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label="Remove gender filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Engagement Rate Chip */}
      {hasEngagement && (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-zinc-200/90 px-2.5 py-1 text-xs font-semibold text-zinc-900 shadow-2xs">
          <span className="text-zinc-400 font-normal">Engagement:</span> {filters.minEngagementRate}%+
          <button
            type="button"
            onClick={onRemoveEngagement}
            className="rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
            aria-label="Remove engagement filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear All CTA */}
      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer border border-transparent hover:border-rose-100 ml-1"
      >
        <Trash2 className="h-3 w-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
}
