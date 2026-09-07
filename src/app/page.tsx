"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RippleButton } from "@/components/ui/RippleButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiveDot } from "@/components/ui/LiveDot";

const stats = [
  { value: "10,000+", label: "Verified Creators", change: "+24% this month" },
  { value: "500+", label: "Brand Partners", change: "Fortune 500 & DTC" },
  { value: "50,000+", label: "Videos Delivered", change: "3.4x avg ROAS" },
  { value: "< 48 hrs", label: "Avg Turnaround", change: "Fast-track delivery" },
];

const featuredCreators = [
  {
    name: "Elena Rostova",
    handle: "@elenarostova",
    niche: "Beauty & Skincare",
    avatar: "💄",
    followers: "240K",
    rating: "4.98",
    completed: "142",
    roas: "4.2x",
    tags: ["TikTok", "Reels", "Unboxing"],
  },
  {
    name: "Marcus Vance",
    handle: "@marcustech",
    niche: "Tech & Gadgets",
    avatar: "📱",
    followers: "510K",
    rating: "5.0",
    completed: "210",
    roas: "3.8x",
    tags: ["DTC Tech", "SaaS", "Explainer"],
  },
  {
    name: "Aria Thorne",
    handle: "@ariathorne",
    niche: "Fitness & Wellness",
    avatar: "⚡",
    followers: "320K",
    rating: "4.95",
    completed: "185",
    roas: "4.5x",
    tags: ["Gymwear", "Supplements", "POV"],
  },
  {
    name: "Liam Chen",
    handle: "@liamcreative",
    niche: "Fashion & Lifestyle",
    avatar: "🕶️",
    followers: "180K",
    rating: "4.92",
    completed: "98",
    roas: "3.9x",
    tags: ["Apparel", "Streetwear", "Try-on"],
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Campaign Brief",
    desc: "Set your target demographic, hook requirements, product specifications, and deliverable format in under 3 minutes.",
    badge: "AI Brief Builder",
  },
  {
    num: "02",
    title: "Auto-Match Top 1% Creators",
    desc: "Our algorithm matches your brief with verified creators who convert in your specific vertical and price tier.",
    badge: "Smart Matching",
  },
  {
    num: "03",
    title: "1-Click Approvals & Revisions",
    desc: "Stream and review high-definition video drafts with timestamped annotations, instant revisions, and rights clearance.",
    badge: "Live Review Studio",
  },
  {
    num: "04",
    title: "Deploy Ads & Track Live ROI",
    desc: "Directly download organic and paid ad formats ready for TikTok Ads, Meta Ads Manager, and YouTube Shorts.",
    badge: "Omnichannel Ready",
  },
];

