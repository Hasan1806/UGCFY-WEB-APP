"use client";

import { motion } from "framer-motion";

interface FeedPostCardProps {
  title: string;
  type: string;
  caption: string;
  creator: string;
  stats: { views: string; applications: string };
  featured?: boolean;
}

export function FeedPostCard({ title, type, caption, creator, stats, featured }: FeedPostCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} className={`rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] ${featured ? "border-[#F59E0B]/30 bg-[rgba(245,158,11,0.08)]" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-white/70">{type}</span>
        <span className="text-xs uppercase tracking-[0.24em] text-white/50">{creator}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/65">{caption}</p>
      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/60">
        <span>{stats.views} views</span>
        <span>{stats.applications} apps</span>
      </div>
      <div className="mt-5 flex gap-3">
        <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-4 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)] hover:brightness-110">Edit</button>
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">Delete</button>
      </div>
    </motion.div>
  );
}
