import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getBrandAccessStatus } from './lib/auth/getBrandAccessStatus';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase environment variables are missing, allow request to pass through
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /dashboard, /brand, and /settings routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/brand') || 
                           request.nextUrl.pathname.startsWith('/settings');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/signup');

  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return response;
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login?next=' + request.nextUrl.pathname, request.url));
  }

  if (
    user &&
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !request.nextUrl.pathname.startsWith('/dashboard/verification')
  ) {
    const [{ data: brandProfiles }, { data: profiles }] = await Promise.all([
      supabase.from('brand_profiles').select('*').eq('user_id', user.id).limit(1),
      supabase.from('profiles').select('*').eq('id', user.id).limit(1)
    ]);

    const mergedProfile = { ...brandProfiles?.[0], ...profiles?.[0] };

    if (getBrandAccessStatus(mergedProfile) !== 'approved') {
      return NextResponse.redirect(new URL('/dashboard/verification', request.url));
    }
  }

  if (isAuthRoute && user) {
    const [{ data: brandProfiles }, { data: profiles }] = await Promise.all([
      supabase.from('brand_profiles').select('*').eq('user_id', user.id).limit(1),
      supabase.from('profiles').select('*').eq('id', user.id).limit(1)
    ]);

    const mergedProfile = { ...brandProfiles?.[0], ...profiles?.[0] };

    const redirectPath = getBrandAccessStatus(mergedProfile) === 'approved'
      ? '/dashboard'
      : '/dashboard/verification';

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
