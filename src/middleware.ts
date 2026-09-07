import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = ["/", "/login", "/pending-approval", "/unauthorized"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase environment variables are missing, pass through to avoid fatal 500 error
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute = request.nextUrl.pathname === "/" || PUBLIC_ROUTES.some((route) => route !== "/" && request.nextUrl.pathname.startsWith(route));

  // If user is not logged in and route is not public, redirect to login
  if (!user && !isPublicRoute && !request.nextUrl.pathname.startsWith("/_next") && !request.nextUrl.pathname.includes('.')) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in, check profile for approval and role
  if (user && !request.nextUrl.pathname.startsWith("/_next") && !request.nextUrl.pathname.includes('.')) {
    // Fetch user profile to check status and role
    const { data: profile } = await supabase
      .from("profiles")
      .select("status, approved, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      const isApproved = profile.approved === true || profile.status === "approved";

      // If not approved, and trying to access anything other than public routes, redirect to pending
      if (!isApproved && request.nextUrl.pathname !== "/pending-approval" && request.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/pending-approval", request.url));
      }

      // Check roles for specific routes
      if (isApproved && request.nextUrl.pathname.startsWith("/brand") && profile.role !== "brand" && profile.role !== "super_admin" && profile.role !== "admin") {
         return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      
      // If approved and logged in, redirect away from login/pending pages to dashboard
      if (isApproved && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/pending-approval")) {
         if (profile.role === 'brand' || profile.role === 'admin' || profile.role === 'super_admin') {
             return NextResponse.redirect(new URL("/brand/dashboard", request.url));
         } else {
             // Default redirect if they are some other approved role
             return NextResponse.redirect(new URL("/", request.url));
         }
      }
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
