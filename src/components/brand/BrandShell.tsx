"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/brand/dashboard" },
  { label: "Profile", href: "/brand/profile" },
  { label: "Briefs", href: "/brand/briefs" },
  { label: "Campaigns", href: "/brand/campaigns" },
  { label: "Creators", href: "/brand/creators" },
  { label: "POCs", href: "/brand/poc" },
  { label: "Analytics", href: "/brand/analytics" },
  { label: "Messages", href: "/brand/messages" },
  { label: "Feed", href: "/brand/feed" },
  { label: "Reports", href: "/brand/reports" },
  { label: "Settings", href: "/brand/settings" },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  dashboard: { title: "Dashboard", description: "Brand overview and actionable insights." },
  profile: { title: "Profile", description: "Manage your brand identity and narrative." },
  briefs: { title: "Briefs", description: "Create and manage creator briefs with clarity and speed." },
  campaigns: { title: "Campaigns", description: "Run campaigns and manage all creator deliveries." },
  creators: { title: "Creators", description: "Discover, invite, and collaborate with creators." },
  poc: { title: "POCs", description: "Manage proof-of-concept collaborations and creator reviews." },
  analytics: { title: "Analytics", description: "Track performance with brand-level insights." },
  messages: { title: "Messages", description: "Stay connected with creators and campaign teams." },
  feed: { title: "Feed", description: "Publish branded posts and community updates." },
  reports: { title: "Reports", description: "Review campaign performance and ROI snapshots." },
  settings: { title: "Settings", description: "Configure your account, team, and security." },
};

const pageActions: Record<string, { label: string; style: "primary" | "secondary" }[]> = {
  dashboard: [
    { label: "Review briefs", style: "secondary" },
    { label: "Launch campaign", style: "primary" },
  ],
  profile: [
    { label: "Edit profile", style: "primary" },
    { label: "View brand kit", style: "secondary" },
  ],
  briefs: [
    { label: "New brief", style: "primary" },
    { label: "Template library", style: "secondary" },
  ],
  campaigns: [
    { label: "Create campaign", style: "primary" },
    { label: "Approve deliverables", style: "secondary" },
  ],
  creators: [
    { label: "Invite creator", style: "primary" },
    { label: "Match talent", style: "secondary" },
  ],
  poc: [
    { label: "Add POC", style: "primary" },
    { label: "Review results", style: "secondary" },
  ],
  analytics: [
    { label: "Export dashboard", style: "primary" },
    { label: "View trends", style: "secondary" },
  ],
  messages: [
    { label: "New message", style: "primary" },
    { label: "Unread inbox", style: "secondary" },
  ],
  feed: [
    { label: "Post update", style: "primary" },
    { label: "Manage drafts", style: "secondary" },
  ],
  reports: [
    { label: "Export report", style: "primary" },
    { label: "Share insights", style: "secondary" },
  ],
  settings: [
    { label: "Update settings", style: "primary" },
    { label: "Team permissions", style: "secondary" },
  ],
};

