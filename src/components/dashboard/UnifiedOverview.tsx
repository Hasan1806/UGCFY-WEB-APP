"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BriefcaseBusiness,
  UsersRound,
  CreditCard,
  Plus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock3,
  TrendingUp,
  FileCheck2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Send,
  Video,
  Play,
  Flame,
  Layers,
  Search,
  Award,
  Activity,
  ArrowUpRight,
  Check,
  Eye,
  Star,
  Zap,
  BarChart3,
  SlidersHorizontal,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { VERIFIED_REAL_CREATORS } from "@/lib/creators/discovery/verifiedCreators";

// Types for Playbook Reels Spotlight
interface ReelItem {
  id: number;
  token: string;
  title: string;
  display_url?: string;
  raw_url?: string;
  board_name?: string;
  duration?: string;
}

export function UnifiedOverview() {
  const {
    role,
    brandProfile,
    creatorProfile,
    campaigns,
    applications,
    transactions,
    activities,
  } = useDashboard();
  const isBrand = role === "brand";

  // Time-based greeting
  const [greeting, setGreeting] = useState("Welcome");
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");

  // Analytics Chart State
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");
  const [activeMetric, setActiveMetric] = useState<"reach" | "views" | "spend">("views");
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    x: number;
    y: number;
    label: string;
    value: string;
    sub: string;
  } | null>(null);

  // Playbook Reels State
  const [spotlightReels, setSpotlightReels] = useState<ReelItem[]>([]);
  const [isLoadingReels, setIsLoadingReels] = useState(true);

  // Activity filter state
  const [activityTab, setActivityTab] = useState<"all" | "escrow" | "deliverables">("all");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setCurrentDateFormatted(
      new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date())
    );
  }, []);

  // Fetch Playbook Reels for Spotlight
  useEffect(() => {
    let isMounted = true;
    async function fetchReels() {
      try {
        setIsLoadingReels(true);
        const res = await fetch("/api/reels?limit=6&include_boards=true");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: ReelItem[] = json.data.slice(0, 6).map((item: any, idx: number) => ({
            id: item.id || idx,
            token: item.token,
            title: item.title?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Viral UGC Ad",
            display_url:
              item.display_url ||
              item.thumbnails?.[0]?.url ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            raw_url: item.raw_url,
            board_name: "Inspiration Feed",
            duration: "0:24",
          }));
          setSpotlightReels(mapped);
        }
      } catch (e) {
        console.error("Could not fetch spotlight reels:", e);
      } finally {
        if (isMounted) setIsLoadingReels(false);
      }
    }
    fetchReels();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format INR Currency
  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  // =========================================================================
  // BRAND CALCULATIONS
  // =========================================================================
  const activeBrandCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "active"),
    [campaigns]
  );
  const totalApplicationsCount = applications.length;
  const acceptedApplications = useMemo(
    () => applications.filter((a) => a.status === "accepted"),
    [applications]
  );
  const totalSpend = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "campaign_funding" && t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const escrowLocked = Math.max(0, totalSpend - 25000);
  const totalDisbursed = totalSpend > 0 ? 25000 : 0;

  // Curated spotlight creators
  const topSpotlightCreators = useMemo(() => {
    return VERIFIED_REAL_CREATORS.slice(0, 4);
  }, []);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    if (activityTab === "escrow") {
      return activities.filter(
        (a) =>
          a.type === "payment_completed" ||
          a.title.toLowerCase().includes("escrow") ||
          a.description.toLowerCase().includes("inr") ||
          a.description.toLowerCase().includes("₹")
      );
    }
    if (activityTab === "deliverables") {
      return activities.filter(
        (a) =>
          a.type === "deliverable_submitted" ||
          a.title.toLowerCase().includes("script") ||
          a.title.toLowerCase().includes("video") ||
          a.title.toLowerCase().includes("deliverable")
      );
    }
    return activities;
  }, [activities, activityTab]);

  // Chart data based on range and metric
  const chartPoints = useMemo(() => {
    if (timeRange === "7D") {
      if (activeMetric === "reach") {
        return [
          { day: "Mon", val: 120, label: "120K Reach", date: "Sep 26" },
          { day: "Tue", val: 165, label: "165K Reach", date: "Sep 27" },
          { day: "Wed", val: 210, label: "210K Reach", date: "Sep 28" },
          { day: "Thu", val: 195, label: "195K Reach", date: "Sep 29" },
          { day: "Fri", val: 280, label: "280K Reach", date: "Sep 30" },
          { day: "Sat", val: 340, label: "340K Reach", date: "Oct 01" },
          { day: "Sun", val: 410, label: "410K Reach", date: "Oct 02" },
        ];
      }
      if (activeMetric === "spend") {
        return [
          { day: "Mon", val: 15, label: "₹15,000", date: "Sep 26" },
          { day: "Tue", val: 22, label: "₹22,000", date: "Sep 27" },
          { day: "Wed", val: 35, label: "₹35,000", date: "Sep 28" },
          { day: "Thu", val: 28, label: "₹28,000", date: "Sep 29" },
          { day: "Fri", val: 45, label: "₹45,000", date: "Sep 30" },
          { day: "Sat", val: 52, label: "₹52,000", date: "Oct 01" },
          { day: "Sun", val: 68, label: "₹68,000", date: "Oct 02" },
        ];
      }
      return [
        { day: "Mon", val: 85, label: "85K Views", date: "Sep 26" },
        { day: "Tue", val: 130, label: "130K Views", date: "Sep 27" },
        { day: "Wed", val: 175, label: "175K Views", date: "Sep 28" },
        { day: "Thu", val: 220, label: "220K Views", date: "Sep 29" },
        { day: "Fri", val: 310, label: "310K Views", date: "Sep 30" },
        { day: "Sat", val: 390, label: "390K Views", date: "Oct 01" },
        { day: "Sun", val: 495, label: "495K Views", date: "Oct 02" },
      ];
    }
    if (timeRange === "90D") {
      return [
        { day: "Jul", val: 420, label: "420K Views", date: "July" },
        { day: "Aug", val: 780, label: "780K Views", date: "August" },
        { day: "Sep", val: 1350, label: "1.35M Views", date: "September" },
        { day: "Oct", val: 1840, label: "1.84M Views", date: "October" },
      ];
    }
    // Default 30D (Exact timeline from UGC Performance Engine mockup)
    if (activeMetric === "reach") {
      return [
        { day: "Oct 5", val: 12, label: "12.4K Reach", date: "Oct 5, 2026" },
        { day: "Oct 8", val: 24, label: "24.1K Reach", date: "Oct 8, 2026" },
        { day: "Oct 11", val: 18, label: "18.2K Reach", date: "Oct 11, 2026" },
        { day: "Oct 14", val: 22, label: "22.5K Reach", date: "Oct 14, 2026" },
        { day: "Oct 17", val: 32, label: "32.0K Reach", date: "Oct 16, 2026" },
        { day: "Oct 20", val: 19, label: "19.8K Reach", date: "Oct 20, 2026" },
        { day: "Oct 23", val: 26, label: "26.3K Reach", date: "Oct 23, 2026" },
        { day: "Oct 26", val: 21, label: "21.1K Reach", date: "Oct 26, 2026" },
        { day: "Oct 29", val: 35, label: "35.4K Reach", date: "Oct 29, 2026" },
        { day: "Oct 31", val: 42, label: "42.0K Reach", date: "Oct 31, 2026" },
      ];
    }
    if (activeMetric === "spend") {
      return [
        { day: "Oct 5", val: 10, label: "₹10,500", date: "Oct 5, 2026" },
        { day: "Oct 8", val: 22, label: "₹22,000", date: "Oct 8, 2026" },
        { day: "Oct 11", val: 15, label: "₹15,000", date: "Oct 11, 2026" },
        { day: "Oct 14", val: 20, label: "₹20,000", date: "Oct 14, 2026" },
        { day: "Oct 17", val: 30, label: "₹30,000", date: "Oct 16, 2026" },
        { day: "Oct 20", val: 16, label: "₹16,500", date: "Oct 20, 2026" },
        { day: "Oct 23", val: 24, label: "₹24,000", date: "Oct 23, 2026" },
        { day: "Oct 26", val: 18, label: "₹18,000", date: "Oct 26, 2026" },
        { day: "Oct 29", val: 32, label: "₹32,000", date: "Oct 29, 2026" },
        { day: "Oct 31", val: 39, label: "₹39,500", date: "Oct 31, 2026" },
      ];
    }
    return [
      { day: "Oct 5", val: 9, label: "9.2K UGC Views", date: "Oct 5, 2026" },
      { day: "Oct 8", val: 18, label: "18.1K UGC Views", date: "Oct 8, 2026" },
      { day: "Oct 11", val: 13, label: "13.4K UGC Views", date: "Oct 11, 2026" },
      { day: "Oct 14", val: 17, label: "17.0K UGC Views", date: "Oct 14, 2026" },
      { day: "Oct 17", val: 24.5, label: "24.5K UGC Views", date: "Oct 16, 2026" },
      { day: "Oct 20", val: 14, label: "14.2K UGC Views", date: "Oct 20, 2026" },
      { day: "Oct 23", val: 18, label: "18.4K UGC Views", date: "Oct 23, 2026" },
      { day: "Oct 26", val: 14.5, label: "14.5K UGC Views", date: "Oct 26, 2026" },
      { day: "Oct 29", val: 28, label: "28.3K UGC Views", date: "Oct 29, 2026" },
      { day: "Oct 31", val: 38, label: "38.5K UGC Views", date: "Oct 31, 2026" },
    ];
  }, [timeRange, activeMetric]);

  // Compute SVG coordinates for the curve matching the 40K grid scale
  const maxVal = 44;
  const svgWidth = 800;
  const svgHeight = 200;
  const coords = chartPoints.map((p, idx) => {
    const x = (idx / (chartPoints.length - 1)) * (svgWidth - 60) + 30;
    const y = svgHeight - (p.val / maxVal) * (svgHeight - 40) - 20;
    return { x, y, ...p };
  });

  // SVG smooth cubic bezier path builder
  const linePath = coords.reduce((acc, point, i, arr) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = arr[i - 1];
    if (!prev) return acc;
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, "");

  const lastCoord = coords[coords.length - 1];
  const firstCoord = coords[0];
  const areaPath =
    lastCoord && firstCoord
      ? `${linePath} L ${lastCoord.x} ${svgHeight} L ${firstCoord.x} ${svgHeight} Z`
      : "";

  // =========================================================================
  // CREATOR CALCULATIONS
  // =========================================================================
  const myApplications = useMemo(
    () =>
      applications.filter(
        (a) =>
          a.creatorId === creatorProfile.id ||
          a.creatorHandle === creatorProfile.handle
      ),
    [applications, creatorProfile]
  );
  const activeCreatorCampaigns = useMemo(
    () => myApplications.filter((a) => a.status === "accepted"),
    [myApplications]
  );
  const totalCreatorEarnings = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "creator_payout" && t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  // =========================================================================
  // BRAND VIEW (ELITE EXECUTIVE COMMAND CENTER)
  // =========================================================================
  if (isBrand) {
    return (
      <div className="relative space-y-7 pb-16 animate-in fade-in duration-300 select-none">
        {/* Ambient Top Glow (Essence of Red) */}
        <div
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[850px] h-[340px] rounded-full opacity-40 blur-3xl z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 35, 60, 0.22) 0%, rgba(225, 29, 72, 0.12) 40%, transparent 75%)",
          }}
        />

        {/* ================================================================= */}
        {/* 1. HERO COMMAND BANNER (MATCHES MOCKUP EXACTLY)                   */}
        {/* ================================================================= */}
        <section className="relative z-10 overflow-hidden rounded-[32px] border border-rose-200/80 bg-gradient-to-r from-[#FFF5F6] via-[#FFEBEF] to-[#FFF0F3] p-7 sm:p-9 shadow-[0_8px_30px_rgba(244,63,94,0.08)]">
          {/* Ambient radiance inside banner */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-rose-300/30 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 -bottom-20 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Greeting, Brand Name & Status Badges */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Badges Ribbon */}
              <div className="mb-3.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-rose-50/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-red-600 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-brand-red-600 animate-pulse" />
                  BRAND COMMAND CENTER
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-700 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Enterprise
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {currentDateFormatted}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                Good afternoon,
                <br />
                <span className="text-[#EF233C]">
                  {brandProfile.name}
                </span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-md">
                Real-time control over your influencer briefs, live UGC submissions, verified Indian creators, and bank-grade escrow balance.
              </p>

              {/* Live Status Indicators */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-1 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>Escrow Protection Active</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-2xs">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>
                    <strong>{activeBrandCampaigns.length}</strong> campaigns live now
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200/80 rounded-full px-3 py-1.5 shadow-2xs">
                  <UsersRound className="w-4 h-4 text-indigo-500" />
                  <span>
                    <strong>{acceptedApplications.length}</strong> creators onboarded
                  </span>
                </div>
              </div>
            </div>

            {/* Center Column: 3D Floating Creator Cards Composition */}
            <div className="lg:col-span-4 flex items-center justify-center py-4">
              <div className="relative w-full max-w-[320px] h-[220px] sm:h-[240px] flex items-center justify-center">
                {/* Translucent background glow plate */}
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/40 via-pink-100/30 to-rose-300/30 rounded-3xl blur-xl" />

                {/* Left Creator Card */}
                <div className="absolute left-2 sm:left-4 z-10 transform -rotate-8 translate-y-3 transition-transform hover:scale-105 duration-300">
                  <div className="h-32 w-24 sm:h-38 sm:w-28 rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-white/40 backdrop-blur-md ring-1 ring-rose-200/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/creators/hero-creator-1.jpg"
                      alt="Featured Creator"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Center Creator Card with Play Button */}
                <div className="relative z-20 transform scale-105 -translate-y-2 transition-transform hover:scale-110 duration-300">
                  {/* Floating Play Button */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-gradient-to-tr from-rose-500 via-[#EF233C] to-pink-500 text-white shadow-[0_6px_20px_rgba(244,63,94,0.55)] flex items-center justify-center z-30 ring-3 ring-white">
                    <Play className="w-5 h-5 fill-white translate-x-0.5" />
                  </div>

                  <div className="h-36 w-28 sm:h-44 sm:w-32 rounded-2xl overflow-hidden border-2 border-white shadow-2xl bg-white/60 backdrop-blur-md ring-1 ring-rose-300/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/creators/hero-creator-2.jpg"
                      alt="Featured Creator"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Right Creator Card */}
                <div className="absolute right-2 sm:right-4 z-10 transform rotate-8 translate-y-3 transition-transform hover:scale-105 duration-300">
                  <div className="h-32 w-24 sm:h-38 sm:w-28 rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl bg-white/40 backdrop-blur-md ring-1 ring-rose-200/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/creators/hero-creator-3.jpg"
                      alt="Featured Creator"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* Floating Mini Payment Card on bottom left */}
                <div className="absolute -bottom-2 left-0 sm:left-2 z-30 bg-white/90 backdrop-blur-md border border-white/95 rounded-xl px-2.5 py-1.5 shadow-lg flex items-center gap-1.5">
                  <div className="h-2 w-3 rounded-xs bg-amber-400" />
                  <div className="h-1.5 w-6 rounded-full bg-slate-200" />
                </div>

                {/* Floating Mini Vertical Bar Chart on bottom right */}
                <div className="absolute -bottom-2 right-0 sm:right-2 z-30 bg-white/90 backdrop-blur-md border border-white/95 rounded-xl px-2.5 py-2 shadow-lg flex items-end gap-1">
                  <div className="w-1 h-2 rounded-full bg-rose-300" />
                  <div className="w-1 h-3.5 rounded-full bg-rose-400" />
                  <div className="w-1 h-5 rounded-full bg-brand-red-500" />
                  <div className="w-1 h-3 rounded-full bg-rose-400" />
                  <div className="w-1 h-4 rounded-full bg-rose-500" />
                </div>
              </div>
            </div>

            {/* Right Column: CTA & Discover / Reels Inspiration */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug">
                Turn Real Creators into Real Business Growth
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                Launch campaigns, discover talent and track performance — all in one place.
              </p>

              <Link
                href="/dashboard/campaigns/new"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-[#EF233C] to-brand-red-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(244,63,94,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_28px_rgba(244,63,94,0.45)] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Campaign</span>
                <Sparkles className="w-4 h-4 text-rose-200" />
              </Link>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href="/platform/discover"
                  className="flex-1 inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-extrabold text-slate-800 hover:border-brand-red-300 hover:bg-rose-50/30 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>Discover Talent</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/dashboard/reels"
                  className="flex-1 inline-flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs font-extrabold text-slate-800 hover:border-brand-red-300 hover:bg-rose-50/30 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-brand-red-600" />
                    <span>Reels Inspo</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. FOUR ELITE KPI STAT CARDS (MATCHES MOCKUP EXACTLY)             */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
          {/* Active Campaigns */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-rose-300/80 hover:shadow-[0_10px_25px_-5px_rgba(239,35,60,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-2xs group-hover:scale-105 transition-transform">
                  <BriefcaseBusiness className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Active Campaigns
                </span>
              </div>
              <div className="h-7 w-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-rose-500 shadow-2xs group-hover:scale-105 transition-transform">
                <ChevronRight className="w-4 h-4 text-rose-500" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {activeBrandCampaigns.length}
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
                ↑ +2 this week
              </span>
            </div>

            <p className="mt-1.5 text-xs font-medium text-slate-500">
              {campaigns.length} total briefs configured
            </p>

            {/* Segmented bar indicator */}
            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
              <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="h-full bg-brand-red-600 rounded-full w-[45%]" />
              </div>
              <span className="text-xs font-bold text-slate-400">
                {activeBrandCampaigns.length} Active
              </span>
            </div>
          </div>

          {/* Applications Received */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-blue-300/80 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-2xs group-hover:scale-105 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Applications
                </span>
              </div>
              <div className="h-7 w-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-400 shadow-2xs group-hover:scale-105 transition-transform">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {totalApplicationsCount}
              </p>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-600">
                12 ready to review
              </span>
            </div>

            <p className="mt-1.5 text-xs font-medium text-slate-500">
              From verified Indian creators
            </p>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center -space-x-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-1.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-2.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-3.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                <span className="h-6 w-6 rounded-full bg-slate-100 border-2 border-white text-[10px] font-black text-slate-600 flex items-center justify-center">+9</span>
              </div>
              <Link
                href="/dashboard/campaigns"
                className="text-blue-600 font-extrabold flex items-center gap-1 hover:underline text-xs"
              >
                Review submissions →
              </Link>
            </div>
          </div>

          {/* Creators Hired */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-emerald-300/80 hover:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-105 transition-transform">
                  <UsersRound className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Creators Hired
                </span>
              </div>
              <div className="h-7 w-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-400 shadow-2xs group-hover:scale-105 transition-transform">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {acceptedApplications.length}
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
                🛡️ 98.4% on-time
              </span>
            </div>

            <p className="mt-1.5 text-xs font-medium text-slate-500">
              Active creator collaborations
            </p>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center -space-x-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-1.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-2.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/creators/hero-creator-3.jpg" alt="avatar" className="h-6 w-6 rounded-full border-2 border-white object-cover" />
              </div>
              <span className="text-xs font-extrabold text-emerald-600">
                +4 deliverable stages
              </span>
            </div>
          </div>

          {/* Escrow & Spend Vault */}
          <div className="group relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-purple-300/80 hover:shadow-[0_10px_25px_-5px_rgba(168,85,247,0.08)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-2xs group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Total Spend Vault
                </span>
              </div>
              <div className="h-7 w-7 rounded-full border border-slate-200/80 bg-white flex items-center justify-center text-slate-400 shadow-2xs group-hover:scale-105 transition-transform">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                ₹3,70,000
              </p>
            </div>

            <p className="mt-1.5 text-xs font-medium text-slate-500">
              Escrow locked &amp; creator payouts
            </p>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-xs font-bold text-slate-500">
                ₹3,45,000 in Escrow
              </span>
              <Link
                href="/dashboard/wallet"
                className="text-purple-600 font-extrabold flex items-center gap-1 hover:underline text-xs"
              >
                Wallet →
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. UGC PERFORMANCE ENGINE (MATCHES MOCKUP EXACTLY)                */}
        {/* ================================================================= */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4.5 h-4.5 text-brand-red-600" />
                <span className="text-[11px] font-black uppercase tracking-wider text-brand-red-600">
                  UGC Performance Engine
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                Brand Reach &amp; Content Velocity
              </h2>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Track your UGC performance, creator engagement, and campaign impact in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Metric Selector Tabs */}
              <div className="flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200/60 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveMetric("views")}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    activeMetric === "views"
                      ? "bg-rose-50 text-brand-red-600 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  UGC Views
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("reach")}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    activeMetric === "reach"
                      ? "bg-rose-50 text-brand-red-600 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Reach
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetric("spend")}
                  className={`px-3.5 py-1.5 rounded-full transition-all ${
                    activeMetric === "spend"
                      ? "bg-rose-50 text-brand-red-600 shadow-2xs font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Spend
                </button>
              </div>

              {/* Time Range Tabs */}
              <div className="flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200/60 text-xs font-bold">
                {(["7D", "30D", "90D"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1.5 rounded-full transition-all ${
                      timeRange === r
                        ? "bg-gradient-to-r from-rose-500 to-brand-red-600 text-white shadow-2xs font-black"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas with Y-Axis */}
          <div className="relative pt-6 pb-2">
            <div className="flex gap-4">
              {/* Left Y Axis scale labels */}
              <div className="flex flex-col justify-between text-[11px] font-bold text-slate-400 select-none pb-8 text-right w-8 shrink-0 h-44 sm:h-52">
                <span>40K</span>
                <span>30K</span>
                <span>20K</span>
                <span>10K</span>
                <span>0</span>
              </div>

              {/* Main SVG Curve Canvas */}
              <div className="flex-1 h-44 sm:h-52 relative">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF233C" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#EF233C" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="#EF233C" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#EF233C" />
                      <stop offset="50%" stopColor="#E11D48" />
                      <stop offset="100%" stopColor="#BE123C" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines matching Y-axis ticks */}
                  <line x1="10" y1={svgHeight * 0.1} x2={svgWidth - 10} y2={svgHeight * 0.1} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="10" y1={svgHeight * 0.32} x2={svgWidth - 10} y2={svgHeight * 0.32} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="10" y1={svgHeight * 0.55} x2={svgWidth - 10} y2={svgHeight * 0.55} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="10" y1={svgHeight * 0.77} x2={svgWidth - 10} y2={svgHeight * 0.77} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="10" y1={svgHeight * 0.95} x2={svgWidth - 10} y2={svgHeight * 0.95} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Area under curve */}
                  <path d={areaPath} fill="url(#chartGlow)" />

                  {/* Main Stroke */}
                  <path
                    d={linePath}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Points */}
                  {coords.map((pt, i) => (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="4.5"
                        fill="#FFFFFF"
                        stroke="#EF233C"
                        strokeWidth="3"
                        className="cursor-pointer transition-transform hover:scale-150 drop-shadow-md"
                        onMouseEnter={() =>
                          setHoveredDataPoint({
                            x: pt.x,
                            y: pt.y,
                            label: pt.label,
                            value: pt.day,
                            sub: pt.date,
                          })
                        }
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Oct 17 Highlight Tooltip (Matches Mockup Exactly) */}
                {coords[4] && (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-xl border border-slate-200/90 z-20 flex flex-col items-center"
                    style={{
                      left: `${(coords[4].x / svgWidth) * 100}%`,
                      top: `${(coords[4].y / svgHeight) * 100 - 10}%`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-red-600" />
                      <span className="font-black text-slate-900 text-xs">24.5K UGC Views</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Oct 16, 2026</span>
                  </div>
                )}
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between pl-12 pr-4 text-[11px] font-bold text-slate-400 mt-2">
              {chartPoints.map((p, i) => (
                <span key={i}>{p.day}</span>
              ))}
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                Avg Cost / UGC Reel
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">₹4,250</p>
              <span className="text-[10px] font-bold text-emerald-600">14% below industry</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                Engagement Rate
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">5.6%</p>
              <span className="text-[10px] font-bold text-emerald-600">Top 5% in category</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                Turnaround Speed
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">3.4 Days</p>
              <span className="text-[10px] font-bold text-brand-red-600">Brief to final cut</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/50">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                Delivery Success
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">99.2%</p>
              <span className="text-[10px] font-bold text-emerald-600">Escrow backed guarantee</span>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. ACTIVE CAMPAIGN COMMAND MATRIX & PIPELINE                      */}
        {/* ================================================================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                Live Campaign Command Center
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Monitor deliverables, approve scripts, and track creator progress.
              </p>
            </div>

            <Link
              href="/dashboard/campaigns"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-red-600 hover:text-brand-red-700 transition-colors"
            >
              <span>View all ({campaigns.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {campaigns.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
              <BriefcaseBusiness className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-slate-900">No campaigns launched yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create your first brief to discover creators, review incoming pitches, and get authentic UGC.
              </p>
              <Link
                href="/dashboard/campaigns/new"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-red-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-red-700"
              >
                <Plus className="w-4 h-4" /> Create Campaign Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {campaigns.slice(0, 3).map((camp) => {
                const campApps = applications.filter((a) => a.campaignId === camp.id);
                const acceptedCount = campApps.filter((a) => a.status === "accepted").length;
                const totalTarget = camp.creatorRequirements.creatorsCount || 5;
                const progressPct = Math.min(100, Math.round((acceptedCount / totalTarget) * 100));

                return (
                  <div
                    key={camp.id}
                    className="group relative overflow-hidden rounded-[26px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-brand-red-200 hover:shadow-[0_8px_30px_rgba(239,35,60,0.08)]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      {/* Left: Campaign Meta */}
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Cover Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              camp.cover_image ||
                              "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=240&auto=format&fit=crop&q=80"
                            }
                            alt={camp.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
                                camp.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                  : camp.status === "draft"
                                  ? "bg-slate-100 text-slate-600 border-slate-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {camp.status}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              {camp.category}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs font-bold text-slate-600">
                              {camp.deliverables?.[0]?.format || "1x Reel"}
                            </span>
                          </div>

                          <Link
                            href={`/dashboard/campaigns/${camp.id}`}
                            className="group-hover:text-brand-red-600 transition-colors"
                          >
                            <h3 className="text-base sm:text-lg font-black text-slate-950 truncate">
                              {camp.title}
                            </h3>
                          </Link>

                          <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl font-normal">
                            {camp.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3 font-medium">
                            <span>
                              Total Budget: <strong className="text-slate-950">{formatINR(camp.budget)}</strong>
                            </span>
                            <span>
                              Per Creator:{" "}
                              <strong className="text-slate-950">
                                {formatINR(camp.creatorCompensation)}
                              </strong>
                            </span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Clock3 className="w-3.5 h-3.5 text-slate-400" />
                              Deadline: {camp.applicationDeadline}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Deliverables Pipeline & Quick Actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                        {/* 4-Stage Deliverable Pipeline Indicator */}
                        <div className="w-full sm:w-60">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-extrabold text-slate-800">
                              Hiring Progress
                            </span>
                            <span className="font-black text-brand-red-600">
                              {acceptedCount} / {totalTarget} Creators
                            </span>
                          </div>

                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-red-600 to-rose-500 transition-all duration-500"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[9px] font-bold text-slate-400 mt-1 uppercase">
                            <span>Brief</span>
                            <span>Review</span>
                            <span>Production</span>
                            <span>Payout</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Link
                            href={`/dashboard/campaigns/${camp.id}`}
                            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-extrabold text-white transition-all hover:bg-black shadow-2xs"
                          >
                            <span>Manage Brief</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/dashboard/campaigns/${camp.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                            title="View Applicants"
                          >
                            <span className="text-brand-red-600 font-extrabold mr-1">
                              {campApps.length}
                            </span>
                            <span>Pitches</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 5. LIVE PLAYBOOK REELS INSPIRATION RADAR (CONNECTED STREAM)        */}
        {/* ================================================================= */}
        <section className="overflow-hidden rounded-[28px] border border-rose-100/90 bg-gradient-to-b from-[#FFF5F7]/60 via-white to-white p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(239,35,60,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-red-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                  <Play className="w-2.5 h-2.5 fill-brand-red-600" />
                  Playbook Ad Feed
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-950 tracking-tight">
                Live UGC Reels &amp; High-Converting Ad Inspiration
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Viral formats and portfolio work from your connected Playbook library.
              </p>
            </div>

            <Link
              href="/dashboard/reels"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-2xs hover:bg-brand-red-700 transition-all self-start sm:self-auto"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Full Reels Player</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Reels Strip / Carousel */}
          {isLoadingReels ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[9/16] rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {spotlightReels.map((reel) => (
                <Link
                  key={reel.id}
                  href="/dashboard/reels"
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 shadow-xs hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={reel.display_url}
                    alt={reel.title}
                    className="h-full w-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Top Duration Pill */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white">
                    {reel.duration}
                  </div>

                  {/* Center Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="h-10 w-10 rounded-full bg-brand-red-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Bottom Title */}
                  <div className="absolute bottom-2.5 inset-x-2.5 z-10 text-white">
                    <p className="text-xs font-bold line-clamp-2 leading-snug drop-shadow-md">
                      {reel.title}
                    </p>
                    <span className="text-[10px] text-rose-300 font-extrabold mt-1 inline-block">
                      Watch Reel →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 6. CREATOR DISCOVERY SPOTLIGHT & ESCROW ACTIVITY SPLIT             */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Matched Indian Creators Spotlight */}
          <div className="lg:col-span-2 space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-red-600" />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-red-600">
                      Top Match AI Discovery
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                    Verified Creators Recommended For You
                  </h2>
                </div>

                <Link
                  href="/platform/discover"
                  className="text-xs font-extrabold text-brand-red-600 hover:text-brand-red-700 flex items-center gap-1"
                >
                  Discover more <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Creators Grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topSpotlightCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="group rounded-2xl border border-slate-200/80 p-4 transition-all duration-200 hover:border-brand-red-300 hover:shadow-md hover:bg-rose-50/20 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={creator.profileImageUrl || ""}
                          alt={creator.displayName || ""}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-black text-slate-950 truncate">
                            {creator.displayName}
                          </h4>
                          {creator.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate">
                          @{creator.instagramUsername} · {creator.city || "Mumbai"}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-[10px] font-extrabold text-brand-red-600 border border-rose-100">
                            {creator.primaryNiche || "Fashion"}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            {creator.engagementRate || 4.8}% ER
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
                        <p className="font-extrabold text-slate-900">
                          {formatINR(creator.startingPrice || 25000)}
                        </p>
                      </div>

                      <Link
                        href={`/dashboard/creators/${creator.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-black transition-colors"
                      >
                        <span>View Profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Real-time Live Event & Escrow Feed */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-red-600" />
                  <h3 className="text-base font-black text-slate-950">Live Audit &amp; Escrow</h3>
                </div>
                <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="my-3 flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActivityTab("all")}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    activityTab === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActivityTab("escrow")}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    activityTab === "escrow"
                      ? "bg-white text-brand-red-600 shadow-2xs"
                      : "text-slate-500"
                  }`}
                >
                  Escrow
                </button>
                <button
                  type="button"
                  onClick={() => setActivityTab("deliverables")}
                  className={`flex-1 py-1 rounded-lg transition-all ${
                    activityTab === "deliverables"
                      ? "bg-white text-brand-red-600 shadow-2xs"
                      : "text-slate-500"
                  }`}
                >
                  Deliverables
                </button>
              </div>

              {/* Feed List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredActivities.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No matching activity recorded yet.
                  </div>
                ) : (
                  filteredActivities.slice(0, 6).map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-rose-50/40 transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">
                          {new Date(act.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CREATOR VIEW (CREATOR STUDIO COMMAND CENTER)
  // =========================================================================
  return (
    <div className="relative space-y-7 pb-16 animate-in fade-in duration-300 select-none">
      {/* Ambient Top Glow */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[850px] h-[340px] rounded-full opacity-40 blur-3xl z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.22) 0%, rgba(244, 63, 94, 0.12) 40%, transparent 75%)",
        }}
      />

      {/* Creator Hero Header */}
      <section className="relative z-10 overflow-hidden rounded-[28px] border border-rose-100/80 bg-gradient-to-r from-white via-[#FFF8F9] to-white p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(225,29,72,0.06)] backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-white/90 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-rose-600 shadow-2xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Creator Studio
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Creator · Tier 1
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                4.9 Brand Rating
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-rose-600 to-slate-900 bg-clip-text text-transparent">
                {creatorProfile.name}
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal max-w-xl">
              Track your paid brand deliverables, review submitted scripts, upload video drafts, and claim instant payouts.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  <strong>2 Deliverables</strong> due this week
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 rounded-xl px-2.5 py-1 shadow-2xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  <strong>{formatINR(creatorProfile.walletBalance || 35000)}</strong> ready for payout
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link
              href="/dashboard/campaigns"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-brand-red-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(225,29,72,0.25)] transition-all hover:shadow-[0_12px_28px_rgba(225,29,72,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Paid Campaigns</span>
            </Link>

            <Link
              href="/dashboard/reels"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-800 hover:bg-rose-50/50 hover:text-rose-600 transition-colors shadow-2xs"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Browse Video Inspiration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Creator KPI Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Active Contracts
            </span>
            <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-2xs">
              <BriefcaseBusiness className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{activeCreatorCampaigns.length}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Currently in production</p>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Submitted Pitches
            </span>
            <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-2xs">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">{myApplications.length}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Total applications sent</p>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Approved Deliverables
            </span>
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-2xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {creatorProfile.completedCampaignsCount}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">100% Brand Approval</p>
        </div>

        <div className="rounded-[24px] border border-slate-200/80 bg-white p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Available Payout
            </span>
            <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-2xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {formatINR(creatorProfile.walletBalance || 35000)}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">Instant withdrawal ready</p>
        </div>
      </section>

      {/* Creator Deliverables & Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Collabs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                  Your Active Deliverables
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Milestones and script deadlines for your brand contracts.
                </p>
              </div>

              <Link
                href="/dashboard/campaigns"
                className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeCreatorCampaigns.length === 0 ? (
              <div className="p-10 text-center">
                <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">No active deliverables right now</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse open brand briefs and apply to start earning.
                </p>
                <Link
                  href="/dashboard/campaigns"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-extrabold text-white"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Explore Campaigns
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {activeCreatorCampaigns.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Contract
                        </span>
                        <span className="text-xs font-bold text-slate-600">{app.brandName}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-950">{app.campaignTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Deliverable: 1x Dedicated Instagram Reel (9:16)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-black transition-colors"
                      >
                        Submit Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Creator Playbook Radar & Tips */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-black text-slate-950">Creator Accelerator</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Brands prioritize creators who include hooked scripts, high-retention cuts, and rapid turnarounds.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/dashboard/reels"
                className="p-3 rounded-2xl border border-slate-200/70 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex items-center justify-between text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Play className="w-4 h-4 text-rose-600" />
                  <span>Study Viral Ad Hooks</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/profile"
                className="p-3 rounded-2xl border border-slate-200/70 hover:border-rose-300 hover:bg-rose-50/30 transition-all flex items-center justify-between text-xs font-bold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-rose-600" />
                  <span>Update Media Kit &amp; Rates</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
