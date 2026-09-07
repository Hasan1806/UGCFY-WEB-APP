import { redirect } from "next/navigation";
import { getBrandDashboardData } from "@/lib/dashboard/getBrandDashboardData";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { createClient } from "@/lib/supabase/server";
import { BRAND_DASHBOARD_PATH, getBrandRoutingDecision } from "@/lib/auth/brandRouting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const decision = await getBrandRoutingDecision(supabase, user.id);

  if (!decision.ok) {
    throw new Error(decision.message);
  }

  if (decision.redirectTo !== BRAND_DASHBOARD_PATH) {
    redirect(decision.redirectTo);
  }

  const data = await getBrandDashboardData();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <DashboardOverview data={data} />
    </div>
  );
}
