"use client";

import React from "react";
import { ENGAGEMENT_RATE_OPTIONS } from "@/lib/creators/filterData";
import { Activity } from "lucide-react";

interface EngagementRateFilterProps {
  minEngagementRate: number;
  onChange: (rate: number) => void;
}

export default function EngagementRateFilter({
  minEngagementRate,
  onChange,
}: EngagementRateFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">Benchmark:</span>
        {minEngagementRate > 0 && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {ENGAGEMENT_RATE_OPTIONS.map((opt) => {
          const isSelected = minEngagementRate === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg py-1.5 px-2 text-xs transition cursor-pointer text-center border font-semibold ${
                isSelected
                  ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
