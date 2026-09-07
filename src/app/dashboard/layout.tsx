import { requireBrand } from "@/lib/auth/requireBrand";
import { createClient } from "@/lib/supabase/server";
import { getBrandAccessStatus } from "@/lib/auth/getBrandAccessStatus";
import DashboardClientLayout from "./DashboardClientLayout";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Strongly protect the dashboard routes on the server
  const brandSession = await requireBrand();
  const accessStatus = getBrandAccessStatus(brandSession.brand);

  if (accessStatus !== "approved") {
    return (
      <main className="min-h-screen bg-[#FDFBFB]">
        {children}
      </main>
    );
  }

  const supabase = await createClient();
  let pocCount = 0;
  let subscriptionStatus = "free";

  try {
    const { count } = await supabase
      .from("brand_poc")
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brandSession.brand.id);

    pocCount = count ?? 0;
  } catch {
    pocCount = 0;
  }

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
  
  return (
    <DashboardClientLayout 
      brand={{
        id: brandSession.brand.id,
        user_id: brandSession.brand.user_id ?? null,
        email: brandSession.user.email ?? brandSession.brand.email ?? null,
        company_name: brandSession.brand.company_name ?? null,
        brand_name: brandSession.brand.brand_name ?? null,
        kyc_status: brandSession.brand.kyc_status ?? null,
        access_status: accessStatus,
        poc_count: pocCount,
        subscription_status: subscriptionStatus,
      }}
    >
      {children}
    </DashboardClientLayout>
  );
}
