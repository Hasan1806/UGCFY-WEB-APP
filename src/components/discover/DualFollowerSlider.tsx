"use client";

import React, { useState } from "react";
import { formatFollowerCount } from "@/lib/creators/filterEngine";
import { FOLLOWER_TIERS } from "@/lib/creators/filterData";

interface DualFollowerSliderProps {
  minFollowers: number;
  maxFollowers: number;
  onChange: (min: number, max: number) => void;
}

const ABSOLUTE_MIN = 10000; // 10K
const ABSOLUTE_MAX = 10000000; // 10M

// Convert value to logarithmic percentage (0 - 100) for natural feel across 10K to 10M
function valueToPercent(val: number): number {
  const minLog = Math.log10(ABSOLUTE_MIN);
  const maxLog = Math.log10(ABSOLUTE_MAX);
  const valLog = Math.log10(Math.max(ABSOLUTE_MIN, Math.min(ABSOLUTE_MAX, val)));
  return ((valLog - minLog) / (maxLog - minLog)) * 100;
}

// Convert percentage (0 - 100) back to rounded follower value
function percentToValue(pct: number): number {
  const minLog = Math.log10(ABSOLUTE_MIN);
  const maxLog = Math.log10(ABSOLUTE_MAX);
  const val = Math.pow(10, minLog + (pct / 100) * (maxLog - minLog));
  
  if (val < 100000) {
    return Math.round(val / 5000) * 5000; // 5K increments under 100K
  }
  if (val < 1000000) {
    return Math.round(val / 25000) * 25000; // 25K increments under 1M
  }
  return Math.round(val / 100000) * 100000; // 100K increments above 1M
}

