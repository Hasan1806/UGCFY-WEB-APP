import { NextResponse } from "next/server";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }
  
  const brandSession = await verifyBrand();
  if (!brandSession.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = brandSession.brand?.id || brandSession.user?.id;
  
  const { error } = await supabaseAdmin
    .from("brand_profiles")
    .update({ 
      kyc_status: "approved", 
      onboarding_completed: true,
      company_name: "Test Bypass Brand"
    })
    .eq("id", id);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also update profiles just in case
  await supabaseAdmin
    .from("profiles")
    .update({ kyc_status: "approved", approval_status: "approved", profile_completed: true })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
