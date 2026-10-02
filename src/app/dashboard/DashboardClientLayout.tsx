"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Clapperboard,
  Wallet,
  UserCircle,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Settings,
  Plus,
  Flame,
  ArrowUpRight,
  Video,
  Users,
  Sun,
} from "lucide-react";
import { useDashboard, UserRole } from "@/context/DashboardContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PricingModal } from "@/components/dashboard/PricingModal";
import { VERIFIED_REAL_CREATORS } from "@/lib/creators/discovery/verifiedCreators";

function formatDeterministicTime(timestamp: string | number | Date): string {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "";
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = hours.toString().padStart(2, "0");
  return `${hoursStr}:${minutes} ${ampm}`;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
  role?: UserRole | "both";
  badge?: string;
  badgeColor?: string;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, role: "both" },
  {
    name: "Campaigns",
    href: "/dashboard/campaigns",
    icon: BriefcaseBusiness,
    aliases: ["/dashboard/campaigns/new"],
    role: "both",
    badge: "3",
    badgeColor: "bg-brand-red-50 text-brand-red-600 border border-brand-red-100",
  },
  {
    name: "Reels",
    href: "/dashboard/reels",
    icon: Clapperboard,
    aliases: ["/dashboard/inspiration", "/dashboard/feed"],
    role: "both",
    badge: "Hot",
    badgeColor: "bg-rose-50 text-rose-600 border border-rose-200",
  },
  {
    name: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
    aliases: ["/dashboard/billing"],
    role: "both",
    badge: "Escrow",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircle, role: "both" },
];

