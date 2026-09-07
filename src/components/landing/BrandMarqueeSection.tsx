"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface BrandItem {
  id: string;
  name: string;
  glowColor: string;
  gradient: string;
  customElement?: React.ReactNode;
}

// Unified, balanced font size and styling class for all brand names
const UNIFIED_FONT_SIZE =
  "text-lg sm:text-xl md:text-2xl font-black tracking-wider uppercase whitespace-nowrap leading-none";

const marqueeBrandsRow1: BrandItem[] = [
  {
    id: "oziva",
    name: "OZIVA",
    glowColor: "rgba(16, 185, 129, 0.4)",
    gradient: "from-emerald-600 via-teal-500 to-green-600",
  },
  {
    id: "frido",
    name: "FRIDO",
    glowColor: "rgba(14, 165, 233, 0.4)",
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
  },
  {
    id: "juicy-chemistry",
    name: "JUICY CHEMISTRY",
    glowColor: "rgba(245, 158, 11, 0.4)",
    gradient: "from-amber-600 via-orange-500 to-yellow-600",
  },
  {
    id: "travalate",
    name: "TRAVALATE",
    glowColor: "rgba(99, 102, 241, 0.4)",
    gradient: "from-indigo-600 via-blue-600 to-indigo-700",
  },
  {
    id: "sleepycat",
    name: "SLEEPYCAT",
    glowColor: "rgba(139, 92, 246, 0.4)",
    gradient: "from-violet-600 via-purple-600 to-pink-500",
  },
  {
    id: "icon",
    name: "I C O N",
    glowColor: "rgba(100, 116, 139, 0.4)",
    gradient: "from-slate-500 via-zinc-400 to-slate-600",
  },
  {
    id: "sonic-lamb",
    name: "SONIC LAMB",
    glowColor: "rgba(225, 29, 72, 0.4)",
    gradient: "from-rose-600 via-red-500 to-orange-500",
  },
  {
    id: "welme",
    name: "WELME",
    glowColor: "rgba(236, 72, 153, 0.4)",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
  },
  {
    id: "brown-living",
    name: "BROWN LIVING",
    glowColor: "rgba(13, 148, 136, 0.4)",
    gradient: "from-teal-700 via-emerald-600 to-teal-800",
  },
  {
    id: "hammer",
    name: "HAMMER",
    glowColor: "rgba(37, 99, 235, 0.4)",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
  },
  {
    id: "homestrap",
    name: "HOMESTRAP",
    glowColor: "rgba(234, 88, 12, 0.4)",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
  },
  {
    id: "sukham",
    name: "SUKHAM",
    glowColor: "rgba(217, 119, 6, 0.4)",
    gradient: "from-amber-600 via-yellow-600 to-orange-600",
  },
  {
    id: "plum-stories",
    name: "PLUM STORIES",
    glowColor: "rgba(147, 51, 234, 0.4)",
    gradient: "from-purple-600 via-pink-600 to-purple-700",
  },
];

const marqueeBrandsRow2: BrandItem[] = [
  {
    id: "tabbsz",
    name: "TABBSZ",
    glowColor: "rgba(192, 38, 211, 0.4)",
    gradient: "from-fuchsia-600 via-purple-600 to-pink-600",
  },
  {
    id: "big-indian-story",
    name: "A BIG INDIAN STORY",
    glowColor: "rgba(5, 150, 105, 0.4)",
    gradient: "from-emerald-700 via-teal-600 to-green-700",
  },
  {
    id: "seekho",
    name: "SEEKHO",
    glowColor: "rgba(37, 99, 235, 0.4)",
    gradient: "from-blue-600 via-indigo-500 to-sky-600",
  },
  {
    id: "master",
    name: "MASTER AI",
    glowColor: "rgba(100, 116, 139, 0.4)",
    gradient: "from-slate-500 via-zinc-400 to-slate-600",
  },
  {
    id: "beardo",
    name: "BEARDO",
    glowColor: "rgba(217, 119, 6, 0.4)",
    gradient: "from-amber-600 via-orange-600 to-amber-700",
  },
  {
    id: "samco",
    name: "SAMCO",
    glowColor: "rgba(29, 78, 216, 0.4)",
    gradient: "from-blue-700 via-indigo-600 to-blue-800",
  },
  {
    id: "skin-wise",
    name: "SKIN WISE",
    glowColor: "rgba(8, 145, 178, 0.4)",
    gradient: "from-cyan-600 via-teal-500 to-sky-600",
  },
  {
    id: "just-dial",
    name: "JUSTDIAL",
    glowColor: "rgba(249, 115, 22, 0.4)",
    gradient: "",
    customElement: (
      <span className={UNIFIED_FONT_SIZE}>
        <span className="text-blue-900">JUST</span>
        <span className="text-orange-500">DIAL</span>
      </span>
    ),
  },
  {
    id: "pan-india",
    name: "PAN INDIA VENTURES",
    glowColor: "rgba(109, 40, 217, 0.4)",
    gradient: "from-purple-700 via-indigo-700 to-purple-800",
  },
  {
    id: "cannis-lupus",
    name: "CANNIS LUPUS",
    glowColor: "rgba(202, 138, 4, 0.4)",
    gradient: "from-yellow-600 via-amber-600 to-yellow-700",
  },
  {
    id: "ins-comm",
    name: "INS COMMUNICATION",
    glowColor: "rgba(225, 29, 72, 0.4)",
    gradient: "from-rose-600 via-red-600 to-rose-700",
  },
  {
    id: "my-money-matters",
    name: "MY MONEY MATTERS",
    glowColor: "rgba(21, 128, 61, 0.4)",
    gradient: "from-emerald-600 via-green-600 to-teal-600",
  },
];

