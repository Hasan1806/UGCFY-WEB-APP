"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronLeft,
  CreditCard,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PricingModal } from "@/components/dashboard/PricingModal";

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  aliases?: string[];
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

interface BrandProp {
  id: string;
  user_id?: string | null;
  company_name?: string | null;
  brand_name?: string | null;
  email?: string | null;
  kyc_status?: string | null;
  access_status?: string;
  poc_count?: number;
  subscription_status?: string | null;
}

const navGroups: NavGroup[] = [
  {
    label: "MAIN",
    items: [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "DISCOVER",
    items: [
      { name: "Inspiration Feed", href: "/dashboard/inspiration", icon: BookOpen, aliases: ["/dashboard/feed"] },
      { name: "Creator Discovery", href: "/dashboard/creators", icon: Search },
      { name: "Shortlist", href: "/dashboard/shortlist", icon: UserRoundCheck },
    ],
  },
  {
    label: "WORKFLOW",
    items: [
      { name: "Campaign Manager", href: "/dashboard/campaigns", icon: BriefcaseBusiness },
      { name: "Content Approvals", href: "/dashboard/approvals", icon: BadgeCheck },
      { name: "Collaboration Hub", href: "/dashboard/collaboration", icon: MessageSquareText, aliases: ["/dashboard/messages"] },
      { name: "Content Library", href: "/dashboard/content-library", icon: FolderOpen },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      { name: "Insights", href: "/dashboard/insights", icon: Gauge },
      { name: "Billing & Payments", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "BRAND",
    items: [
      { name: "Team & POC", href: "/dashboard/team", icon: UsersRound, aliases: ["/dashboard/poc"] },
      { name: "Brand Profile", href: "/dashboard/profile", icon: Building2 },
      { name: "Verification", href: "/dashboard/verification", icon: ShieldCheck, aliases: ["/brand/kyc"] },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, aliases: ["/settings"] },
    ],
  },
];

const allNavItems = navGroups.flatMap((group) => group.items);

function isItemActive(pathname: string, item: NavItem) {
  const paths = [item.href, ...(item.aliases ?? [])];
  return paths.some((path) => pathname === path || (path !== "/dashboard" && pathname.startsWith(`${path}/`)));
}

function getCurrentItem(pathname: string) {
  return allNavItems.find((item) => isItemActive(pathname, item)) ?? allNavItems[0];
}

function SidebarNav({
  collapsed,
  pathname,
  onNavigate,
}: {
  collapsed?: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Dashboard navigation" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-1.5">
          {!collapsed && (
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active = isItemActive(pathname, item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                {...(onNavigate ? { onClick: onNavigate } : {})}
                className={`group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition ${
                  active
                    ? "bg-brand-red-50 text-brand-red-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
                title={collapsed ? item.name : ""}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${active ? "text-brand-red-600" : "text-slate-400 group-hover:text-slate-700"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {active && !collapsed && <span className="absolute right-2 h-6 w-1 rounded-full bg-brand-red-600" />}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function GoPlusCard({
  collapsed,
  pocCount,
  subscriptionStatus,
  onUpgrade,
}: {
  collapsed?: boolean;
  pocCount: number;
  subscriptionStatus: string;
  onUpgrade: () => void;
}) {
  const isFree = subscriptionStatus === "free";
  const usageWidth = isFree ? Math.min((pocCount / 3) * 100, 100) : 100;

  if (collapsed) {
    return (
      <button
        type="button"
        aria-label="Open Go Plus upgrade"
        onClick={onUpgrade}
        className="mx-3 mb-3 flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-brand-red-600 transition hover:border-brand-red-200 hover:bg-brand-red-50"
      >
        
      </button>
    );
  }

  return (
    <div className="mx-3 mb-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Go Plus</p>
          <p className="mt-1 text-sm font-extrabold text-slate-950">
            {isFree ? "Free plan" : "Plus active"}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-red-50 text-brand-red-600">
          
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span>POC usage</span>
          <span>{isFree ? `${pocCount} / 3` : `${pocCount} / unlimited`}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-red-600 transition-all" style={{ width: `${usageWidth}%` }} />
        </div>
      </div>
      {isFree && (
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-4 w-full rounded-2xl bg-brand-black px-3 py-2.5 text-xs font-extrabold text-white transition hover:bg-brand-red-700"
        >
          Upgrade
        </button>
      )}
    </div>
  );
}

export default function DashboardClientLayout({
  children,
  brand,
}: {
  children: React.ReactNode;
  brand: BrandProp;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [pocCount, setPocCount] = useState(brand.poc_count ?? 0);
  const subscriptionStatus = brand.subscription_status ?? "free";

  const currentItem = useMemo(() => getCurrentItem(pathname), [pathname]);
  const brandName = brand.brand_name || brand.company_name || "Brand Account";
  const initials = brandName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "BR";
  const isMessagingRoute = pathname === "/dashboard/collaboration" || pathname.startsWith("/dashboard/collaboration/");
  const isApproved = brand.access_status === "approved";

  useEffect(() => {
    if (!isApproved && pathname !== "/dashboard/verification" && !pathname.startsWith("/dashboard/verification/")) {
      router.replace("/dashboard/verification");
    }
  }, [isApproved, pathname, router]);

  useEffect(() => {
    const handleOpenPricing = () => setIsPricingOpen(true);
    const handleIncrementPoc = () => setPocCount((prev) => prev + 1);
    const handleDecrementPoc = () => setPocCount((prev) => Math.max(prev - 1, 0));

    window.addEventListener("open-subscription-paywall", handleOpenPricing);
    window.addEventListener("open-pricing-modal", handleOpenPricing);
    window.addEventListener("increment-poc-count", handleIncrementPoc);
    window.addEventListener("decrement-poc-count", handleDecrementPoc);

    return () => {
      window.removeEventListener("open-subscription-paywall", handleOpenPricing);
      window.removeEventListener("open-pricing-modal", handleOpenPricing);
      window.removeEventListener("increment-poc-count", handleIncrementPoc);
      window.removeEventListener("decrement-poc-count", handleDecrementPoc);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!cancelled && !data.session) {
        router.replace("/login");
        router.refresh();
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_OUT" || !session) && !cancelled) {
        router.replace("/login");
        router.refresh();
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  if (!isApproved) {
    return (
      <div className="dashboard-shell flex min-h-screen w-full flex-col bg-[#FDFBFB] text-slate-950">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
            <div className="flex items-center">
              <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={120} height={36} className="h-8 w-auto object-contain" priority />
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </header>
        <main className="flex-1">
          <ErrorBoundary name="DashboardLayout">{children}</ErrorBoundary>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell flex h-screen w-full overflow-hidden bg-brand-surface text-slate-950">
      <aside
        className={`hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 md:flex ${
          isSidebarCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
          <Link href="/dashboard" className="flex min-w-0 items-center">
            {isSidebarCollapsed ? (
              <Image src="/brand/ugcfy-icon.png" alt="UGCFY" width={36} height={36} className="h-9 w-9 object-contain" />
            ) : (
              <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={120} height={36} className="h-8 w-auto object-contain" priority />
            )}
          </Link>
          <button
            type="button"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setIsSidebarCollapsed((value) => !value)}
            className="rounded-xl border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isSidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <SidebarNav collapsed={isSidebarCollapsed} pathname={pathname} />
        <GoPlusCard
          collapsed={isSidebarCollapsed}
          pocCount={pocCount}
          subscriptionStatus={subscriptionStatus}
          onUpgrade={() => setIsPricingOpen(true)}
        />
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-bold text-slate-600 transition hover:bg-brand-red-50 hover:text-brand-red-600"
          >
            <LogOut className="h-4.5 w-4.5 shrink-0 text-slate-400" />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close dashboard navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(22rem,92vw)] flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
                <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="flex items-center">
                  <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={120} height={36} className="h-8 w-auto object-contain" priority />
                </Link>
                <button
                  type="button"
                  aria-label="Close dashboard navigation"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-xl border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setIsMobileOpen(false)} />
              <GoPlusCard
                pocCount={pocCount}
                subscriptionStatus={subscriptionStatus}
                onUpgrade={() => {
                  setIsMobileOpen(false);
                  setIsPricingOpen(true);
                }}
              />
              <div className="border-t border-slate-200 p-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-bold text-slate-600 transition hover:bg-brand-red-50 hover:text-brand-red-600"
                >
                  <LogOut className="h-4.5 w-4.5 text-slate-400" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`flex min-w-0 flex-1 flex-col ${isMessagingRoute ? "overflow-hidden" : "overflow-y-auto"}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open dashboard navigation"
                aria-expanded={isMobileOpen}
                onClick={() => setIsMobileOpen(true)}
                className="rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <div className="hidden items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400 sm:flex">
                  <span>UGCFY</span>
                  <span>/</span>
                  <span className="truncate text-slate-700">{currentItem?.name ?? "Dashboard"}</span>
                </div>
                <h1 className="truncate text-base font-extrabold text-slate-950 sm:hidden">
                  {currentItem?.name ?? "Dashboard"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPricingOpen(true)}
                className="hidden min-h-10 items-center gap-2 rounded-2xl bg-brand-black px-4 text-xs font-extrabold text-white transition hover:bg-brand-red-700 sm:flex"
              >
                
                <span>Go Plus</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Open notifications"
                  aria-expanded={showNotifications}
                  onClick={() => setShowNotifications((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <Bell className="h-4.5 w-4.5" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <button
                        type="button"
                        aria-label="Close notifications"
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute right-0 z-50 mt-2 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl"
                      >
                        <p className="text-sm font-extrabold text-slate-950">Notifications</p>
                        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs font-semibold text-slate-500">
                          No new notifications.
                        </p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  type="button"
                  aria-label="Open profile menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((value) => !value)}
                  className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pr-2 text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-red-50 text-xs font-extrabold text-brand-red-600">
                    {initials}
                  </span>
                  <span className="hidden max-w-36 truncate text-xs font-extrabold sm:inline">{brandName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <button
                        type="button"
                        aria-label="Close profile menu"
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        className="absolute right-0 z-50 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl"
                      >
                        <div className="border-b border-slate-100 p-3">
                          <p className="truncate text-sm font-extrabold text-slate-950">{brandName}</p>
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{brand.email || "No email on file"}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileOpen(false);
                              handleLogout();
                            }}
                            className="flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-xs font-bold text-brand-red-600 transition hover:bg-brand-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className={`flex-1 ${isMessagingRoute ? "min-h-0 p-0" : "px-4 py-6 sm:px-6 lg:px-8"}`}>
          {brand.kyc_status === "draft" && (
            <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-950">Your profile is incomplete</h2>
                <p className="mt-1 text-xs font-medium text-slate-600">Complete your brand profile and verification to unlock the full workflow.</p>
              </div>
              <Link href="/dashboard/profile" className="rounded-2xl bg-brand-black px-4 py-2 text-center text-xs font-extrabold text-white">
                Complete Profile
              </Link>
            </div>
          )}

          <div className={isMessagingRoute ? "h-full min-h-0" : "mx-auto w-full max-w-7xl"}>
            <ErrorBoundary name="DashboardLayout">{children}</ErrorBoundary>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {isPricingOpen && <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
