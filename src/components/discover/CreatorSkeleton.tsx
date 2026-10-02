"use client";

import React from "react";
import { ViewMode } from "@/types/creator";

interface CreatorSkeletonProps {
  viewMode?: ViewMode;
  count?: number;
}

export default function CreatorSkeleton({
  viewMode = "grid",
  count = 6,
}: CreatorSkeletonProps) {
  const items = Array.from({ length: count });

  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[#E8E8E8] bg-white p-4 animate-pulse"
          >
            {/* Left Identity */}
            <div className="flex items-center gap-3.5 md:w-1/3">
              <div className="h-12 w-12 rounded-full bg-[#EFEFEF] shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-32 rounded bg-[#EFEFEF]" />
                <div className="h-2.5 w-24 rounded bg-[#F5F5F5]" />
                <div className="h-2.5 w-16 rounded bg-[#F5F5F5]" />
              </div>
            </div>

            {/* Middle Metrics */}
            <div className="grid grid-cols-4 gap-2 md:w-5/12 py-2 md:py-0 border-y md:border-y-0 md:border-x border-[#E8E8E8] px-4">
              <div className="space-y-1.5 text-center">
                <div className="h-2 w-10 mx-auto rounded bg-[#F5F5F5]" />
                <div className="h-3.5 w-12 mx-auto rounded bg-[#EFEFEF]" />
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-2 w-10 mx-auto rounded bg-[#F5F5F5]" />
                <div className="h-3.5 w-12 mx-auto rounded bg-[#EFEFEF]" />
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-2 w-10 mx-auto rounded bg-[#F5F5F5]" />
                <div className="h-3.5 w-12 mx-auto rounded bg-[#EFEFEF]" />
              </div>
              <div className="space-y-1.5 text-center">
                <div className="h-2 w-10 mx-auto rounded bg-[#F5F5F5]" />
                <div className="h-3.5 w-12 mx-auto rounded bg-[#EFEFEF]" />
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2 justify-end md:w-1/4">
              <div className="h-8.5 w-8.5 rounded-lg bg-[#EFEFEF]" />
              <div className="h-8.5 w-24 rounded-lg bg-[#EFEFEF]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-xl border border-[#E8E8E8] bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] animate-pulse"
        >
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#EFEFEF] shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-[#EFEFEF]" />
                  <div className="h-2.5 w-20 rounded bg-[#F5F5F5]" />
                  <div className="h-2 w-16 rounded bg-[#F5F5F5]" />
                </div>
              </div>
              <div className="h-8 w-8 rounded-lg bg-[#F5F5F5]" />
            </div>

            {/* Niches */}
            <div className="mt-3 flex gap-1.5">
              <div className="h-4.5 w-14 rounded-md bg-[#EFEFEF]" />
              <div className="h-4.5 w-16 rounded-md bg-[#F5F5F5]" />
            </div>

            {/* Bio */}
            <div className="mt-3 space-y-1.5">
              <div className="h-2.5 w-full rounded bg-[#F5F5F5]" />
              <div className="h-2.5 w-4/5 rounded bg-[#F5F5F5]" />
            </div>
          </div>

          {/* Metrics & Button */}
          <div className="mt-4 pt-3 border-t border-[#E8E8E8]">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#FAFAFA] p-2.5 border border-[#E8E8E8]">
              <div className="h-7 rounded bg-[#EFEFEF]" />
              <div className="h-7 rounded bg-[#EFEFEF]" />
              <div className="h-7 rounded bg-[#EFEFEF]" />
              <div className="h-7 rounded bg-[#EFEFEF]" />
            </div>

            <div className="mt-3 h-8.5 w-full rounded-lg bg-[#EFEFEF]" />
          </div>
        </div>
      ))}
    </div>
  );
}
