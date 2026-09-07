"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LiveDot } from "@/components/ui/LiveDot";
import { pageVariants } from "@/components/animations/motionVariants";

const profile = {
  name: "Ava Hart",
  handle: "ava.hart",
  tagline: "Premium lifestyle creator with cinematic UGC for modern brands.",
  location: "Los Angeles, CA",
  followers: [
    { label: "Instagram", value: "120K" },
    { label: "TikTok", value: "95K" },
    { label: "YouTube", value: "48K" },
  ],
  rating: 4.9,
  reviews: 184,
  niches: ["Lifestyle", "Travel", "Wellness"],
  description:
    "Ava crafts high-performing creator content for lifestyle and travel brands, blending premium visuals with authentic storytelling.",
};

const portfolioItems = [
  { title: "Resort Launch Reel", type: "Video", platform: "IG", views: "420K" },
  { title: "Wellness Kit UGC", type: "Photo", platform: "TT", views: "310K" },
  { title: "Weekend Wardrobe Drop", type: "Carousel", platform: "IG", views: "210K" },
  { title: "Morning Routine Edit", type: "Video", platform: "YT", views: "85K" },
];

const history = [
  { campaign: "Holiday UGC Push", status: "Active", date: "Dec 14" },
  { campaign: "Launch Night Look", status: "Complete", date: "Nov 26" },
  { campaign: "Wellness Week", status: "Complete", date: "Oct 19" },
];

export default function CreatorPortfolioPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-8 pb-10">
      <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-6">
            <div className="rounded-[28px] bg-gradient-to-r from-[#DC143C]/15 via-transparent to-[#2563EB]/15 p-5">
              <div className="flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.28em] text-white/60">
                <span>Creator portfolio</span>
                <span className="rounded-full bg-white/5 px-3 py-2 text-white/70">Profile ID: CR-001</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-[#DC143C] to-[#2563EB] text-4xl font-bold text-white">AH</div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-5xl font-[var(--font-display)] font-semibold tracking-[-0.04em] text-white">{profile.name}</h1>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/70">
                      <LiveDot color="#22C55E" /> Available
                    </span>
                  </div>
                  <p className="text-sm text-white/60">@{profile.handle}</p>
                </div>
              </div>
              <p className="max-w-3xl text-base leading-7 text-white/70">{profile.tagline}</p>
              <div className="flex flex-wrap gap-3 text-sm text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{profile.location}</span>
                {profile.niches.map((niche) => (
                  <span key={niche} className="rounded-full border border-white/10 bg-white/5 px-4 py-2">{niche}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-white/50">Rating</p>
              <p className="mt-3 text-4xl font-semibold text-white">{profile.rating}</p>
              <p className="text-sm text-white/60">{profile.reviews} reviews</p>
            </div>
            <div className="space-y-3">
              {profile.followers.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <span>{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">
              Shortlist for Campaign
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">Portfolio gallery</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent creator work</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <span>Playbook</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {portfolioItems.map((item) => (
                <div key={item.title} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-5 transition hover:-translate-y-1 hover:bg-white/10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,20,60,0.18),transparent_25%)] opacity-40" />
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-white/50">
                      <span>{item.type}</span>
                      <span>{item.platform}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/50">Campaign history</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Recent work</h2>
              </div>
            </div>
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.campaign} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white/80">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.campaign}</p>
                      <p className="text-sm text-white/60">{item.date}</p>
                    </div>
                    <span className="rounded-full bg-[rgba(37,99,235,0.16)] px-3 py-2 text-xs uppercase tracking-[0.24em] text-[#3B82F6]">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">About</p>
            <p className="mt-4 text-sm leading-6 text-white/70">{profile.description}</p>
            <div className="mt-6 space-y-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Response time</p>
                <p className="mt-2 text-base text-white">1-2 hours</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Top niches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.niches.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/70">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Actions</p>
            <div className="mt-5 space-y-3">
              <button className="w-full rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-button)]">Shortlist for campaign</button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">Send invite</button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:bg-white/10">View full profile</button>
            </div>
          </section>
        </aside>
      </div>
    </motion.div>
  );
}
