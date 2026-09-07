"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

interface POCCardProps {
  title: string;
  id: string;
  status: "active" | "pending" | "rejected";
  assignedCampaigns: number;
  accessLevel: string;
  reason?: string;
}

const statusStyles: Record<POCCardProps["status"], string> = {
  active: "border border-[#22C55E]/20 bg-[rgba(34,197,94,0.08)]",
  pending: "border border-[rgba(234,179,8,0.30)] bg-[rgba(234,179,8,0.04)]",
  rejected: "border border-[rgba(220,20,60,0.30)] bg-[rgba(220,20,60,0.06)]",
};

export function POCCard({ title, id, status, assignedCampaigns, accessLevel, reason }: POCCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
      <GlassCard className={`overflow-hidden rounded-[32px] p-6 ${statusStyles[status]}`} hover>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">{status === "active" ? "Active POC" : status === "pending" ? "Pending Approval" : "Rejected"}</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{id} · {accessLevel}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80">{assignedCampaigns} campaigns</div>
        </div>
        {status === "active" ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
            <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#22C55E]" />
            Live now
          </div>
        ) : null}
        {status === "pending" ? (
          <div className="mt-6 space-y-2 rounded-3xl border border-[rgba(234,179,8,0.18)] bg-[rgba(234,179,8,0.08)] p-4 text-sm text-white/80">
            <p className="font-semibold">Awaiting admin approval</p>
            <p>Submission under review. You’ll be notified once it’s approved.</p>
          </div>
        ) : null}
        {status === "rejected" ? (
          <div className="mt-6 space-y-2 rounded-3xl border border-[rgba(220,20,60,0.18)] bg-[rgba(220,20,60,0.08)] p-4 text-sm text-white/80">
            <p className="font-semibold">Rejected</p>
            <p>{reason ?? "Reason not provided."}</p>
          </div>
        ) : null}
      </GlassCard>
    </motion.div>
  );
}
