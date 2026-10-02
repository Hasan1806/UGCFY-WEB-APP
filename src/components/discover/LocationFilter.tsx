"use client";

import React, { useMemo } from "react";
import { ChevronDown, MapPin, Check, Globe } from "lucide-react";
import { INDIAN_STATES_CITIES, POPULAR_INDIAN_CITIES } from "@/lib/creators/filterData";

interface LocationFilterProps {
  country: string;
  state: string;
  city: string;
  onLocationChange: (state: string, city: string) => void;
}

export default function LocationFilter({
  country = "India",
  state,
  city,
  onLocationChange,
}: LocationFilterProps) {
  const statesList = useMemo(() => Object.keys(INDIAN_STATES_CITIES), []);

  const citiesList = useMemo(() => {
    if (state && INDIAN_STATES_CITIES[state]) {
      return INDIAN_STATES_CITIES[state];
    }
    return POPULAR_INDIAN_CITIES;
  }, [state]);

  const hasLocation = Boolean(state || city);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">Geo Filter:</span>
        {hasLocation && (
          <button
            type="button"
            onClick={() => onLocationChange("", "")}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
          >
            Clear Geo
          </button>
        )}
      </div>

      {/* Country Fixed Chip */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
          Market / Country
        </label>
        <div className="flex items-center justify-between h-[32px] w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-2.5 text-xs font-semibold text-zinc-700">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🇮🇳</span>
            <span>India</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200/60 text-zinc-600 uppercase tracking-wider">
            Verified
          </span>
        </div>
      </div>

      {/* State Selection */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
          State / Region
        </label>
        <div className="relative">
          <select
            value={state}
            onChange={(e) => {
              onLocationChange(e.target.value, "");
            }}
            className={`h-[32px] w-full appearance-none rounded-lg border bg-white px-2.5 pr-8 text-xs font-semibold shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer ${
              state ? "border-zinc-900 text-zinc-900 bg-zinc-50/30" : "border-zinc-200 text-zinc-700"
            }`}
          >
            <option value="">All States (Pan-India)</option>
            {statesList.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {/* City Selection */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
          City / Metro
        </label>
        <div className="relative">
          <select
            value={city}
            onChange={(e) => onLocationChange(state, e.target.value)}
            className={`h-[32px] w-full appearance-none rounded-lg border bg-white px-2.5 pr-8 text-xs font-semibold shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer ${
              city ? "border-zinc-900 text-zinc-900 bg-zinc-50/30" : "border-zinc-200 text-zinc-700"
            }`}
          >
            <option value="">{state ? `All ${state} Cities` : "All Top Metros & Cities"}</option>
            {citiesList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>
    </div>
  );
}
