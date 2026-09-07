"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/components/animations/motionVariants";
import { GlassCard } from "@/components/ui/GlassCard";

const reportCards = [
  { title: "Campaign ROI", value: "4.6x", detail: "Creative campaigns outperformed target by 28%." },
  { title: "Creator Performance", value: "92%", detail: "Top creators met goals with premium storytelling." },
  { title: "Spend Efficiency", value: "$1.8 CPM", detail: "Media spend efficiency increased across key activations." },
];

const topCreators = [
  { name: "Ava Hart", metric: "12 posts", impact: "+18%" },
  { name: "Milo Reed", metric: "9 posts", impact: "+14%" },
  { name: "Nia Sol", metric: "7 posts", impact: "+10%" },
];

export default function BrandReportsPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1540px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Brand reports</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Performance insights for your creator strategy</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Review campaign ROI, spend efficiency, and creator impact across the brand portfolio.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {reportCards.map((item) => (
              <GlassCard key={item.title} className="p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-white/50">{item.title}</p>
                <p className="mt-4 text-4xl font-semibold text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.detail}</p>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">Revenue trend</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Monthly campaign growth</h2>
              </div>
              <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
                Export report
              </button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Published campaigns", value: "14" },
                { label: "Total revenue", value: "$281K" },
                { label: "Average CPM", value: "$1.8" },
                { label: "Engagement lift", value: "+22%" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">{metric.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <aside className="space-y-6">
          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Top creators</p>
            <div className="mt-6 space-y-4">
              {topCreators.map((creator) => (
                <div key={creator.name} className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-white/70">
                  <p className="font-semibold text-white">{creator.name}</p>
                  <p className="mt-1 text-sm">{creator.metric}</p>
                  <span className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">Impact {creator.impact}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Insights snapshot</p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>Highest performing creative: short-form product demo</li>
              <li>Best ROI category: lifestyle and wellness</li>
              <li>Strongest audience: 18-34 engaged shoppers</li>
            </ul>
          </GlassCard>
        </aside>
      </div>
    </motion.div>
  );
}
