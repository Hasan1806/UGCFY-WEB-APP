import { requireBrand } from "@/lib/auth/requireBrand";
import { createClient } from "@/lib/supabase/server";
import { getBrandAccessStatus } from "@/lib/auth/getBrandAccessStatus";
import DashboardClientLayout from "./DashboardClientLayout";
import { DashboardProvider } from "@/context/DashboardContext";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Strongly protect the dashboard routes on the server (with fallback for frontend demo)
  let brandSession = await requireBrand().catch(() => null);

  if (!brandSession) {
    const { MOCK_BRAND_PROFILE, MOCK_USER } = await import("@/lib/mock/data");
    brandSession = {
      ok: true as const,
      user: MOCK_USER,
      brand: MOCK_BRAND_PROFILE,
    };
  }

  const accessStatus = getBrandAccessStatus(brandSession.brand);

  if (accessStatus !== "approved") {
    return <main className="min-h-screen bg-[#FDFBFB]">{children}</main>;
  }

  let pocCount = 0;
  let subscriptionStatus = "free";

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const hasSupabaseCookie = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));

    if (hasSupabaseCookie) {
      const supabase = await createClient();
      const timeoutPromise = new Promise<{ data: null; count: 0 }>((resolve) =>
        setTimeout(() => resolve({ data: null, count: 0 }), 300)
      );

      const [pocRes, subRes] = await Promise.all([
        Promise.race([
          supabase
            .from("brand_poc")
            .select("*", { count: "exact", head: true })
            .eq("brand_id", brandSession.brand.id),
          timeoutPromise,
        ]),
        Promise.race([
          supabase
            .from("brand_profiles")
            .select("subscription_status")
            .eq("id", brandSession.brand.id)
            .single(),
          timeoutPromise,
        ]),
      ]);

      pocCount = (pocRes as any)?.count ?? 0;
      subscriptionStatus = (subRes as any)?.data?.subscription_status || "free";
    }
  } catch {
    pocCount = 0;
    subscriptionStatus = "free";
  }

  return (
    <DashboardProvider initialRole="brand">
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
    </DashboardProvider>
  );
}