const SECONDARY_BRAND_ITEMS: NavItem[] = [
  {
    name: "Discover Creators",
    href: "/platform/discover",
    icon: Search,
    role: "brand",
    badge: "AI 10K+",
    badgeColor: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  { name: "Team & POC", href: "/dashboard/team", icon: Building2, aliases: ["/dashboard/poc"], role: "brand" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, role: "brand" },
];

function isItemActive(pathname: string, item: NavItem) {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard";
  }
  const allHrefs = [item.href, ...(item.aliases || [])];
  return allHrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
  brand?: Record<string, any>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, setRole, brandProfile, creatorProfile, activities, campaigns } = useDashboard();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isBrand = role === "brand";
  const currentProfileName = isBrand ? brandProfile.name : creatorProfile.name;
  const currentProfileHandle = isBrand ? `@${brandProfile.handle}` : `@${creatorProfile.handle}`;
  const currentAvatar = isBrand ? brandProfile.logo : creatorProfile.avatar;

  // Keyboard shortcut for command palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  // Quick search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();

    const matches: Array<{
      type: "campaign" | "creator" | "nav";
      title: string;
      sub: string;
      href: string;
    }> = [];

    // Campaigns
    campaigns.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
        matches.push({
          type: "campaign",
          title: c.title,
          sub: `Campaign · ${c.category}`,
          href: `/dashboard/campaigns/${c.id}`,
        });
      }
    });

    // Creators
    VERIFIED_REAL_CREATORS.slice(0, 15).forEach((cr) => {
      if (
        (cr.displayName && cr.displayName.toLowerCase().includes(q)) ||
        cr.instagramUsername.toLowerCase().includes(q) ||
        (cr.primaryNiche && cr.primaryNiche.toLowerCase().includes(q))
      ) {
        matches.push({
          type: "creator",
          title: cr.displayName || cr.instagramUsername,
          sub: `@${cr.instagramUsername} · ${cr.primaryNiche || "Creator"}`,
          href: `/dashboard/creators/${cr.id}`,
        });
      }
    });

    // Nav
    PRIMARY_NAV_ITEMS.concat(SECONDARY_BRAND_ITEMS).forEach((n) => {
      if (n.name.toLowerCase().includes(q)) {
        matches.push({
          type: "nav",
          title: n.name,
          sub: "Quick Navigation",
          href: n.href,
        });
      }
    });

    return matches.slice(0, 8);
  }, [searchQuery, campaigns]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF9F9] text-slate-900 font-sans selection:bg-brand-red-600 selection:text-white">
      {/* ========================================================================= */}
      {/* DESKTOP LEFT SIDEBAR                                                      */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 z-30 shadow-[1px_0_15px_rgba(0,0,0,0.02)] ${
          isSidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Header / Brand Logo */}
        <div className="flex h-18 items-center justify-between border-b border-slate-100/90 px-4.5">
          <Link href="/dashboard" className="flex items-center min-w-0 group">
            {isSidebarCollapsed ? (
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-red-600 via-rose-600 to-rose-400 flex items-center justify-center text-white font-black text-xl shadow-[0_4px_12px_rgba(239,35,60,0.25)]">
                U
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Image
                  src="/brand/ugcfy-logo.png"
                  alt="UGCFY"
                  width={130}
                  height={36}
                  className="h-8 w-auto object-contain"
                  priority
                />
                <span className="rounded-md bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 text-[9px] font-black tracking-widest text-brand-red-600 uppercase">
                  PRO
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="rounded-xl border border-slate-200/70 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-200 ${
                isSidebarCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-3.5 pt-4 pb-2">
          {!isSidebarCollapsed ? (
            <div className="rounded-2xl bg-slate-100/90 p-1 flex items-center border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setRole("brand")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  isBrand
                    ? "bg-white text-brand-red-600 shadow-sm border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Brand</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  !isBrand
                    ? "bg-white text-rose-600 shadow-sm border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRole(isBrand ? "creator" : "brand")}
              title={`Switch to ${isBrand ? "Creator" : "Brand"} workspace`}
              className="w-full flex items-center justify-center h-10 rounded-xl bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-brand-red-600 transition-colors"
            >
              {isBrand ? <Building2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          <div>
            {!isSidebarCollapsed && (
              <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Workspace
              </p>
            )}
            <nav className="space-y-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const active = isItemActive(pathname, item);
                const Icon = item.icon;
                const displayName =
                  item.name === "Wallet" ? (isBrand ? "Spend Vault" : "Earnings") : item.name;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex min-h-11 items-center justify-between rounded-2xl px-3.5 text-sm font-extrabold transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-rose-50 via-rose-50/70 to-transparent text-brand-red-600 shadow-2xs border-l-4 border-brand-red-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                    }`}
                    title={isSidebarCollapsed ? displayName : ""}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                          active
                            ? "text-brand-red-600"
                            : "text-slate-400 group-hover:text-slate-800"
                        }`}
                      />
                      {!isSidebarCollapsed && <span className="truncate">{displayName}</span>}
                    </div>

                    {!isSidebarCollapsed && item.badge && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Brand Navigation */}
          {isBrand && (
            <div>
              {!isSidebarCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                  Discovery &amp; Team
                </p>
              )}
              <nav className="space-y-1">
                {SECONDARY_BRAND_ITEMS.map((item) => {
                  const active = isItemActive(pathname, item);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group relative flex min-h-10 items-center justify-between rounded-2xl px-3.5 text-sm font-bold transition-all duration-200 ${
                        active
                          ? "bg-rose-50/80 text-brand-red-600 border-l-4 border-brand-red-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                      title={isSidebarCollapsed ? item.name : ""}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-colors ${
                            active ? "text-brand-red-600" : "text-slate-400 group-hover:text-slate-800"
                          }`}
                        />
                        {!isSidebarCollapsed && (
                          <span className="truncate text-[13.5px]">{item.name}</span>
                        )}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            item.badgeColor || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          {/* Quick Wallet Widget in Sidebar */}
          {!isSidebarCollapsed && (
            <Link
              href="/dashboard/wallet"
              className="block rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 shadow-2xs hover:border-slate-300 transition-all group"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isBrand ? "ESCROW BALANCE" : "WALLET BALANCE"}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-lg font-black text-slate-950 tracking-tight">
                ₹3,45,000
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-slate-600">
                <span>Locked for active campaigns</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )}
        </div>

        {/* User Account Footer & Light Mode Toggle */}
        <div className="border-t border-slate-100/90 p-3 space-y-1">
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <Link href="/dashboard/profile" className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                    N
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black text-slate-950">
                      {currentProfileName}
                    </p>
                    <p className="truncate text-[11px] font-medium text-slate-400">
                      {currentProfileHandle}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Log out"
                  className="p-1.5 text-slate-400 hover:text-brand-red-600 hover:bg-brand-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Light Mode Selector */}
              <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-slate-400" />
                  <span>Light Mode</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </>
          ) : (
            <Link
              href="/dashboard/profile"
              title={currentProfileName}
              className="flex justify-center items-center py-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentAvatar}
                alt={currentProfileName}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
            </Link>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER (SLIDE-OVER)                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82vw] max-w-sm flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                <Link href="/dashboard" onClick={() => setIsMobileDrawerOpen(false)}>
                  <Image
                    src="/brand/ugcfy-logo.png"
                    alt="UGCFY"
                    width={120}
                    height={32}
                    className="h-7 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-50"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <div className="p-4 border-b border-slate-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                  Active Workspace Role
                </p>
                <div className="rounded-2xl bg-slate-100 p-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setRole("brand");
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      isBrand ? "bg-white text-brand-red-600 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    Brand Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole("creator");
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      !isBrand ? "bg-white text-rose-600 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    Creator Studio
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const active = isItemActive(pathname, item);
                  const Icon = item.icon;
                  const displayName =
                    item.name === "Wallet" ? (isBrand ? "Spending" : "Earnings") : item.name;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex min-h-12 items-center justify-between rounded-2xl px-4 text-sm font-bold transition-all ${
                        active
                          ? "bg-rose-50 text-brand-red-600"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon className={`h-5 w-5 ${active ? "text-brand-red-600" : "text-slate-400"}`} />
                        <span>{displayName}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {isBrand && (
                  <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                    <p className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Brand Features
                    </p>
                    {SECONDARY_BRAND_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileDrawerOpen(false)}
                          className="flex min-h-11 items-center gap-3.5 rounded-2xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <Icon className="h-4.5 w-4.5 text-slate-400" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </nav>

              {/* Mobile Drawer Footer */}
              <div className="border-t border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentAvatar}
                      alt={currentProfileName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">{currentProfileName}</p>
                      <p className="truncate text-[11px] text-slate-500">{currentProfileHandle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-brand-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-1 min-w-0 flex-col overflow-y-auto pb-20 md:pb-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8 shadow-xs">
          {/* Left: Mobile hamburger & Global Command Search */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open mobile navigation"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 p-2 text-slate-600 hover:bg-slate-50 md:hidden shadow-2xs"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Global Search Bar (Trigger for Command Dialog) */}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden sm:flex items-center gap-2.5 h-11 px-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 hover:bg-white hover:border-slate-300 text-xs sm:text-sm font-medium text-slate-500 transition-all w-64 lg:w-96 shadow-2xs"
            >
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">Search briefs, creators, reels, campaigns...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-2 font-mono text-[11px] font-bold text-slate-400 shadow-2xs">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Right: Actions & User Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Action: New Campaign */}
            {isBrand && (
              <Link
                href="/dashboard/campaigns/new"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-[#EF233C] to-brand-red-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[0_4px_16px_rgba(244,63,94,0.3)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>New Campaign</span>
              </Link>
            )}

            {/* Quick Role Switcher Pill */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full p-1 border border-slate-200/60 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => setRole("brand")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  isBrand
                    ? "bg-rose-50 text-brand-red-600 shadow-2xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Brand
              </button>
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  !isBrand
                    ? "bg-rose-50 text-rose-600 shadow-2xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Creator
              </button>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                aria-label="View notifications"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-brand-red-600 ring-2 ring-white" />
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close notifications"
                      className="fixed inset-0 z-30"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 z-40 mt-2 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <p className="text-sm font-extrabold text-slate-950">
                          Live Events &amp; Notifications
                        </p>
                        <span className="text-[11px] font-bold text-slate-400">
                          {activities.length} recent
                        </span>
                      </div>
                      <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                        {activities.map((act) => (
                          <div
                            key={act.id}
                            className="p-2.5 rounded-2xl bg-slate-50/80 hover:bg-rose-50/50 transition-colors text-xs"
                          >
                            <p className="font-extrabold text-slate-900">{act.title}</p>
                            <p className="text-slate-600 text-[11px] mt-0.5">{act.description}</p>
                            <p suppressHydrationWarning className="text-[10px] text-slate-400 mt-1 font-medium">
                              {formatDeterministicTime(act.timestamp)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Pill Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-2xl border border-transparent hover:border-slate-200/80 p-1.5 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt={currentProfileName}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-rose-100 shadow-2xs"
                />
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-black text-slate-950">{currentProfileName}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">Brand Account</span>
                </div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close user menu"
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 z-40 mt-2 w-60 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl"
                    >
                      <div className="p-3 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-950 truncate">
                          {currentProfileName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{currentProfileHandle}</p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-brand-red-600">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{role} workspace</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <UserCircle className="w-4 h-4 text-slate-400" />
                          <span>View Profile</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setRole(isBrand ? "creator" : "brand");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>Switch to {isBrand ? "Creator" : "Brand"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-red-600 hover:bg-brand-red-50"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <ErrorBoundary name="DashboardLayout">{children}</ErrorBoundary>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-slate-200/90 bg-white/95 px-2 backdrop-blur-lg md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
      >
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = isItemActive(pathname, item);
          const Icon = item.icon;
          const displayName =
            item.name === "Wallet" ? (isBrand ? "Spending" : "Earnings") : item.name;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all ${
                active ? "text-brand-red-600 font-extrabold" : "text-slate-500 font-semibold"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                  active ? "bg-rose-50 text-brand-red-600 scale-105" : "text-slate-500"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{displayName}</span>
            </Link>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* GLOBAL SEARCH / COMMAND PALETTE MODAL (⌘K)                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchModalOpen(false)}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 px-3 pb-3 border-b border-slate-100">
                <Search className="w-5 h-5 text-brand-red-600" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search campaigns, verified creators, reels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm font-medium outline-none bg-transparent placeholder:text-slate-400 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Results */}
              <div className="mt-3 max-h-72 overflow-y-auto space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((res, i) => (
                    <Link
                      key={i}
                      href={res.href}
                      onClick={() => setIsSearchModalOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/50 text-xs transition-colors"
                    >
                      <div>
                        <p className="font-black text-slate-950">{res.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{res.sub}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))
                ) : searchQuery.trim() ? (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No matching results found for &quot;{searchQuery}&quot;
                  </p>
                ) : (
                  <div className="p-3 text-xs text-slate-500 space-y-2">
                    <p className="font-extrabold uppercase text-[10px] text-slate-400">
                      Quick Shortcuts
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/dashboard/campaigns/new"
                        onClick={() => setIsSearchModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 font-bold flex items-center gap-2"
                      >
                        <Plus className="w-3.5 h-3.5 text-brand-red-600" />
                        <span>Create Campaign</span>
                      </Link>
                      <Link
                        href="/platform/discover"
                        onClick={() => setIsSearchModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 font-bold flex items-center gap-2"
                      >
                        <Search className="w-3.5 h-3.5 text-brand-red-600" />
                        <span>Discover Creators</span>
                      </Link>
                      <Link
                        href="/dashboard/reels"
                        onClick={() => setIsSearchModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 font-bold flex items-center gap-2"
                      >
                        <Video className="w-3.5 h-3.5 text-brand-red-600" />
                        <span>Watch UGC Reels</span>
                      </Link>
                      <Link
                        href="/dashboard/wallet"
                        onClick={() => setIsSearchModalOpen(false)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-800 font-bold flex items-center gap-2"
                      >
                        <Wallet className="w-3.5 h-3.5 text-brand-red-600" />
                        <span>Manage Wallet</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upgrade / Pricing Modal */}
      <AnimatePresence>
        {isPricingOpen && <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
