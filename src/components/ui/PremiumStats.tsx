"use client";

import React from "react";

export interface StatItem {
  value: string;
  label: string;
}

interface PremiumStatsProps {
  stats: StatItem[];
}

export default function PremiumStats({ stats }: PremiumStatsProps) {
  return (
    <section className="py-20 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-full bg-[var(--color-primary)]/10 blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-slate-800/50">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center px-4">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-slate-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
