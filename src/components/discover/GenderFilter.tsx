"use client";

import React from "react";
import { CreatorGender } from "@/types/creator";

interface GenderFilterProps {
  gender: "all" | CreatorGender;
  onChange: (gender: "all" | CreatorGender) => void;
}

const GENDER_OPTIONS: Array<{ label: string; value: "all" | CreatorGender; badge?: string }> = [
  { label: "Any", value: "all" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other", value: "other" },
];

export default function GenderFilter({ gender, onChange }: GenderFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-zinc-600">Gender Identity:</span>
        {gender !== "all" && (
          <button
            type="button"
            onClick={() => onChange("all")}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-4 gap-1 rounded-lg bg-zinc-100 p-1 border border-zinc-200">
        {GENDER_OPTIONS.map((opt) => {
          const isSelected = gender === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-md py-1 text-[11px] font-semibold transition cursor-pointer text-center ${
                isSelected
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
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
