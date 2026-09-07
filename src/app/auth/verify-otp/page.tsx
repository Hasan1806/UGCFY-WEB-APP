"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type PendingSignup = {
  firstName: string;
  lastName: string;
  email: string;
  passwordSet?: boolean;
};

function getPendingSignup(emailParam: string | null): PendingSignup {
  if (typeof window === "undefined") {
    return { firstName: "", lastName: "", email: emailParam || "", passwordSet: false };
  }

  try {
    const stored = sessionStorage.getItem("pendingBrandSignup");
    if (stored) {
      const parsed = JSON.parse(stored) as PendingSignup;
      return {
        firstName: parsed.firstName || "",
        lastName: parsed.lastName || "",
        email: parsed.email || emailParam || "",
        passwordSet: Boolean(parsed.passwordSet),
      };
    }
  } catch {
    // Ignore malformed client storage and fall back to the query string.
  }

  return { firstName: "", lastName: "", email: emailParam || "", passwordSet: false };
}

function OtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [pendingSignup, setPendingSignup] = React.useState<PendingSignup>({ 
    firstName: "", 
    lastName: "", 
    email: searchParams.get("email") || "", 
    passwordSet: false 
  });
  
  React.useEffect(() => {
    // eslint-disable-next-line
    setPendingSignup(getPendingSignup(searchParams.get("email")));
  }, [searchParams]);
  const [otp, setOtp] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  const getCooldownKey = (emailStr: string) => `ugcfy_brand_otp_sent:${emailStr.trim().toLowerCase()}`;

  React.useEffect(() => {
    if (pendingSignup.email) {
      const lastSentStr = localStorage.getItem(getCooldownKey(pendingSignup.email));
      if (lastSentStr) {
        const lastSent = parseInt(lastSentStr, 10);
        const remaining = Math.max(0, 60 - Math.floor((Date.now() - lastSent) / 1000));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCooldown(remaining);
      }
    }
  }, [pendingSignup.email]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMsg("");
    setMessage("");

    if (!pendingSignup.email) {
      setErrorMsg("Please start signup again with your work email.");
      return;
    }

    if (!otp.trim()) {
      setErrorMsg("Please enter the OTP sent to your work email.");
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingSignup.email,
        token: otp.trim(),
        type: "email",
      });

      if (error) {
        throw new Error("Invalid or expired verification code. Please request a new code.");
      }

      router.replace(`/auth/set-password?email=${encodeURIComponent(pendingSignup.email)}`);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "We could not verify this code. Please check the OTP and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setMessage("");

    if (!pendingSignup.email) {
      setErrorMsg("Please start signup again with your work email.");
      return;
    }
    if (isResending || cooldown > 0) return;

    setIsResending(true);
    try {
      const cleanEmail = pendingSignup.email.trim().toLowerCase();
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        const match = error.message.match(/wait\s+(\d+)s/i) || error.message.match(/after\s+(\d+)\s+seconds?/i);
        if (error.status === 429 || match) {
          const secs = match ? parseInt(match[1] || "60", 10) : 60;
          setCooldown(secs);
          localStorage.setItem(getCooldownKey(cleanEmail), (Date.now() - (60 - secs) * 1000).toString());
          throw new Error(`Please wait ${secs}s before requesting another OTP.`);
        }
        throw error;
      }
      
      setCooldown(60);
      localStorage.setItem(getCooldownKey(cleanEmail), Date.now().toString());
      setMessage("A new OTP has been sent to your work email.");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
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
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Verify your email</h1>
          <p className="text-slate-500 mb-8">
            Enter the OTP sent to <span className="font-bold text-slate-800">{pendingSignup.email || "your work email"}</span>.
          </p>

          <form className="space-y-5" onSubmit={handleVerify}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email OTP</label>
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50"
                placeholder="Enter OTP"
              />
            </div>

            {errorMsg && <p className="text-red-600 text-sm font-bold">{errorMsg}</p>}
            {message && <p className="text-emerald-600 text-sm font-bold">{message}</p>}

            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
              {!isVerifying && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            <div className="pt-6 text-center border-t border-slate-100">
              <p className="text-slate-500 mb-4">Didn&apos;t receive the code?</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || cooldown > 0}
                className="text-sm font-bold text-[#E11D48] hover:text-[#BE123C] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Click to resend OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Verification workspace"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <OtpForm />
    </Suspense>
  );
}
