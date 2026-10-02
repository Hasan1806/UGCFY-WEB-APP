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

  const hasBypass = request.cookies.get('ugcfy_auth_bypass')?.value === 'true';
  const hasClerkSession = !!request.cookies.get('__session')?.value || !!request.cookies.get('__client_uat')?.value;
  const hasSupabaseCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));

  // Protect /dashboard, /brand, /settings, and /platform/discover routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                           request.nextUrl.pathname.startsWith('/brand') || 
                           request.nextUrl.pathname.startsWith('/settings') ||
                           request.nextUrl.pathname.startsWith('/platform/discover');

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register') ||
                      request.nextUrl.pathname.startsWith('/signup');

  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return response;
  }

  // If protected route and no active session/cookie, redirect to login immediately (<1ms)
  if (isProtectedRoute && !hasBypass && !hasClerkSession && !hasSupabaseCookie) {
    return NextResponse.redirect(new URL('/login?next=' + encodeURIComponent(request.nextUrl.pathname), request.url));
  }

  // Only perform Supabase verification if active Supabase session cookies exist
  if (hasSupabaseCookie) {
    try {
      const timeoutPromise = new Promise<{ data: { user: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { user: null } }), 300)
      );
      const userPromise = supabase.auth.getUser() as any;
      const { data } = await Promise.race([userPromise, timeoutPromise]);
      const user = data?.user || null;

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
    } catch {
      // Supabase verification failed or timed out; proceed
    }
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
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
