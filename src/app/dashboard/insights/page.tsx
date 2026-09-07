import { redirect } from "next/navigation";
import { BadgeCheck, CreditCard, Gauge, UserRoundCheck, Video } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";
import { normalizeStatus } from "@/lib/dashboard/dashboardSafety";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InsightsPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let campaignRows: Array<{ id: string; status?: string | null }> = [];
  let shortlistCount = 0;
  let approvedSubmissions = 0;
  let pendingSubmissions = 0;
  let totalSpend = 0;
  let hasAnyData = false;

  try {
    const { data: campaigns } = await supabase
      .from("campaigns")
      .select("id, status")
      .eq("brand_id", brandId);
    campaignRows = campaigns ?? [];
    hasAnyData = hasAnyData || campaignRows.length > 0;

    const campaignIds = campaignRows.map((campaign) => campaign.id);
    if (campaignIds.length > 0) {
      const { data: submissions } = await supabase
        .from("ugc_submissions")
        .select("status")
        .in("campaign_id", campaignIds);

      approvedSubmissions = (submissions ?? []).filter((submission) => normalizeStatus(submission.status) === "approved").length;
      pendingSubmissions = (submissions ?? []).filter((submission) => normalizeStatus(submission.status) === "pending").length;
      hasAnyData = hasAnyData || (submissions ?? []).length > 0;
    }

    const { count } = await supabase
      .from("brand_shortlists")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brandId);
    shortlistCount = count ?? 0;
    hasAnyData = hasAnyData || shortlistCount > 0;

    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("brand_id", brandId);
    totalSpend = (payments ?? []).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
    hasAnyData = hasAnyData || totalSpend > 0;
  } catch (err) {
    console.warn("[Insights] handled optional analytics query:", err);
  }

  const metrics = [
    { label: "Total Campaigns", value: campaignRows.length, icon: Video },
    { label: "Active Campaigns", value: campaignRows.filter((campaign) => normalizeStatus(campaign.status) === "active").length, icon: Gauge },
    { label: "Shortlisted Creators", value: shortlistCount, icon: UserRoundCheck },
    { label: "Pending Approvals", value: pendingSubmissions, icon: BadgeCheck },
    { label: "Content Delivered", value: approvedSubmissions, icon: BadgeCheck },
    { label: "Total Spend", value: `₹${formatDashboardNumber(totalSpend)}`, icon: CreditCard },
  ];

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="Insights"
        description="Track campaign volume, creator pipeline, approval flow, delivered content, and spend."
      />

      {!hasAnyData ? (
        <DashboardEmptyState
          title="No insights available yet"
          description="Insights will populate as campaigns, shortlists, payments, and submissions are created."
          icon={Gauge}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <DashboardCard key={metric.label} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{metric.label}</p>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-red-50 text-brand-red-600">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <p className="mt-5 text-3xl font-extrabold text-slate-950">{metric.value}</p>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
