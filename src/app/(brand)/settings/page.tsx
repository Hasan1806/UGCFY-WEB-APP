/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SettingsPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;

  let profile = {
    id: brandId,
    company_name: "",
    website_url: "",
    industry: "",
    phone: "",
    location: "",
    business_description: "",
    contact_email: brandSession.brand.email,
    subscription_status: "free"
  };

  let teamMembers: any[] = [];
  let tableMissing = false;

  try {
    // 1. Fetch Profile
    const { data: profileData, error: profileError } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("id", brandId)
      .single();

    if (profileError) {
      if (profileError.code === "42P01" || profileError.message?.includes("does not exist")) {
        tableMissing = true;
      } else if (profileError.code !== "PGRST116") {
        console.error("[Settings] Error fetching profile:", profileError);
      }
    } else if (profileData) {
      profile = {
        ...profile,
        company_name: profileData.company_name || "",
        website_url: profileData.website_url || "",
        industry: profileData.industry || "",
        phone: profileData.phone || "",
        location: profileData.location || "",
        business_description: profileData.business_description || "",
        subscription_status: profileData.subscription_status || "free"
      };
    }

    // 2. Fetch Team Members (brand_poc)
    if (!tableMissing) {
      const { data: pocData, error: pocError } = await supabase
        .from("brand_poc")
        .select("*")
        .eq("brand_id", brandId);

      if (pocError) {
        if (pocError.code === "42P01" || pocError.message?.includes("does not exist")) {
          // just ignore poc failure if table is missing independently
        } else {
          console.error("[Settings] Error fetching pocs:", pocError);
        }
      } else if (pocData) {
        teamMembers = pocData;
      }
    }
  } catch (err) {
    console.warn("[Settings] Catch error:", err);
  }

  if (tableMissing) {
    return (
      <div className="min-h-screen bg-slate-50/50 pb-12 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings Unavailable</h1>
            <p className="text-slate-500 text-xs mt-1.5 font-medium">The settings database is currently being configured.</p>
          </div>
        </div>
      </div>
    );
  }

  return <SettingsClient initialProfile={profile} initialTeamMembers={teamMembers} />;
}