export function BrandShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [navOpen, setNavOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const slug = pathname?.split("/").filter(Boolean).pop() ?? "dashboard";
  const page = pageMeta[slug] ?? { title: "Brand", description: "Control your creator marketing hub." };
  const actions = pageActions[slug] ?? [{ label: "Create something", style: "primary" }];
  const notificationCount = slug === "messages" ? 6 : slug === "campaigns" ? 3 : slug === "analytics" ? 2 : 5;

  const handleActionClick = (label: string) => {
    setActiveAction(label);
  };

  const handleConfirmAction = () => {
    if (!activeAction) return;
    toast.success(`${activeAction} confirmed`, {
      description: `Your ${activeAction.toLowerCase()} workflow is now ready.`,
    });
    setActiveAction(null);
  };

  const handleNotificationsClick = () => {
    toast(`Opening notifications for ${page.title.toLowerCase()}.`, {
      description: "You can review recent updates, assignments, and alerts here.",
    });
  };

  const closeMobileNav = () => setNavOpen(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1640px] gap-6 xl:grid-cols-[280px_1fr]">
        <div className="flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 xl:hidden">
          <button onClick={() => setNavOpen(true)} className="rounded-3xl border border-white/10 bg-white/5 p-3 text-white/80 transition hover:bg-white/10">
            <span className="sr-only">Open navigation</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/50">Brand</p>
            <h2 className="text-lg font-semibold text-white">{page.title}</h2>
          </div>
          <button onClick={handleNotificationsClick} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10">
            Alerts
          </button>
        </div>

        <aside className="hidden xl:block space-y-6 rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#2563EB] text-sm font-bold text-white">UG</div>
            <div>
              <p className="text-sm font-semibold text-white">UGCFY Brand</p>
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">Creator marketing</p>
            </div>
          </div>

          <div className="space-y-2 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <p className="uppercase tracking-[0.22em] text-white/50">Plan</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[rgba(220,20,60,0.24)] bg-[rgba(220,20,60,0.12)] px-3 py-2 text-[11px] font-semibold uppercase text-[#DC143C]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C]" /> Growth Pro
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-[rgba(220,20,60,0.12)] text-white shadow-[0_8px_30px_rgba(220,20,60,0.12)]" : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive ? <span className="h-2.5 w-2.5 rounded-full bg-[#DC143C]" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 text-sm text-white/80">
            <p className="uppercase tracking-[0.24em] text-white/50">Brand admin</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white">RA</div>
              <div>
                <p className="text-sm text-white">Ray Adler</p>
                <p className="text-xs text-white/50">Head of brand</p>
              </div>
            </div>
            <button onClick={handleLogout} className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10">
              Logout
            </button>
          </div>
        </aside>

        <main className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }} className="rounded-[32px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
                  <span>Brand</span>
                  <span className="text-white/30">/</span>
                  <span>{page.title}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold text-white">{page.title}</h2>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/80">Live</span>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-white/60">{page.description}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button onClick={handleNotificationsClick} className="relative rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10">
                  Notifications
                  <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-[#DC143C] px-2 text-[11px] font-semibold text-white">{notificationCount}</span>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleActionClick(action.label)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        action.style === "primary"
                          ? "bg-gradient-to-br from-[#DC143C] to-[#9B1239] text-white"
                          : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          {children}
        </main>
      </div>

      <AnimatePresence>
        {navOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={closeMobileNav}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed left-0 top-0 z-50 flex h-full w-full max-w-[320px] flex-col overflow-y-auto border-r border-white/10 bg-bg-deep p-6 shadow-[0_0_60px_rgba(0,0,0,0.65)]"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">Brand navigation</p>
                  <h2 className="text-xl font-semibold text-white">UGCFY</h2>
                </div>
                <button onClick={closeMobileNav} className="rounded-full border border-white/10 bg-white/5 px-3 py-3 text-white/80 hover:bg-white/10">
                  Close
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-3 rounded-[28px] border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                  <p className="uppercase tracking-[0.24em] text-white/50">Plan</p>
                  <p className="text-sm">Growth Pro</p>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileNav}
                        className={`block rounded-3xl px-4 py-3 text-sm transition ${
                          isActive ? "bg-[rgba(220,20,60,0.12)] text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <button onClick={handleNotificationsClick} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
                  View notifications
                </button>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeAction ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setActiveAction(null)}
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="fixed inset-x-4 bottom-6 z-50 rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.95)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:inset-x-10"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-white/50">Action ready</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{activeAction}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveAction(null)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 hover:bg-white/10">
                    Cancel
                  </button>
                  <button onClick={handleConfirmAction} className="rounded-2xl bg-gradient-to-br from-[#DC143C] to-[#9B1239] px-4 py-3 text-sm font-semibold text-white">
                    Confirm action
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/60">This action opens the next workflow stage and provides a quick preview before you proceed.</p>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
