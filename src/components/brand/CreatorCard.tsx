"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { LiveDot } from "@/components/ui/LiveDot";

interface CreatorCardProps {
  name: string;
  handle: string;
  niche: string[];
  rating: number;
  campaigns: number;
  available: boolean;
  followers: { platform: string; count: string }[];
  verified: boolean;
  id: string;
}

export function CreatorCard({ name, handle, niche, rating, campaigns, available, followers, verified }: CreatorCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 240, damping: 24 }}>
      <TiltCard className="glass-edge overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-xl font-bold text-white">{name.split(" ").map((part) => part[0]).join("")}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold text-white">{name}</h3>
              {verified ? <span className="rounded-full bg-[rgba(37,99,235,0.16)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">✓ Verified</span> : null}
            </div>
            <p className="text-sm text-white/60">@{handle}</p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
            <LiveDot color={available ? "#22C55E" : "#EAB308"} />
            {available ? "Available" : "Busy"}
          </span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Rating</p>
            <p className="mt-2 text-2xl font-semibold text-white">{rating.toFixed(1)}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Campaigns</p>
            <p className="mt-2 text-2xl font-semibold text-white">{campaigns}</p>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            {niche.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid gap-3">
            {followers.map((item) => (
              <div key={item.platform} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                <span>{item.platform}</span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.2)] transition hover:brightness-110">
            View Portfolio
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10">
            + Shortlist
          </button>
        </div>
      </TiltCard>
    </motion.div>
  );
}
