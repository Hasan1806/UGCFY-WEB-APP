"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const platforms = ["Instagram", "TikTok", "YouTube"];
const niches = ["Beauty", "Lifestyle", "Fitness", "Gaming", "Travel"];

export function CreatorsFilterPanel() {
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [selectedNiche, setSelectedNiche] = useState("Beauty");
  const [rating, setRating] = useState(4);

  return (
    <motion.aside initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl">
      <div className="space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">Filters</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Find the right creators</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">Platform</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => setSelectedPlatform(platform)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${selectedPlatform === platform ? "bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">Niche</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {niches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedNiche(tag)}
                  className={`rounded-full px-4 py-3 text-sm font-semibold transition ${selectedNiche === tag ? "bg-[rgba(220,20,60,0.16)] text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span className="uppercase tracking-[0.24em]">Rating</span>
              <span>{rating}+</span>
            </div>
            <input
              type="range"
              min={3}
              max={5}
              step={0.5}
              value={rating}
              onChange={(event) => setRating(Number(event.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#DC143C]"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">Apply</button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/70 hover:bg-white/10">Clear</button>
        </div>
      </div>
    </motion.aside>
  );
}