const features = [
  {
    icon: "🛡️",
    title: "Full Commercial Rights & Whitelisting",
    desc: "Perpetual commercial usage, digital ad whitelisting, and creator-sparking included in every collaboration.",
  },
  {
    icon: "⚡",
    title: "Turnaround in Under 48 Hours",
    desc: "Accelerate your ad creative cycles from weeks to days with milestone-backed deliverable timelines.",
  },
  {
    icon: "📊",
    title: "Performance Analytics & ROAS Attribution",
    desc: "Track authentic creative metrics, click-through rates, and conversion potential directly in your dashboard.",
  },
  {
    icon: "💬",
    title: "Integrated Creator Chat & Briefing",
    desc: "Direct messaging, sample tracking, and automated milestone payouts without messy email threads.",
  },
  {
    icon: "🎯",
    title: "Niche Audience Targeting",
    desc: "Filter by creator location, age demographic, platform focus, aesthetic style, and past campaign performance.",
  },
  {
    icon: "💳",
    title: "Automated Escrow & Protected Payouts",
    desc: "Funds are securely held until you review and approve the final deliverables. 100% satisfaction guaranteed.",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"brands" | "creators">("brands");

  return (
    <div className="min-h-screen bg-[#03030D] text-white selection:bg-red-600/30 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-red-600/20 via-blue-600/15 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-red-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-[65%] right-[-10%] w-[650px] h-[650px] bg-blue-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-[#03030D]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform duration-200">
              U
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center">
                UGC<span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">FY</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase -mt-1">
                Brand Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link href="/brand/creators" className="hover:text-white transition-colors">
              Creators
            </Link>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <Link href="/brand/campaigns" className="hover:text-white transition-colors">
              Campaigns
            </Link>
            <Link href="/brand/analytics" className="hover:text-white transition-colors">
              Analytics
            </Link>
          </nav>

          {/* Nav Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link href="/brand/dashboard">
              <RippleButton className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 border border-red-500/30">
                Launch Campaign &rarr;
              </RippleButton>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION (First Screen) */}
      <section className="relative z-10 pt-12 pb-24 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/40 backdrop-blur-md shadow-sm"
          >
            <LiveDot color="#DC143C" />
            <span className="text-xs font-semibold text-red-200 tracking-wide uppercase">
              The #1 UGC Creator Marketplace for Ambitious Brands
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Scale Your Brand With{" "}
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-blue-500 bg-clip-text text-transparent">
              High-Converting
            </span>{" "}
            UGC Creators
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal"
          >
            Match with vetted top 1% content creators, automate brief workflows, approve video deliverables in 48 hours, and scale winning paid social ads.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <Link href="/brand/dashboard" className="w-full sm:w-auto">
              <RippleButton className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-red-600/30 border border-red-500/40 transition-all">
                Start Your Campaign Free &rarr;
              </RippleButton>
            </Link>
            <Link href="/brand/creators" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/25 text-white font-semibold text-base transition duration-200 backdrop-blur-md flex items-center justify-center gap-2">
                <span>⚡ Explore 10,000+ Creators</span>
              </button>
            </Link>
          </motion.div>

          {/* Social Proof Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-10"
          >
            {stats.map((stat, i) => (
              <GlassCard key={i} className="p-5 flex flex-col items-center text-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-slate-300 mt-1">{stat.label}</span>
                <span className="text-[11px] font-medium text-red-400 mt-0.5">{stat.change}</span>
              </GlassCard>
            ))}
          </motion.div>
        </div>

        {/* Hero Interactive Dashboard Visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 relative mx-auto max-w-6xl rounded-2xl p-2 sm:p-4 bg-gradient-to-b from-white/10 to-white/0 border border-white/10 shadow-2xl backdrop-blur-2xl"
        >
          <div className="rounded-xl overflow-hidden bg-[#06061A] border border-white/[0.08] p-6 sm:p-8">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500/80" />
                <span className="size-3 rounded-full bg-yellow-500/80" />
                <span className="size-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">app.ugcfy.com/brand/dashboard</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1.5">
                  <LiveDot color="#22C55E" /> Live Campaign Active
                </span>
              </div>
            </div>

            {/* Dashboard Quick Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {/* Card 1: Active Deliverables */}
              <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Deliverable</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">Video 9:16</span>
                </div>
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-tr from-slate-900 via-slate-800 to-red-950/40 border border-white/[0.08] flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                  <div className="size-12 rounded-full bg-red-600/80 text-white flex items-center justify-center text-xl shadow-lg shadow-red-600/40 group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                  <span className="text-xs font-semibold text-white mt-3">Unboxing & Hook Reaction.mp4</span>
                  <span className="text-[10px] text-slate-400">Elena Rostova • 1080x1920 60fps</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-green-400 font-semibold">Ready for 1-Click Approval</span>
                </div>
              </div>

              {/* Card 2: Creator Matching */}
              <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Matched Creators</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold">98% Match</span>
                </div>
                <div className="space-y-3">
                  {featuredCreators.slice(0, 3).map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-white/10 flex items-center justify-center text-base">
                          {c.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.niche}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-green-400">{c.roas} ROAS</p>
                        <p className="text-[10px] text-slate-400">{c.completed} completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Performance Metrics */}
              <div className="rounded-xl p-5 bg-white/[0.03] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ad Performance ROI</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-green-500/20 text-green-300 font-semibold">Meta & TikTok</span>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                    <p className="text-[11px] font-semibold text-slate-400">Average ROAS</p>
                    <p className="text-2xl font-extrabold text-white mt-0.5">3.82x</p>
                    <p className="text-[10px] text-green-400 font-medium mt-1">↑ +42% vs static banner ads</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20">
                    <p className="text-[11px] font-semibold text-slate-400">Cost Per Click (CPC)</p>
                    <p className="text-2xl font-extrabold text-white mt-0.5">$0.18</p>
                    <p className="text-[10px] text-green-400 font-medium mt-1">↓ -65% customer acquisition cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED CREATORS SECTION */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Creator Roster</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Vetted Top 1% UGC Talent
          </h2>
          <p className="text-base text-slate-400">
            Every creator in our network is hand-screened for on-camera charisma, high-fidelity lighting, studio audio, and proven conversion history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCreators.map((creator, i) => (
            <GlassCard key={i} className="p-6 flex flex-col justify-between group hover:border-red-500/40 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="size-14 rounded-2xl bg-gradient-to-br from-red-600/30 to-blue-600/30 border border-white/10 flex items-center justify-center text-3xl">
                    {creator.avatar}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
                    ⭐ {creator.rating}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-xs text-slate-400">{creator.handle}</p>
                  <p className="text-xs font-medium text-red-400 mt-1">{creator.niche}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Followers</span>
                    <p className="text-sm font-bold text-white">{creator.followers}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Avg ROAS</span>
                    <p className="text-sm font-bold text-green-400">{creator.roas}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {creator.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.06]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <Link href="/brand/creators" className="mt-6">
                <button className="w-full py-2.5 rounded-lg bg-white/[0.06] hover:bg-red-600 text-xs font-bold text-white transition-colors duration-200">
                  Book Creator &rarr;
                </button>
              </Link>
            </GlassCard>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/brand/creators">
            <button className="px-6 py-3 rounded-xl border border-white/20 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm transition">
              View All 10,000+ Creators &rarr;
            </button>
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Workflow</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How UGCFY Works for Brands
          </h2>
          <p className="text-base text-slate-400">
            From brief creation to ready-to-scale ad creative in four streamlined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <GlassCard key={i} className="p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold font-mono text-red-500/70">
                    {step.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">Engineered For Performance</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for DTC Brands & Media Buyers
          </h2>
          <p className="text-base text-slate-400">
            Everything you need to produce, manage, and scale creator-led marketing campaigns with zero friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <GlassCard key={i} className="p-8 space-y-4 hover:border-blue-500/40 transition-all duration-300">
              <div className="size-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-red-600/20 border border-white/10 flex items-center justify-center text-2xl">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{feat.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-r from-red-950 via-slate-950 to-blue-950 border border-white/15 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Scale Your Creator Pipeline?
            </h2>
            <p className="text-base sm:text-lg text-slate-300">
              Join 500+ top DTC brands generating millions in revenue from authentic, high-converting UGC video ads.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/brand/dashboard">
                <RippleButton className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base px-9 py-4 rounded-xl shadow-xl shadow-red-600/30">
                  Launch Your First Campaign &rarr;
                </RippleButton>
              </Link>
              <Link href="/login">
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-base transition">
                  Brand Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#02020A] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-sm">
                U
              </div>
              <span className="font-bold text-lg text-white">UGCFY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premium marketplace connecting modern brands with verified high-performance UGC creators.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/brand/creators" className="hover:text-white transition">Browse Creators</Link></li>
              <li><Link href="/brand/campaigns" className="hover:text-white transition">Campaign Manager</Link></li>
              <li><Link href="/brand/analytics" className="hover:text-white transition">Performance Analytics</Link></li>
              <li><Link href="/brand/briefs" className="hover:text-white transition">Brief Templates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition">TikTok Ads</a></li>
              <li><a href="#features" className="hover:text-white transition">Meta Reels</a></li>
              <li><a href="#features" className="hover:text-white transition">YouTube Shorts</a></li>
              <li><a href="#features" className="hover:text-white transition">Amazon UGC</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Access</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/login" className="hover:text-white transition">Brand Login</Link></li>
              <li><Link href="/brand/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link href="/pending-approval" className="hover:text-white transition">Status Check</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} UGCFY Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
