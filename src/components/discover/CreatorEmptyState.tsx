"use client";

import React from "react";
import { RotateCcw, SearchX } from "lucide-react";

interface CreatorEmptyStateProps {
  onResetFilters: () => void;
}

export default function CreatorEmptyState({ onResetFilters }: CreatorEmptyStateProps) {
  return (
    <div className="flex min-h-[340px] w-full flex-col items-center justify-center rounded-xl border border-[#E8E8E8] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F5F5] border border-[#E8E8E8] text-[#666666] mb-3.5">
        <SearchX className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-semibold text-[#111111]">No creators found</h3>
      <p className="mt-1 max-w-sm text-xs text-[#666666] leading-relaxed">
        Try adjusting your follower range, location or niche to discover matching Instagram creators.
      </p>

      <button
        type="button"
        onClick={onResetFilters}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-3.5 py-2 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#222222] transition cursor-pointer"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Filters
      </button>
    </div>
  );
}
