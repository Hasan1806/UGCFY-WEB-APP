/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { createMinimalBrandProfile } from "@/lib/auth/brandRouting";
import { getBrandAccessStatus } from "@/lib/auth/getBrandAccessStatus";
import { KycClient } from "@/app/brand/kyc/KycClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VerificationPage() {
  let brandSession = await verifyBrand();

  if (!brandSession.ok) {
    if (brandSession.code === "BRAND_PROFILE_NOT_FOUND") {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login?next=/dashboard/verification");
      }

      await createMinimalBrandProfile(supabase, user);
      brandSession = await verifyBrand();
    }

    if (!brandSession.ok) {
      redirect("/login?next=/dashboard/verification");
    }
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let documents: any[] = [];
  let profile: any = null;
  let submission: any = null;

  try {
    const { data, error } = await supabase
      .from("brand_kyc_documents")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code !== "42P01" && !error.message?.includes("does not exist")) {
        console.error("[Verification] Error fetching documents:", error);
      } 
    } else {
      documents = data ?? [];
    }
  } catch (err) {
    console.warn("[Verification] handled error:", err);
  }

  try {
    const { data, error } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("id", brandId)
      .maybeSingle();

    if (error) {
      console.error("[Verification] Error fetching profile:", error);
    } else {
      profile = data;
    }
  } catch (err) {
    console.warn("[Verification] profile handled error:", err);
  }

  try {
    const { data, error } = await supabase
      .from("kyc_submissions")
      .select("*")
      .eq("user_id", brandSession.user.id)
      .maybeSingle();

    if (error) {
      if (error.code !== "42P01" && !error.message?.includes("does not exist")) {
        console.error("[Verification] Error fetching KYC submission:", error);
      }
    } else {
      submission = data;
    }
  } catch (err) {
    console.warn("[Verification] KYC submission handled error:", err);
  }

  const accessStatus = getBrandAccessStatus({
    ...profile,
    kyc_status: brandSession.brand.kyc_status,
  });

  return (
    <KycClient
      initialDocuments={documents}
      initialProfile={profile}
      initialSubmission={submission}
      userEmail={brandSession.user.email}
      accessStatus={accessStatus}
    />
  );
}
