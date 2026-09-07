"use client";

import { motion } from "framer-motion";
import { CreatorCard } from "@/components/brand/CreatorCard";
import { CreatorsFilterPanel } from "@/components/brand/CreatorsFilterPanel";
import { pageVariants } from "@/components/animations/motionVariants";

const creators = [
  {
    name: "Ava Hart",
    handle: "ava.hart",
    niche: ["Lifestyle", "Travel"],
    rating: 4.9,
    campaigns: 18,
    available: true,
    verified: true,
    followers: [
      { platform: "IG", count: "120K" },
      { platform: "TT", count: "95K" },
      { platform: "YT", count: "48K" },
    ],
    id: "CR-001",
  },
  {
    name: "Milo Reed",
    handle: "milo.reed",
    niche: ["Fitness", "Wellness"],
    rating: 4.7,
    campaigns: 12,
    available: false,
    verified: true,
    followers: [
      { platform: "IG", count: "86K" },
      { platform: "TT", count: "110K" },
    ],
    id: "CR-002",
  },
  {
    name: "Nia Sol",
    handle: "nia.sol",
    niche: ["Beauty", "Fashion"],
    rating: 4.8,
    campaigns: 21,
    available: true,
    verified: false,
    followers: [
      { platform: "IG", count: "152K" },
      { platform: "YT", count: "60K" },
    ],
    id: "CR-003",
  },
  {
    name: "Jaxon Lee",
    handle: "jaxon.lee",
    niche: ["Gaming", "Tech"],
    rating: 4.6,
    campaigns: 14,
    available: true,
    verified: true,
    followers: [
      { platform: "TT", count: "72K" },
      { platform: "YT", count: "130K" },
    ],
    id: "CR-004",
  },
  {
    name: "Sofia Lane",
    handle: "sofia.lane",
    niche: ["Food", "Lifestyle"],
    rating: 4.8,
    campaigns: 20,
    available: false,
    verified: true,
    followers: [
      { platform: "IG", count: "140K" },
      { platform: "TT", count: "90K" },
    ],
    id: "CR-005",
  },
];

export default function BrandCreatorsPage() {
  return (
    <motion.div initial="initial" animate="animate" variants={pageVariants} className="mx-auto max-w-[1640px] space-y-6">
      <header className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-8 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.28em] text-white/50">Creator discovery</p>
        <h1 className="mt-3 text-4xl font-[var(--font-display)] font-semibold text-white">Discover creators built for your brand.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">Filter by niche, platform, and rating to shortlist creator talent with premium content styles and proven reach.</p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <CreatorsFilterPanel />

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} {...creator} />
            ))}
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 text-white/60">
            <p className="text-sm uppercase tracking-[0.28em] text-white/50">Creator selection</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-[rgba(220,20,60,0.12)] px-4 py-3 text-sm text-white">Shortlisted: 7</span>
              <span className="rounded-full border border-white/10 bg-[rgba(37,99,235,0.12)] px-4 py-3 text-sm text-white">Pending invites: 3</span>
              <span className="rounded-full border border-white/10 bg-[rgba(34,197,94,0.12)] px-4 py-3 text-sm text-white">Available now: 3</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
