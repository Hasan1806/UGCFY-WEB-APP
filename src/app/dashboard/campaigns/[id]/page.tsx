import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BadgeIndianRupee, FileText, ShieldCheck, Wallet } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";
import { normalizeStatus } from "@/lib/dashboard/dashboardSafety";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetailsPage({ params }: PageProps) {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("brand_id", brandSession.brand.id)
    .single();

  if (error || !campaign) {
    notFound();
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("brand_id", brandSession.brand.id)
    .eq("campaign_id", campaign.id)
    .order("created_at", { ascending: false });

  const latestPayment = payments?.[0] ?? null;
  const status = normalizeStatus(campaign.status, "draft");
  const isPaymentPending = status === "pending_payment" || !latestPayment || normalizeStatus(latestPayment.status, "pending") !== "paid";
  const platforms = Array.isArray(campaign.platforms) ? campaign.platforms.join(", ") : "Platforms not specified";
  const deliverables = Array.isArray(campaign.deliverables) ? campaign.deliverables : [];

  return (
    <div className="space-y-6 pb-10">
      <Link href="/dashboard/campaigns" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" />
        Back to Campaign Manager
      </Link>

      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <DashboardStatusBadge status={campaign.status || "draft"} />
              {isPaymentPending && (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-700">
                  Payment required
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{campaign.title || "Untitled campaign"}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {platforms} · Created {formatDashboardDate(campaign.created_at)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:min-w-72">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Campaign Budget</p>
            <p className="mt-2 text-2xl font-extrabold text-slate-950">
              {campaign.currency || "INR"} {formatDashboardNumber(Number(campaign.budget) || 0)}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
              {isPaymentPending ? "Funds are not held yet. Complete payment before launch." : "Funds held for campaign. Creator payout pending approval."}
            </p>
          </div>
        </div>
      </DashboardCard>

      {isPaymentPending && (
        <DashboardCard className="border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red-600" />
              <div>
                <h2 className="text-base font-extrabold text-slate-950">Complete payment to launch this campaign</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  Campaign creation is payment-gated. Payment gateway setup is required before funds can be reserved for this campaign.
                </p>
              </div>
            </div>
            <Link href="/dashboard/billing" className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-brand-red-600 px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-700">
              Billing & Payments
            </Link>
          </div>
        </DashboardCard>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DashboardCard className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <FileText className="h-5 w-5 text-slate-400" />
            Creative Brief
          </h2>
          <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
            {campaign.description || "No campaign description provided yet."}
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Deliverables</p>
            {deliverables.length === 0 ? (
              <p className="mt-2 text-sm font-medium text-slate-500">No deliverables specified.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {deliverables.map((deliverable: { type?: string; details?: string }, index: number) => (
                  <li key={index} className="rounded-xl bg-white p-3 text-sm font-semibold text-slate-700">
                    {deliverable.details || deliverable.type || "Campaign deliverable"}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-950">
            <Wallet className="h-5 w-5 text-slate-400" />
            Payment State
          </h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Latest payment</p>
              <p className="mt-2 text-sm font-extrabold text-slate-950">{latestPayment ? latestPayment.status || "Recorded" : "No payment record"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Funds state</p>
              <p className="mt-2 text-sm font-extrabold text-slate-950">
                {isPaymentPending ? "Not paid" : "Held for campaign"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Creator payout</p>
              <p className="mt-2 flex items-center gap-2 text-sm font-extrabold text-slate-950">
                <BadgeIndianRupee className="h-4 w-4 text-brand-red-600" />
                Pending content approval
              </p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
