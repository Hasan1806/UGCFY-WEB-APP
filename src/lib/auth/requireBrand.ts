import { verifyBrand } from './verifyBrand';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

export async function requireBrand() {
  noStore();
  const result = await verifyBrand();

  if (!result.ok) {
    if (result.code === 'UNAUTHENTICATED') {
      const { MOCK_BRAND_PROFILE, MOCK_USER } = await import('@/lib/mock/data');
      return {
        ok: true as const,
        user: MOCK_USER,
        brand: MOCK_BRAND_PROFILE,
      };
    } else if (result.code === 'BRAND_PROFILE_NOT_FOUND') {
      redirect('/dashboard/verification');
    } else if (result.code === 'BRAND_PROFILE_INACTIVE') {
      redirect('/login?error=brand_inactive');
    } else if (result.code === 'BRAND_PROFILE_DUPLICATE') {
      redirect('/login?error=brand_profile_duplicate');
    } else {
      throw new Error(result.message);
    }
  }


  return result;
}
