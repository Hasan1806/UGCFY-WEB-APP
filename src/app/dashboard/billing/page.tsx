import { redirect } from "next/navigation";
import { CreditCard, ReceiptText } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { formatDashboardDate } from "@/lib/dashboard/formatDashboardDate";
import { formatDashboardNumber } from "@/lib/dashboard/formatDashboardNumber";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";
import { PricingButton } from "@/components/dashboard/PricingButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PaymentRow = {
  id: string;
  campaign_id?: string | null;
  amount?: number | null;
  currency?: string | null;
  status?: string | null;
  purpose?: string | null;
  provider?: string | null;
  transaction_id?: string | null;
  provider_order_id?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
  campaignTitle?: string | null;
};

export default async function BillingPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let payments: PaymentRow[] = [];
  let subscriptionStatus = "free";

  try {
    const { data: brandProfile } = await supabase
      .from("brand_profiles")
      .select("subscription_status")
      .eq("id", brandId)
      .single();

    subscriptionStatus = brandProfile?.subscription_status || "free";

    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    const paymentRows = data ?? [];
    const campaignIds = Array.from(
      new Set(paymentRows.map((payment) => payment.campaign_id).filter(Boolean))
    );

    let campaignTitleById = new Map<string, string>();
    if (campaignIds.length > 0) {
      const { data: campaignRows } = await supabase
        .from("campaigns")
        .select("id, title")
        .in("id", campaignIds);

      campaignTitleById = new Map(
        (campaignRows ?? []).map((campaign) => [campaign.id, campaign.title ?? "Untitled campaign"])
      );
    }

    payments = paymentRows.map((payment) => ({
      ...payment,
      campaignTitle: payment.campaign_id ? campaignTitleById.get(payment.campaign_id) ?? null : null,
    }));
  } catch (err) {
    console.warn("[Billing] handled optional payments query:", err);
  }

  const totalSpend = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const pendingPayments = payments.filter((payment) => (payment.status || "").toLowerCase() === "pending").length;
  const failedPayments = payments.filter((payment) => (payment.status || "").toLowerCase() === "failed").length;

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="Billing & Payments"
        description="Manage Go Plus status, campaign payments, invoices, and transaction history."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <DashboardCard className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Current plan</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                {subscriptionStatus === "free" ? "Free" : "Go Plus"}
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                Upgrade when your team needs higher POC limits, consolidated billing, and priority campaign workflows.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red-50 text-brand-red-600">
              
            </div>
          </div>
          <PricingButton className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand-black px-4 text-sm font-extrabold text-white transition hover:bg-brand-red-700" />
        </DashboardCard>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <DashboardCard className="p-5">
            <CreditCard className="h-5 w-5 text-brand-red-600" />
            <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Total spend</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">₹{formatDashboardNumber(totalSpend)}</p>
          </DashboardCard>
          <DashboardCard className="p-5">
            <ReceiptText className="h-5 w-5 text-brand-red-600" />
            <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Transactions</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{payments.length}</p>
          </DashboardCard>
          <DashboardCard className="p-5">
            <ReceiptText className="h-5 w-5 text-brand-red-600" />
            <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Pending</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">{pendingPayments}</p>
            {failedPayments > 0 && <p className="mt-1 text-xs font-bold text-red-600">{failedPayments} failed</p>}
          </DashboardCard>
        </div>
      </div>

      {payments.length === 0 ? (
        <DashboardEmptyState
          title="No payments recorded yet"
          description="Campaign payments and invoices will appear here once billing activity begins."
          icon={CreditCard}
        />
      ) : (
        <DashboardCard className="overflow-hidden p-0">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-extrabold text-slate-950">Campaign Payments</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Campaign funds are reserved for the campaign. Creator payout remains pending until content approval.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
            {payments.map((payment) => {
              const status = (payment.status || "").toLowerCase();
              const fundsState =
                status === "paid" ? "Funds held for campaign" : status === "failed" ? "Payment failed" : "Payment pending";

              return (
                <div key={payment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-slate-950">
                        {payment.campaignTitle || payment.transaction_id || payment.id}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{payment.purpose || "campaign_funding"}</p>
                    </div>
                    <DashboardStatusBadge status={payment.status || "Recorded"} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-bold uppercase tracking-[0.12em] text-slate-400">Amount</p>
                      <p className="mt-1 font-extrabold text-slate-950">
                        {payment.currency || "INR"} {formatDashboardNumber(Number(payment.amount) || 0)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-bold uppercase tracking-[0.12em] text-slate-400">Created</p>
                      <p className="mt-1 font-extrabold text-slate-950">{formatDashboardDate(payment.created_at)}</p>
                    </div>
                  </div>
                  <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                    {fundsState}. Creator payout pending approval.
                  </p>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-5 py-4">Campaign</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Funds state</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">{payment.campaignTitle || payment.transaction_id || payment.id}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{payment.purpose || "campaign_funding"}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-500">{formatDashboardDate(payment.created_at)}</td>
                    <td className="px-5 py-4 font-extrabold text-slate-950">
                      {payment.currency || "INR"} {formatDashboardNumber(Number(payment.amount) || 0)}
                    </td>
                    <td className="px-5 py-4">
                      <DashboardStatusBadge status={payment.status || "Recorded"} />
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600">
                      {(payment.status || "").toLowerCase() === "paid"
                        ? "Funds held for campaign"
                        : (payment.status || "").toLowerCase() === "failed"
                          ? "Payment failed"
                          : "Payment pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}
    </div>
  );
}
