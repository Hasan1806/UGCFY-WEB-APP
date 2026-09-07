/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { UsersRound } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { PocClient, type PocListItem } from "../poc/PocClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let pocs: PocListItem[] = [];
  let tableMissing = false;
  let subscriptionStatus = "free";

  try {
    const { data: brandProfile } = await supabase
      .from("brand_profiles")
      .select("subscription_status")
      .eq("id", brandId)
      .single();

    subscriptionStatus = brandProfile?.subscription_status || "free";

    const { data, error } = await supabase
      .from("brand_poc")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        tableMissing = true;
      } else {
        console.error("[Team & POC] Error fetching POCs:", error);
      }
    } else if (data) {
      pocs = data.map((poc: any) => ({
        id: poc.id,
        brand_id: poc.brand_id,
        fullName: poc.full_name ?? poc.name ?? "Unnamed contact",
        workEmail: poc.work_email ?? poc.email ?? "No work email",
        phone: poc.phone ?? null,
        designation: poc.designation ?? poc.role_title ?? poc.role ?? null,
        isPrimary: Boolean(poc.is_primary),
        status: poc.status ?? "pending",
        createdAt: poc.created_at ?? null,
      }));
    }
  } catch (err) {
    console.warn("[Team & POC] handled error:", err);
  }

  if (tableMissing) {
    return (
      <div className="space-y-6">
        <DashboardPageHeader
          title="Team & POC"
          description="Manage brand team members, POCs, approval status, and communication access."
        />
        <DashboardEmptyState
          title="Team & POC unavailable"
          description="The Point of Contact database is currently being configured."
          icon={UsersRound}
        />
      </div>
    );
  }

  return <PocClient initialPocs={pocs} initialSubscription={subscriptionStatus} />;
}
