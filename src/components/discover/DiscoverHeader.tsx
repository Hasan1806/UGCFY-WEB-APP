"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Sparkles, Command } from "lucide-react";

interface DiscoverHeaderProps {
  search: string;
  onSearchChange: (query: string) => void;
}

const QUICK_SEARCH_SUGGESTIONS = [
  "Beauty",
  "Fashion",
  "Technology",
  "Fitness",
  "Food",
  "Travel",
];

export default function DiscoverHeader({ search, onSearchChange }: DiscoverHeaderProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Text search alone is debounced; discrete filters commit immediately.
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  // Keep local input in sync if parent clears search
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  return (
    <div className="mb-6 space-y-4">
      {/* Dashboard Top Eyebrow & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#EAEAEA]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 items-center gap-1.5 rounded-full bg-zinc-900 px-2.5 text-[11px] font-semibold text-white tracking-wide uppercase shadow-xs">
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span>Discover Console</span>
          </div>
          <span className="hidden sm:inline-block h-3.5 w-[1px] bg-zinc-300" />
          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>200M+ Indexed Creators</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600">
            India Network
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600">
            AI Verified Metrics
          </span>
        </div>
      </div>

      {/* Main Title & Search Deck */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-zinc-900 leading-tight">
            Creator Discovery Engine
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-xl">
            Filter, pinpoint, and shortlist high-engagement creators with verified audience insights.
          </p>
        </div>

        {/* Dashboard Search Command Box */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="relative group">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
              <Search className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search creator, niche, handle (@) or keyword..."
              className="h-[46px] w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-20 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />

            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {localSearch ? (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    onSearchChange("");
                  }}
                  className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 bg-zinc-100 border border-zinc-200">
                  <Command className="h-2.5 w-2.5" /> K
                </span>
              )}
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 shrink-0">
              Popular:
            </span>
            {QUICK_SEARCH_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setLocalSearch(tag);
                  onSearchChange(tag);
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition cursor-pointer shrink-0 ${
                  localSearch.toLowerCase() === tag.toLowerCase()
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
