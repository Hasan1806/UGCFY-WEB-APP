"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  FolderOpen,
  MessageSquareText,
  Search,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  Video,
} from "lucide-react";
import { BrandDashboardData } from "@/lib/dashboard/getBrandDashboardData";
import { DashboardCard } from "./DashboardCard";
import { DashboardEmptyState } from "./DashboardEmptyState";
import { DashboardStatusBadge } from "./DashboardStatusBadge";
import { normalizeStatus } from "@/lib/dashboard/dashboardSafety";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";
import { PricingButton } from "./PricingButton";

interface Props {
  data: BrandDashboardData;
}

const quickActions = [
  { label: "Create Campaign", href: "/dashboard/campaigns", icon: Video },
  { label: "Explore Inspiration", href: "/dashboard/inspiration", icon: FolderOpen },
  { label: "Discover Creators", href: "/dashboard/creators", icon: Search },
  { label: "Add Team/POC", href: "/dashboard/team", icon: UsersRound },
  { label: "Complete Verification", href: "/dashboard/verification", icon: ShieldCheck },
  { label: "View Approvals", href: "/dashboard/approvals", icon: BadgeCheck },
];

export function DashboardOverview({ data }: Props) {
  const hasIncompleteSetup = data.onboarding.percentage < 100;
  const setupCta = data.onboarding.steps.find((step) => !step.completed);
  const verificationLabel = data.onboarding.steps.find((step) => step.key === "kyc")?.completed
    ? "Verified"
    : "Verification pending";

  const metricCards = [
    {
      title: "Active Campaigns",
      value: data.availability.campaignsTable ? data.metrics.activeCampaigns : "-",
      note: data.availability.campaignsTable ? "Running live" : "Campaigns table unavailable",
      icon: Video,
    },
    {
      title: "Shortlisted Creators",
      value: data.availability.shortlistsTable ? data.metrics.shortlistedCreators : "-",
      note: data.availability.shortlistsTable ? "Saved for campaigns" : "Shortlists table unavailable",
      icon: UserRoundCheck,
    },
    {
      title: "Pending Approvals",
      value: data.metrics.pendingApprovals,
      note: "Submissions awaiting review",
      icon: BadgeCheck,
    },
    {
      title: "Total Spend",
      value: data.metrics.totalSpend !== null ? `₹${formatDashboardNumber(data.metrics.totalSpend)}` : "₹0",
      note: data.metrics.totalSpend !== null ? "Recorded payments" : "No payments recorded",
      icon: CreditCard,
    },
    {
      title: "Unread Messages",
      value: data.metrics.unreadMessages ?? 0,
      note: data.metrics.unreadMessages === null ? "Unread tracking not configured" : "Needs response",
      icon: MessageSquareText,
    },
    {
      title: "Content Delivered",
      value: data.metrics.contentDelivered,
      note: "Approved creator submissions",
      icon: FolderOpen,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-brand-red-100 bg-brand-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-red-600">
                Brand command center
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
                <ShieldCheck className="h-3.5 w-3.5" />
                {verificationLabel}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Welcome back, {data.brand.companyName || "Brand"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
              Manage setup, creator discovery, campaign workflow, approvals, payments, and content performance from one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              href={setupCta?.href || "/dashboard/campaigns"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-700"
            >
              {setupCta?.label || "Create Campaign"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <PricingButton
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-800 transition hover:border-brand-red-200 hover:text-brand-red-600"
            />
          </div>
        </div>
      </section>

      {data.campaigns.some(c => normalizeStatus(c.payment_status) === "pending") && (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 shadow-sm sm:p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-extrabold text-amber-950">Payment required</h2>
            </div>
            <p className="text-sm font-medium text-amber-800">
              Complete payment to launch campaign
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-600 px-6 text-sm font-extrabold text-white transition hover:bg-amber-700 whitespace-nowrap"
          >
            Continue Payment
          </Link>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <DashboardCard className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">Account Setup</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Complete the core steps before scaling creator collaborations.
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-extrabold text-slate-950">{data.onboarding.percentage}%</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Complete</p>
            </div>
          </div>
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand-red-600 transition-all" style={{ width: `${data.onboarding.percentage}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5">
            {data.onboarding.steps.map((step, index) => (
              <Link
                key={step.key}
                href={step.href}
                className={`rounded-2xl border p-3 transition ${
                  step.completed
                    ? "border-slate-200 bg-slate-50 text-slate-500"
                    : "border-brand-red-100 bg-brand-red-50 text-slate-950 hover:border-brand-red-200"
                }`}
              >
                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold shadow-sm">
                  {step.completed ? <CheckCircle2 className="h-4 w-4 text-brand-red-600" /> : index + 1}
                </div>
                <p className="text-xs font-extrabold leading-5">{step.label}</p>
              </Link>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">Subscription</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Go Plus status and limits.</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red-50 text-brand-red-600">
              
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Current plan</p>
            <p className="mt-1 text-xl font-extrabold text-slate-950">Free</p>
            <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
              Upgrade when your brand needs more POCs, higher campaign volume, or consolidated billing support.
            </p>
          </div>
        </DashboardCard>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-slate-500">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex min-h-28 flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-red-200 hover:text-brand-red-600"
              >
                <Icon className="h-5 w-5 text-brand-red-600" />
                <span className="text-sm font-extrabold text-slate-950">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <DashboardCard key={metric.title} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{metric.title}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-brand-red-600">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-slate-950">{metric.value}</p>
              <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{metric.note}</p>
            </DashboardCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.8fr]">
        <DashboardCard className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-950">Campaign Metrics</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">Latest campaign activity from Supabase.</p>
            </div>
            {data.campaigns.length > 0 && (
              <Link href="/dashboard/campaigns" className="text-xs font-extrabold text-brand-red-600">
                View all
              </Link>
            )}
          </div>
          {!data.availability.campaignsTable ? (
            <DashboardEmptyState
              title="Campaign Manager unavailable"
              description="The campaigns service is currently being configured."
              icon={Video}
            />
          ) : data.campaigns.length === 0 ? (
            <DashboardEmptyState
              title="No campaigns yet"
              description="Create your first campaign to begin inviting creators and tracking submissions."
              icon={Video}
              ctaLabel="Create Campaign"
              ctaHref="/dashboard/campaigns"
            />
          ) : (
            <div className="space-y-3">
              {data.campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-red-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-950">{campaign.title}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {campaign.budget ? `₹${formatDashboardNumber(campaign.budget)}` : "No budget set"} · {formatDashboardDate(campaign.createdAt)}
                    </p>
                  </div>
                  <DashboardStatusBadge status={campaign.status} />
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard className="p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-950">Pending Actions</h2>
            {data.pendingActions.length === 0 && !hasIncompleteSetup ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                No urgent actions right now.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {data.pendingActions.map((action) => (
                  <Link
                    key={`${action.title}-${action.href}`}
                    href={action.href}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-red-200"
                  >
                    <Clock3 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-red-600" />
                    <span>
                      <span className="block text-sm font-extrabold text-slate-950">{action.title}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{action.description}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </DashboardCard>

          <DashboardCard className="p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-950">Recent Activity</h2>
            {data.recentActivity.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                <FileCheck2 className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-3 text-sm font-extrabold text-slate-700">No activity yet</p>
                <p className="mt-1 text-xs font-medium text-slate-500">Activity appears as your team sets up campaigns.</p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {data.recentActivity.map((activity) => (
                  <div key={`${activity.title}-${activity.timestamp}`} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-red-600" />
                    <div>
                      <p className="text-sm font-extrabold text-slate-950">{activity.title}</p>
                      <p className="mt-0.5 text-xs font-medium text-slate-500">{activity.description}</p>
                      <p className="mt-1 text-[11px] font-bold text-slate-400">{formatDashboardDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