export default function DualFollowerSlider({
  minFollowers,
  maxFollowers,
  onChange,
}: DualFollowerSliderProps) {
  const [localMinInput, setLocalMinInput] = useState(minFollowers.toLocaleString("en-IN"));
  const [localMaxInput, setLocalMaxInput] = useState(
    maxFollowers >= ABSOLUTE_MAX ? "10,000,000" : maxFollowers.toLocaleString("en-IN")
  );
  const [draftMin, setDraftMin] = useState(minFollowers);
  const [draftMax, setDraftMax] = useState(maxFollowers);

  const minPercent = Math.min(Math.max(0, valueToPercent(draftMin)), 100);
  const maxPercent = Math.min(Math.max(0, valueToPercent(draftMax)), 100);

  const handleMinSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPct = parseFloat(e.target.value);
    const newMin = Math.min(percentToValue(newPct), draftMax - 5000);
    const clamped = Math.max(ABSOLUTE_MIN, newMin);
    setDraftMin(clamped);
    setLocalMinInput(clamped.toLocaleString("en-IN"));
  };

  const handleMaxSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPct = parseFloat(e.target.value);
    const newMax = Math.max(percentToValue(newPct), draftMin + 5000);
    const clamped = Math.min(ABSOLUTE_MAX, newMax);
    setDraftMax(clamped);
    setLocalMaxInput(clamped.toLocaleString("en-IN"));
  };

  const commitSlider = () => {
    if (draftMin !== minFollowers || draftMax !== maxFollowers) {
      onChange(draftMin, draftMax);
    }
  };

  const handleMinInputBlur = () => {
    const cleaned = parseInt(localMinInput.replace(/,/g, "").replace(/\D/g, ""), 10);
    if (!isNaN(cleaned)) {
      const clamped = Math.max(ABSOLUTE_MIN, Math.min(cleaned, maxFollowers - 1000));
      setDraftMin(clamped);
      onChange(clamped, maxFollowers);
      setLocalMinInput(clamped.toLocaleString("en-IN"));
    } else {
      setLocalMinInput(minFollowers.toLocaleString("en-IN"));
    }
  };

  const handleMaxInputBlur = () => {
    const cleaned = parseInt(localMaxInput.replace(/,/g, "").replace(/\D/g, ""), 10);
    if (!isNaN(cleaned)) {
      const clamped = Math.min(ABSOLUTE_MAX, Math.max(cleaned, minFollowers + 1000));
      setDraftMax(clamped);
      onChange(minFollowers, clamped);
      setLocalMaxInput(clamped.toLocaleString("en-IN"));
    } else {
      setLocalMaxInput(maxFollowers.toLocaleString("en-IN"));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isMin: boolean) => {
    if (e.key === "Enter") {
      if (isMin) handleMinInputBlur();
      else handleMaxInputBlur();
    }
  };

  return (
    <div className="space-y-3">
      {/* Live Badge Display */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">Range:</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-900 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md shadow-2xs">
          <span>{formatFollowerCount(draftMin)}</span>
          <span className="text-zinc-400">→</span>
          <span>{draftMax >= ABSOLUTE_MAX ? "10M+" : formatFollowerCount(draftMax)}</span>
        </span>
      </div>

      {/* Dual Slider Track */}
      <div className="relative pt-2 pb-2.5">
        <div className="relative h-2 w-full rounded-full bg-zinc-100 border border-zinc-200/60 overflow-hidden">
          <div
            className="absolute top-0 h-full rounded-full bg-zinc-900 transition-all duration-75"
            style={{
              left: `${minPercent}%`,
              width: `${Math.max(0, maxPercent - minPercent)}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={minPercent}
          onChange={handleMinSlider}
          onPointerUp={commitSlider}
          onKeyUp={commitSlider}
          aria-label="Minimum followers"
          className="pointer-events-none absolute top-1 left-0 h-2 w-full appearance-none bg-transparent accent-zinc-900 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={maxPercent}
          onChange={handleMaxSlider}
          onPointerUp={commitSlider}
          onKeyUp={commitSlider}
          aria-label="Maximum followers"
          className="pointer-events-none absolute top-1 left-0 h-2 w-full appearance-none bg-transparent accent-zinc-900 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-900 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
        />

        <div className="mt-2 flex justify-between text-[10px] font-semibold text-zinc-400">
          <span>10K</span>
          <span>100K</span>
          <span>1M</span>
          <span>10M+</span>
        </div>
      </div>

      {/* Manual Input Boxes */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Min
            </label>
          </div>
          <input
            type="text"
            value={localMinInput}
            onChange={(e) => setLocalMinInput(e.target.value)}
            onBlur={handleMinInputBlur}
            onKeyDown={(e) => handleKeyDown(e, true)}
            className="h-[32px] w-full rounded-lg border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="10,000"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Max
            </label>
          </div>
          <input
            type="text"
            value={localMaxInput}
            onChange={(e) => setLocalMaxInput(e.target.value)}
            onBlur={handleMaxInputBlur}
            onKeyDown={(e) => handleKeyDown(e, false)}
            className="h-[32px] w-full rounded-lg border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-2xs transition hover:border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="200,000"
          />
        </div>
      </div>

      {/* Quick Tier Selection Chips */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
          Quick Tiers:
        </p>
        <div className="flex flex-wrap gap-1">
          {FOLLOWER_TIERS.map((tier) => {
            const isActive = minFollowers === tier.min && maxFollowers === tier.max;
            return (
              <button
                key={tier.label}
                type="button"
                onClick={() => {
                  if (isActive) {
                    setDraftMin(ABSOLUTE_MIN);
                    setDraftMax(ABSOLUTE_MAX);
                    setLocalMinInput(ABSOLUTE_MIN.toLocaleString("en-IN"));
                    setLocalMaxInput("10,000,000");
                    onChange(ABSOLUTE_MIN, ABSOLUTE_MAX);
                  } else {
                    setDraftMin(tier.min);
                    setDraftMax(tier.max);
                    setLocalMinInput(tier.min.toLocaleString("en-IN"));
                    setLocalMaxInput(tier.max.toLocaleString("en-IN"));
                    onChange(tier.min, tier.max);
                  }
                }}
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition cursor-pointer border ${
                  isActive
                    ? "bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {tier.label.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
