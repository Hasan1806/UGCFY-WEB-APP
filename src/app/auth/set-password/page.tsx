"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, KeyRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";

type PendingSignup = {
  firstName: string;
  lastName: string;
  email: string;
};

function getPendingSignup(emailParam: string | null): PendingSignup {
  if (typeof window === "undefined") return { firstName: "", lastName: "", email: emailParam || "" };
  try {
    const stored = sessionStorage.getItem("pendingBrandSignup");
    if (stored) {
      const parsed = JSON.parse(stored) as PendingSignup;
      return {
        firstName: parsed.firstName || "",
        lastName: parsed.lastName || "",
        email: parsed.email || emailParam || "",
      };
    }
  } catch {
    // Ignore malformed storage.
  }
  return { firstName: "", lastName: "", email: emailParam || "" };
}

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [pendingSignup, setPendingSignup] = React.useState<PendingSignup>({ 
    firstName: "", 
    lastName: "", 
    email: searchParams.get("email") || "" 
  });
  
  React.useEffect(() => {
    // eslint-disable-next-line
    setPendingSignup(getPendingSignup(searchParams.get("email")));
  }, [searchParams]);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/register");
      }
    });
  }, [supabase.auth, router]);

  async function completeSignup() {
    const response = await fetch("/api/auth/complete-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: pendingSignup?.firstName || "",
        lastName: pendingSignup?.lastName || "",
        email: pendingSignup?.email || "",
      }),
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      const errorObj = new Error(result.error?.message || "Unable to complete signup.");
      (errorObj as Error & { code?: string }).code = result.error?.code;
      throw errorObj;
    }
    return result;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        throw new Error("Unable to set password. Please try again.");
      }

      await completeSignup();
      sessionStorage.removeItem("pendingBrandSignup");
      router.replace("/dashboard/verification");
      router.refresh();
    } catch (error: unknown) {
      if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "PROFILE_DUPLICATE") {
        sessionStorage.removeItem("pendingBrandSignup");
        router.replace("/dashboard/verification");
        router.refresh();
      } else {
        setErrorMsg(error instanceof Error ? error.message : "Unable to set password. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex items-center mb-16">
            <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={160} height={45} className="h-10 w-auto object-contain" priority />
          </Link>

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-[#E11D48]">
            <KeyRound className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Set your password</h1>
          <p className="text-slate-500 mb-8">Create a secure password before continuing to brand verification.</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <PasswordInput
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && <p className="text-red-600 text-sm font-bold">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#0A0A0A] hover:bg-black text-white flex items-center justify-center gap-2 group text-lg px-8 py-4 rounded-[14px] shadow-xl transition-all disabled:opacity-75"
            >
              {isSaving ? "Saving..." : "Continue to Verification"}
              {!isSaving && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Secure account setup"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}
