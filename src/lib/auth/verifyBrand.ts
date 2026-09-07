import { createClient } from '@/lib/supabase/server';

export type BrandSession = {
  user: {
    id: string;
    email: string | null;
  };
  brand: {
    id: string;
    user_id?: string | null;
    email?: string | null; // Using contact_email from DB
    company_name?: string | null;
    brand_name?: string | null;
    kyc_status?: string | null;
  };
};

export type VerifyBrandResult =
  | {
      ok: true;
      user: { id: string; email: string | null };
      brand: {
        id: string;
        user_id?: string | null;
        email?: string | null;
        company_name?: string | null;
        brand_name?: string | null;
        kyc_status?: string | null;
      };
    }
  | {
      ok: false;
      code: 
        | 'UNAUTHENTICATED' 
        | 'BRAND_PROFILE_NOT_FOUND' 
        | 'BRAND_PROFILE_DUPLICATE' 
        | 'BRAND_PROFILE_INACTIVE' 
        | 'BRAND_QUERY_FAILED'
        | 'BRAND_PROFILE_LINK_FAILED';
      message: string;
    };

export async function verifyBrand(): Promise<VerifyBrandResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { ok: false, code: 'UNAUTHENTICATED', message: userError?.message || 'Not authenticated' };
    }

    // Attempt to lookup by user_id first (primary link from app registration)
    const [brandResult, profileResult] = await Promise.all([
      supabase.from('brand_profiles').select('*').eq('user_id', user.id),
      supabase.from('profiles').select('kyc_status, approval_status').eq('id', user.id)
    ]);

    const { data: brandProfiles, error: brandError } = brandResult;
    const { data: profiles } = profileResult;

    if (brandError) {
      console.error('[verifyBrand] brand profile query failed', {
        message: brandError.message,
        code: brandError.code,
        details: brandError.details,
        hint: brandError.hint,
      });
      return { ok: false, code: 'BRAND_QUERY_FAILED', message: brandError.message };
    }

    if (!brandProfiles || brandProfiles.length === 0) {
      // If we wanted to fallback by contact_email, we could do it here. 
      // But we will just return NOT_FOUND to redirect to onboarding.
      return { ok: false, code: 'BRAND_PROFILE_NOT_FOUND', message: 'Brand profile not found' };
    }

    if (brandProfiles.length > 1) {
      console.error('[verifyBrand] duplicate brand profiles found', { userId: user.id });
      return { ok: false, code: 'BRAND_PROFILE_DUPLICATE', message: 'Multiple brand profiles found for this user' };
    }

    const brandProfile = brandProfiles[0]!;
    const profile = profiles?.[0];

    return {
      ok: true,
      user: { id: user.id, email: user.email || null },
      brand: {
        id: brandProfile.id,
        user_id: brandProfile.user_id,
        email: brandProfile.contact_email,
        company_name: brandProfile.company_name,
        brand_name: brandProfile.brand_name,
        kyc_status: profile?.kyc_status || brandProfile.kyc_status,
      }
    };
  } catch (error) {
    console.error('[verifyBrand] unexpected error', {
      message: error instanceof Error ? error.message : "Unknown error"
    });
    return { ok: false, code: 'BRAND_QUERY_FAILED', message: error instanceof Error ? error.message : "Unknown error" };
  }
}
