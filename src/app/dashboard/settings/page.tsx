import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, CreditCard, ShieldCheck, SlidersHorizontal, UsersRound } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardSettingsPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  let subscriptionStatus = "free";

  try {
    const { data } = await supabase
      .from("brand_profiles")
      .select("subscription_status")
      .eq("id", brandSession.brand.id)
      .single();

    subscriptionStatus = data?.subscription_status || "free";
  } catch {
    subscriptionStatus = "free";
  }

  const sections = [
    {
      title: "Brand Profile",
      description: "Edit public company details, profile assets, industry, and brand overview.",
      href: "/dashboard/profile",
      icon: SlidersHorizontal,
    },
    {
      title: "Team & POC",
      description: "Manage POCs, team access, approval status, and collaboration ownership.",
      href: "/dashboard/team",
      icon: UsersRound,
    },
    {
      title: "Verification",
      description: "Upload business documents and monitor verification progress.",
      href: "/dashboard/verification",
      icon: ShieldCheck,
    },
    {
      title: "Billing & Payments",
      description: "Review plan status, payment history, and Go Plus upgrade options.",
      href: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Notifications",
      description: "Notification preferences will appear here once delivery channels are configured.",
      href: "/dashboard/settings",
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <DashboardPageHeader
        title="Settings"
        description="Manage account, brand, team, verification, billing, and notification preferences."
      />

      <DashboardCard className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">Account</p>
            <h2 className="mt-2 text-xl font-extrabold text-slate-950">
              {brandSession.brand.company_name || brandSession.brand.brand_name || "Brand Account"}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{brandSession.user.email || "No email on file"}</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
            {subscriptionStatus === "free" ? "Free plan" : "Go Plus"}
          </span>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} href={section.href}>
              <DashboardCard className="h-full p-5 transition hover:border-brand-red-200">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-red-50 text-brand-red-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-base font-extrabold text-slate-950">{section.title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{section.description}</p>
              </DashboardCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
