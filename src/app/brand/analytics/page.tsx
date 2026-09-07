"use client";

import { motion } from "framer-motion";
import { pageVariants, staggerContainer, staggerItem } from "@/components/animations/motionVariants";

const stats = [
  { label: "Campaigns", value: "18", trend: "+12%", color: "#DC143C" },
  { label: "Creators", value: "284", trend: "+8%", color: "#2563EB" },
  { label: "Deliverables", value: "142", trend: "+6%", color: "#22C55E" },
  { label: "Revenue", value: "$278K", trend: "+18%", color: "#F59E0B" },
];

const sparklinePoints = [56, 76, 68, 85, 78, 92, 88, 95, 90, 102];
const barData = [72, 84, 68, 96, 80, 90, 76];

export default function BrandAnalyticsPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-8 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Analytics</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Performance intelligence</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Capture campaign insights, creator engagement, and financial momentum with a premium analytics workspace.</p>
      </header>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <motion.div key={item.label} variants={staggerItem}>
            <div className="glass-edge rounded-[32px] p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm uppercase tracking-[0.26em] text-white/50">{item.label}</p>
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
              <p className="mt-6 text-4xl font-[var(--font-display)] font-semibold text-white">{item.value}</p>
              <p className="mt-3 text-sm text-white/60">Trend {item.trend} this month</p>
              <div className="mt-5 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-[#2563EB]" style={{ width: item.trend.includes("+") ? "72%" : "48%" }} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="glass-edge rounded-[32px] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Campaigns over time</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Monthly campaign growth</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C]" />
              Red series
            </div>
          </div>
          <div className="mt-6 rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6">
            <div className="relative h-64 overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0A0A24] to-[#03030D] p-4">
              <svg viewBox="0 0 400 250" className="h-full w-full">
                <defs>
                  <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="#DC143C" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <path
                  d={sparklinePoints.map((value, index) => `${index === 0 ? "M" : "L"}${40 + index * 34} ${220 - value * 1.8}`).join(" ")}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-white/60">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </section>

        <section className="glass-edge rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Status breakdown</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Campaign distribution</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">Live</div>
          </div>
          <div className="mt-6 grid gap-4">
            {[
              { label: "Active", value: 42, color: "#DC143C" },
              { label: "Review", value: 26, color: "#F59E0B" },
              { label: "Complete", value: 18, color: "#2563EB" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="glass-edge rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Applications per campaign</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Creator interest</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">Recent</span>
          </div>
          <div className="mt-6 space-y-4">
            {barData.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>Campaign {index + 1}</span>
                  <span>{value}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-[#2563EB]" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-edge rounded-[32px] p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Niche distribution</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Audience segments</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Lifestyle", value: "34%", color: "#DC143C" },
              { label: "Fitness", value: "24%", color: "#2563EB" },
              { label: "Beauty", value: "18%", color: "#22C55E" },
              { label: "Travel", value: "14%", color: "#F59E0B" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/80">
                <div className="flex items-center justify-between gap-3">
                  <span>{item.label}</span>
                  <span className="text-sm font-semibold text-white">{item.value}</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: item.value, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
