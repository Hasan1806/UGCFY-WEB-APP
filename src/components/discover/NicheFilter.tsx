"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Check, Sparkles } from "lucide-react";
import { NICHES_LIST } from "@/lib/creators/filterData";

interface NicheFilterProps {
  selectedNiches: string[];
  onChange: (niches: string[]) => void;
}

const POPULAR_NICHES = ["Fashion", "Beauty", "Lifestyle", "Technology", "Fitness", "Food"];

export default function NicheFilter({ selectedNiches, onChange }: NicheFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNiches = useMemo(() => {
    if (!searchQuery.trim()) return NICHES_LIST;
    return NICHES_LIST.filter((niche) =>
      niche.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [searchQuery]);

  const toggleNiche = (niche: string) => {
    if (selectedNiches.includes(niche)) {
      onChange(selectedNiches.filter((n) => n !== niche));
    } else {
      onChange([...selectedNiches, niche]);
    }
  };

  const removeNiche = (niche: string) => {
    onChange(selectedNiches.filter((n) => n !== niche));
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">Categories:</span>
        {selectedNiches.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
          >
            Clear ({selectedNiches.length})
          </button>
        )}
      </div>

      {/* Selected Niches Chips */}
      {selectedNiches.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedNiches.map((niche) => (
            <span
              key={niche}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-900 text-white px-2 py-0.5 text-[11px] font-semibold shadow-2xs"
            >
              {niche}
              <button
                type="button"
                onClick={() => removeNiche(niche)}
                aria-label={`Remove ${niche}`}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded p-0.5 transition cursor-pointer"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Quick Popular Niches */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
          Popular:
        </p>
        <div className="flex flex-wrap gap-1">
          {POPULAR_NICHES.map((niche) => {
            const isSelected = selectedNiches.includes(niche);
            return (
              <button
                key={niche}
                type="button"
                onClick={() => toggleNiche(niche)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-medium transition cursor-pointer border ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-2xs"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Niche Box */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter 20+ niches..."
          className="h-[32px] w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-7 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Scrollable Niches List */}
      <div className="max-h-36 overflow-y-auto space-y-0.5 rounded-lg border border-zinc-200 bg-zinc-50/50 p-1 text-xs">
        {filteredNiches.map((niche) => {
          const isChecked = selectedNiches.includes(niche);
          return (
            <label
              key={niche}
              className={`flex items-center justify-between rounded-md px-2 py-1 transition cursor-pointer ${
                isChecked
                  ? "bg-white text-zinc-900 font-semibold shadow-2xs border border-zinc-200"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleNiche(niche)}
                  className="h-3.5 w-3.5 rounded border-zinc-300 text-zinc-900 accent-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-xs">{niche}</span>
              </div>
              {isChecked && <Check className="h-3 w-3 text-zinc-900" />}
            </label>
          );
        })}

        {filteredNiches.length === 0 && (
          <div className="py-2 text-center text-[11px] text-zinc-400">
            No niches matching &quot;{searchQuery}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
