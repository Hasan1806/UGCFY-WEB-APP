"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const views = [
  { label: "Grid", id: "grid" },
  { label: "Table", id: "table" },
  { label: "Kanban", id: "kanban" },
];

export function CampaignsFilterBar() {
  const [view, setView] = useState("grid");

  return (
    <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.28em] text-white/50">Campaign management</p>
          <h2 className="text-2xl font-semibold text-white">Filter, sort, and view campaigns</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {views.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => setView(item.id)}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${view === item.id ? "bg-gradient-to-br from-[#DC143C] to-[#9B1239] text-white shadow-[0_12px_30px_rgba(220,20,60,0.18)]" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <label className="block text-sm uppercase tracking-[0.24em] text-white/50">Search campaigns</label>
          <input
            type="search"
            placeholder="Search by name, ID, or creator"
            className="h-14 w-full rounded-[18px] border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-[#DC143C] focus:ring-2 focus:ring-[#DC143C]/15"
          />
        </div>
        <div className="grid gap-3">
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Status</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Active', 'Draft', 'Review', 'Complete'].map((status) => (
                <button key={status} type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">{status}</button>
              ))}
            </div>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Category</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['UGC', 'Reviews', 'Launch', 'Awareness'].map((category) => (
                <button key={category} type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">{category}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.26em] text-white/60">
        <span>Active filters:</span>
        <button className="rounded-full border border-white/10 bg-[rgba(220,20,60,0.12)] px-3 py-2 text-white">Brand Launch <span className="ml-2">×</span></button>
        <button className="rounded-full border border-white/10 bg-[rgba(37,99,235,0.12)] px-3 py-2 text-white">Active <span className="ml-2">×</span></button>
        <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/70 hover:bg-white/10">Reset</button>
      </div>
    </div>
  );
}
