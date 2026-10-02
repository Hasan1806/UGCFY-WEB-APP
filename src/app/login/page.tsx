"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Building2, AlertCircle, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn, useSignUp, useClerk, SignInButton } from "@clerk/nextjs";
import { PasswordInput } from "@/components/ui/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clerk = useClerk();
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn() as any;
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp() as any;

  const initialRole = searchParams.get("role") === "creator" ? "creator" : "brand";
  const [role, setRole] = useState<"brand" | "creator">(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "creator" || r === "brand") {
      setRole(r);
    }
  }, [searchParams]);

  const handleRoleChange = (newRole: "brand" | "creator") => {
    setRole(newRole);
    setErrorMessage(null);
    if (typeof window !== "undefined") {
      localStorage.setItem("ugcfy_user_role", newRole);
    }
  };

  // Real Clerk Email + Password Sign In
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (!isSignInLoaded) {
      setErrorMessage("Authentication service is loading. Please wait a moment.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });

        if (typeof window !== "undefined") {
          localStorage.setItem("ugcfy_user_email", email.trim());
          localStorage.setItem("ugcfy_user_role", role);
        }

        const nextPath = searchParams.get("next") || (role === "creator" ? "/ecosystem/creators" : "/dashboard");
        router.push(nextPath);
      } else {
        setErrorMessage(`Sign in incomplete (${result.status}). Additional verification required.`);
      }
    } catch (err: unknown) {
      console.error("Clerk Email Sign-in error:", err);
      const clerkErr = err as { errors?: Array<{ message?: string; longMessage?: string }>; message?: string };
      const msg = clerkErr?.errors?.[0]?.longMessage || clerkErr?.errors?.[0]?.message || clerkErr?.message || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center mb-8 group">
            <Image 
              src="/brand/ugcfy-logo.png" 
              alt="UGCFY" 
              width={150} 
              height={42} 
              className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-102" 
              priority 
            />
          </Link>

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Select Your Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Brand Card Option */}
              <button
                type="button"
                onClick={() => handleRoleChange("brand")}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col gap-1.5 cursor-pointer select-none ${
                  role === "brand"
                    ? "border-[#E11D48] bg-rose-50/70 shadow-[0_4px_16px_rgba(225,29,72,0.12)] ring-1 ring-[#E11D48]"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${role === "brand" ? "bg-[#E11D48] text-white" : "bg-slate-100 text-slate-700"}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  {role === "brand" && (
                    <div className="w-5 h-5 rounded-full bg-[#E11D48] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`text-[14px] font-bold ${role === "brand" ? "text-slate-900" : "text-slate-700"}`}>
                    Sign in as Brand
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    For brands &amp; agencies
                  </p>
                </div>
              </button>

              {/* Creator Card Option */}
              <button
                type="button"
                onClick={() => handleRoleChange("creator")}
                className={`relative p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col gap-1.5 cursor-pointer select-none ${
                  role === "creator"
                    ? "border-purple-600 bg-purple-50/70 shadow-[0_4px_16px_rgba(147,51,234,0.12)] ring-1 ring-purple-600"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${role === "creator" ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  {role === "creator" && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className={`text-[14px] font-bold ${role === "creator" ? "text-slate-900" : "text-slate-700"}`}>
                    Sign in as Creator
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    For creators &amp; influencers
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {role === "creator" ? "Creator Studio" : "Brand Workspace"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {role === "creator"
                ? "Sign in with Clerk to access campaigns, submissions & payouts."
                : "Sign in with Clerk to manage creator discovery, campaigns & analytics."}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Real Google / Clerk OAuth Modal Button */}
          <SignInButton 
            mode="modal" 
            forceRedirectUrl={role === "creator" ? "/ecosystem/creators" : "/dashboard"}
          >
            <button 
              type="button" 
              className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-5 shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer text-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span>Continue with Google as {role === "creator" ? "Creator" : "Brand"}</span>
            </button>
          </SignInButton>

          <div className="flex items-center gap-4 mb-5">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">or with email</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          {/* Real Clerk Email/Password Form */}
          <form className="space-y-4" onSubmit={handleEmailPasswordSignIn}>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {role === "creator" ? "Creator Email" : "Work Email"}
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 transition-all bg-slate-50/50 text-sm font-medium" 
                placeholder={role === "creator" ? "creator@example.com" : "name@company.com"} 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
              </div>
              <PasswordInput 
                autoComplete="current-password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[#E11D48] focus:ring-2 focus:ring-[#E11D48]/20 transition-all bg-slate-50/50 text-sm" 
                placeholder="Enter your password" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full text-white font-bold flex items-center justify-center gap-2 group text-sm px-6 py-3.5 mt-6 rounded-xl shadow-lg transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 ${
                role === "creator"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 shadow-purple-500/25"
                  : "bg-gradient-to-r from-[#E11D48] via-[#EF233C] to-[#BE123C] hover:opacity-95 shadow-rose-500/25"
              }`}
            >
              {loading ? "Authenticating..." : `Sign In as ${role === "creator" ? "Creator" : "Brand"}`}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-semibold text-slate-500">
            Don&apos;t have an account?{" "}
            <Link 
              href={`/register?role=${role}`} 
              className="text-[#E11D48] hover:underline font-bold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={role === "creator" 
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            : "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          } 
          alt="Auth visual" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg">
            <h3 className="text-2xl font-bold mb-3">
              {role === "creator" ? "Create. Collaborate. Earn." : "Scale your creator pipeline."}
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              {role === "creator"
                ? "Join thousands of vetted creators connecting with top brands, receiving direct creative briefs, and enjoying guaranteed payouts on UGCFY."
                : "Automate creator discovery, track campaign deliverables, and manage performance-driven UGC workflows from a single unified portal."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-medium">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

