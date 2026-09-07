"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { TiltCard } from "@/components/ui/TiltCard";

type CampaignVariant = "active" | "draft" | "review" | "complete";

interface CampaignCardProps {
  title: string;
  category: string;
  status: string;
  progress: number;
  creators: number;
  deadline: string;
  id: string;
  variant?: CampaignVariant;
}

const statusStyles: Record<CampaignVariant, string> = {
  active: "border-l-4 border-red-500/90",
  draft: "border border-white/10",
  review: "border-l-4 border-yellow-400/80",
  complete: "border-l-4 border-blue-500/80",
};

export function CampaignCard({ title, category, status, progress, creators, deadline, id, variant = "active" }: CampaignCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>
      <TiltCard className={`glass-edge overflow-hidden rounded-[32px] ${statusStyles[variant]}`}>
        <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/0 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,20,60,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.18),transparent_20%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/70">
              {category}
            </span>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-white/60">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{id}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{status}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">Progress</p>
              <p className="mt-1 text-2xl font-semibold text-white">{progress}%</p>
            </div>
            <div className="text-right text-sm text-white/60">
              <p>{creators} creators</p>
              <p>Due {deadline}</p>
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-[#2563EB]" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 flex items-center justify-between gap-3 text-sm text-white/60">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono">{id}</span>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-white/80 transition hover:bg-white/10">
              View
            </button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
