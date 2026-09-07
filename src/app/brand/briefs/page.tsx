"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { pageVariants } from "@/components/animations/motionVariants";

const briefs = [
  { title: "Holiday Launch Brief", status: "Live", due: "Dec 14", creators: 16 },
  { title: "Wellness Ambassador Story", status: "Review", due: "Dec 20", creators: 12 },
  { title: "Product Demo Series", status: "Draft", due: "Jan 3", creators: 8 },
];

export default function BrandBriefsPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1540px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Creator briefs</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Build briefs that attract the right creators</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Define goals, deliverables, and creative direction for each campaign to keep creator collaboration on track.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">Create new brief</button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 hover:bg-white/10">Import brief template</button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">Active briefs</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">All briefs in one place</h2>
              </div>
              <span className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">3 open briefs</span>
            </div>
            <div className="mt-6 space-y-4">
              {briefs.map((brief) => (
                <GlassCard key={brief.title} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{brief.title}</p>
                      <p className="mt-2 text-sm text-white/60">{brief.creators} creators invited · due {brief.due}</p>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${brief.status === "Live" ? "bg-[#22C55E]/20 text-[#22C55E]" : brief.status === "Review" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-white/10 text-white/70"}`}>
                      {brief.status}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Brief workflow</p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <p>1. Create brief outline with objectives, deliverables and style guidance.</p>
                <p>2. Invite selected creators and share campaign expectations.</p>
                <p>3. Review submitted concepts and provide feedback in one place.</p>
              </div>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-white/50">Template library</p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <p>Save repeatable briefs for product launches, seasonal activations, and long-term partnerships.</p>
                <button className="mt-4 rounded-2xl bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">Browse templates</button>
              </div>
            </GlassCard>
          </div>
        </section>

        <aside className="space-y-6">
          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Creator profile focus</p>
            <p className="mt-4 text-sm leading-6 text-white/70">Add audience demographics, preferred format, and campaign incentives to make your briefs more compelling.</p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Audience</p>
                <p className="mt-2">18-34 lifestyle shoppers with high engagement.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Tone</p>
                <p className="mt-2">Bold, authentic, and relatable.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-white">Deliverables</p>
                <p className="mt-2">Short-form video, hero stills, and testimonial copy.</p>
              </div>
            </div>
          </GlassCard>
        </aside>
      </div>
    </motion.div>
  );
}
