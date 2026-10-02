"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, TrendingUp, Search, SlidersHorizontal, ArrowRight, Sparkles, Check } from "lucide-react";

export default function CreatorDiscoveryMockup() {
  const [step, setStep] = useState(0);

  const creators = [
    {
      id: 0,
      name: "Aanya Sharma",
      handle: "@aanya.creates",
      niche: "Fashion & Lifestyle",
      followers: "245K",
      engagement: "4.8%",
      match: "98%",
      avatarGradient: "from-rose-500 to-pink-600",
      location: "Mumbai",
    },
    {
      id: 1,
      name: "Rohan Mehta",
      handle: "@rohan.fits",
      niche: "Fitness & Health",
      followers: "128K",
      engagement: "5.2%",
      match: "94%",
      avatarGradient: "from-blue-600 to-indigo-600",
      location: "Bangalore",
    },
    {
      id: 2,
      name: "Priya Nair",
      handle: "@priyanair",
      niche: "Beauty & Skincare",
      followers: "450K",
      engagement: "3.9%",
      match: "91%",
      avatarGradient: "from-amber-500 to-orange-600",
      location: "Delhi NCR",
    },
  ];

  // Subtle SaaS product simulation: 1 -> 2 -> 3 creators selected -> activate workflow -> loop
  useEffect(() => {
    const durations = [2800, 2800, 4500];
    const timer = setTimeout(() => {
      setStep((prev) => (prev + 1) % 3);
    }, durations[step]);

    return () => clearTimeout(timer);
  }, [step]);

  const selectedCount = step + 1;
  const isReady = step === 2;

  return (
    <div className="w-full h-full bg-white rounded-2xl md:rounded-[24px] border border-gray-100/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden text-sm select-none">
      {/* SaaS Window Header */}
      <div className="bg-[#FAF8F8] border-b border-gray-100 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-bold text-gray-700 ml-2">Discover Creators</span>
          <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
            2,480+ Active
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200/80 rounded-lg px-2 py-1 text-[11px] text-gray-500 shadow-2xs">
            <Search className="w-3 h-3 text-gray-400" />
            <span>Search niche...</span>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200/80 text-[11px] font-semibold px-2.5 py-1 rounded-lg text-gray-600 shadow-2xs">
            <SlidersHorizontal className="w-3 h-3 text-gray-500" />
            <span>Filters (2)</span>
          </div>
        </div>
      </div>

      {/* Filter Quick Pills */}
      <div className="px-4 sm:px-5 py-2.5 bg-white border-b border-gray-50 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-gray-400 font-medium">Applied:</span>
        <span className="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 font-semibold text-gray-700 whitespace-nowrap">
          Niche: Fashion & Beauty
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 font-semibold text-gray-700 whitespace-nowrap">
          Tier: Micro (100k-500k)
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100 font-semibold text-[var(--color-primary)] whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> AI Match: &gt;90%
        </span>
      </div>

      {/* Creator Card List */}
      <div className="p-3 sm:p-4 flex flex-col gap-2.5 flex-1 bg-[#FCFBFA]/50">
        {creators.map((creator, idx) => {
          const isSelected = idx <= step;
          return (
            <div
              key={creator.id}
              onClick={() => setStep(idx)}
              className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-white border-rose-300/90 shadow-[0_4px_16px_rgba(225,29,72,0.07)] ring-1 ring-rose-400/30"
                  : "bg-white/80 border-gray-100/90 hover:border-gray-200 hover:bg-white"
              }`}
            >
              {/* Creator Info & Selection State */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-300 shrink-0 ${
                    isSelected
                      ? "bg-[var(--color-primary)] text-white shadow-2xs"
                      : "border border-gray-300/80 bg-gray-50"
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${creator.avatarGradient} flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0`}
                >
                  {creator.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <div className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <span>{creator.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-50 shrink-0" />
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    {creator.handle} • <span className="text-gray-400">{creator.niche}</span>
                  </div>
                </div>
              </div>

              {/* Metrics & Match Badge */}
              <div className="flex items-center gap-3 sm:gap-5 text-right">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-extrabold text-gray-900 text-xs sm:text-sm leading-tight">
                    {creator.followers}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Audience
                  </span>
                </div>

                <div className="hidden md:flex flex-col text-right">
                  <span className="font-extrabold text-gray-900 text-xs sm:text-sm leading-tight flex items-center justify-end gap-1">
                    {creator.engagement}
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Eng. Rate
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-100/80 text-[var(--color-primary)] text-xs font-extrabold shrink-0 shadow-2xs">
                  <Star className="w-3 h-3 fill-current text-[var(--color-primary)]" />
                  <span>{creator.match}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom SaaS Bar - Simulated In-Product Workflow State */}
      <div className="border-t border-gray-100 px-3.5 py-2.5 sm:px-5 sm:py-3 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Subtle Status Summary */}
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
          <span>
            <span className="font-bold text-gray-900 tabular-nums">
              {selectedCount} {selectedCount === 1 ? "creator" : "creators"}
            </span>{" "}
            shortlisted for campaign
          </span>
        </div>

        {/* Lightweight In-App Action Indicator / Workflow Confirmation Strip */}
        <div
          role="status"
          aria-label="Simulated in-product action indicator"
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all duration-300 select-none ${
            isReady
              ? "bg-[#FFF4F6] border border-rose-200/90 text-[var(--color-primary)] shadow-[0_2px_8px_rgba(225,29,72,0.06)]"
              : "bg-gray-50 border border-gray-200/60 text-gray-400"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            {isReady && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60 duration-1000" />
            )}
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-300 ${
                isReady ? "bg-[var(--color-primary)]" : "bg-gray-300"
              }`}
            />
          </span>

          <span className="tracking-tight">Select Creators for Campaign</span>

          <ArrowRight
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isReady
                ? "translate-x-0.5 text-[var(--color-primary)]"
                : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