function BrandItemView({ brand }: { brand: BrandItem }) {
  return (
    <div
      className="group relative flex items-center justify-center px-6 sm:px-8 md:px-9 py-2 transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer select-none shrink-0"
      style={
        {
          "--glow-color": brand.glowColor,
        } as React.CSSProperties
      }
    >
      {/* Dynamic Ambient Hover Glow behind wordmark */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: brand.glowColor,
        }}
      />

      {/* Unified Font Size Brand Name */}
      <div className="relative z-10 opacity-90 group-hover:opacity-100 transition-all duration-300 filter group-hover:brightness-110 whitespace-nowrap">
        {brand.customElement || (
          <span
            className={`${UNIFIED_FONT_SIZE} bg-gradient-to-r ${brand.gradient} bg-clip-text text-transparent`}
          >
            {brand.name}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BrandMarqueeSection() {
  return (
    <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-[#FCF8F8] via-[#FAF6F6] to-[#FFFDFD] border-b border-rose-100/40 overflow-hidden relative select-none">
      {/* Ambient background accent glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-purple-400/5 blur-3xl pointer-events-none" />

      {/* Minimal Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 mb-7 sm:mb-9">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-rose-100 shadow-[0_2px_8px_rgba(225,29,72,0.05)] text-[10px] sm:text-[11px] font-bold tracking-widest text-[var(--color-primary)] uppercase mb-3">
          <Sparkles
            className="w-3.5 h-3.5 text-amber-500 animate-spin"
            style={{ animationDuration: "8s" }}
          />
          <span>POWERING 500+ FAST-GROWING BRANDS</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
          Trusted by brands you already know.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium max-w-xl mx-auto">
          From breakout D2C innovators to household market leaders.
        </p>
      </div>

      {/* Marquee Viewport with Crisp 3% Edge Fade */}
      <div
        className="relative w-full overflow-hidden flex flex-col gap-4 sm:gap-6 z-10 py-1"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
      >
        {/* Row 1: Right -> Left */}
        <div className="flex overflow-hidden w-full">
          <div
            className="flex w-max items-center animate-marquee hover:[animation-play-state:paused] brand-marquee-track py-1"
            style={{ animationDuration: "36s" }}
          >
            {marqueeBrandsRow1.map((brand, idx) => (
              <BrandItemView key={`r1-a-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow1.map((brand, idx) => (
              <BrandItemView key={`r1-b-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow1.map((brand, idx) => (
              <BrandItemView key={`r1-c-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow1.map((brand, idx) => (
              <BrandItemView key={`r1-d-${idx}`} brand={brand} />
            ))}
          </div>
        </div>

        {/* Row 2: Left -> Right (Reverse) */}
        <div className="flex overflow-hidden w-full">
          <div
            className="flex w-max items-center animate-marquee hover:[animation-play-state:paused] brand-marquee-track py-1"
            style={{ animationDuration: "44s", animationDirection: "reverse" }}
          >
            {marqueeBrandsRow2.map((brand, idx) => (
              <BrandItemView key={`r2-a-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow2.map((brand, idx) => (
              <BrandItemView key={`r2-b-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow2.map((brand, idx) => (
              <BrandItemView key={`r2-c-${idx}`} brand={brand} />
            ))}
            {marqueeBrandsRow2.map((brand, idx) => (
              <BrandItemView key={`r2-d-${idx}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
