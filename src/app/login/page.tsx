"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "@/components/ui/PasswordInput";

function getSafeNext(next: string | null) {
  if (!next) return "/dashboard";
  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";
  if (next.startsWith("/api")) return "/dashboard";
  return next;
}

function getLoginErrorMessage(error: string | null) {
  if (!error) return "";
  if (error.startsWith("oauth_") || error === "missing_oauth_code" || error === "session_missing") {
    return "Google sign-in could not be completed. Please try again.";
  }
  if (error === "brand_profile_duplicate") {
    return "We found more than one brand profile for this account. Please contact support.";
  }
  if (error === "brand_inactive") {
    return "This brand account is not active. Please contact support.";
  }
  return "We could not complete sign-in. Please try again.";
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const displayErrorMsg = errorMsg || getLoginErrorMessage(searchParams.get("error"));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      const nextPath = getSafeNext(searchParams.get("next"));
      router.replace(nextPath);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoadingProvider("google");

    const origin = window.location.origin;
    console.log("Google OAuth redirectTo:", `${origin}/auth/callback`);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setErrorMsg("Google sign-in could not be completed. Please try again.");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center mb-16">
            <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={160} height={45} className="h-10 w-auto object-contain" priority />
          </Link>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
          <p className="text-slate-500 mb-8">Log in to your account to manage your campaigns.</p>

          <button 
            type="button" 
            onClick={handleGoogleLogin} 
            disabled={loadingProvider === "google"}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors mb-6 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
          </button>
          {displayErrorMsg && <p className="text-red-500 text-xs font-bold mb-4">{displayErrorMsg}</p>}

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400">or</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="john@company.com" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">Forgot password?</a>
              </div>
              <PasswordInput autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#0A0A0A] hover:bg-black text-white flex items-center justify-center gap-2 group text-lg px-8 py-4 mt-8 rounded-[14px] shadow-xl transition-all disabled:opacity-75">
              {loading ? "Logging In..." : "Log In"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don&apos;t have an account? <Link href="/register" className="text-[var(--color-primary)] hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Team Collaboration" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg">
            <h3 className="text-2xl font-bold mb-4">Scale your creator pipeline.</h3>
            <p className="text-lg text-white/80 leading-relaxed">
              &quot;We used to spend 20 hours a week sourcing and emailing creators. Now the UGC FY engine does it automatically while we sleep.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
