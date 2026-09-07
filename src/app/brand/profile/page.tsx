"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/components/animations/motionVariants";
import { GlassCard } from "@/components/ui/GlassCard";

const stats = [
  { label: "Campaigns", value: "18" },
  { label: "Creators", value: "92" },
  { label: "Engagement", value: "+23%" },
  { label: "Brand mentions", value: "14.2K" },
];

const socials = [
  { label: "Instagram", handle: "@ugc_fy" },
  { label: "TikTok", handle: "@ugc_fy" },
  { label: "LinkedIn", handle: "UGCFY" },
];

const team = [
  { name: "Leila Matthews", role: "Marketing Director" },
  { name: "Ethan Cole", role: "Campaign Manager" },
  { name: "Mira Chen", role: "Community Lead" },
];

export default function BrandProfilePage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1540px] space-y-6 pb-10">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Brand profile</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">UGCFY creative identity</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Update your brand story, audience details, social links, and creative guidelines in one dedicated profile area.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <section className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#DC143C] to-[#2563EB] text-3xl font-bold text-white">UG</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-white/50">Verified brand</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">UGCFY Creative</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">A premium creator marketing platform helping brands tell authentic stories through creator-led campaigns.</p>
                </div>
              </div>
              <button className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">Edit profile</button>
            </div>
          </GlassCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">Brand details</p>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Website</p>
                  <p className="mt-2">https://www.ugc-fy.com</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Category</p>
                  <p className="mt-2">Creator marketing / Brand collaborations</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Audience</p>
                  <p className="mt-2">Lifestyle, beauty, wellness, and direct-to-consumer shoppers.</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">Brand voice</p>
              <div className="mt-6 space-y-4 text-sm leading-6 text-white/70">
                <p>Confident yet approachable. Emphasize authenticity, community, and performance-driven creativity.</p>
                <p>Use first-person plural for brand messaging and prioritize emotional storytelling over feature-led copy.</p>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Story highlights</p>
            <div className="mt-6 space-y-4 text-sm leading-6 text-white/70">
              <p>UGCFY brings premium brands together with creators who build trust through authentic, camera-ready content.</p>
              <p>Our campaigns are designed to move audiences from discovery to purchase with measurable creator-driven moments.</p>
            </div>
          </GlassCard>
        </section>

        <aside className="space-y-6">
          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Key profile stats</p>
            <div className="mt-6 grid gap-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Social channels</p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              {socials.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-3">
                  <span>{item.label}</span>
                  <span className="text-sm text-white">{item.handle}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-white/50">Core team</p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              {team.map((member) => (
                <div key={member.name} className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="mt-1 text-xs text-white/60">{member.role}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </aside>
      </div>
    </motion.div>
  );
}
