"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [cooldown, setCooldown] = React.useState(0);

  const getCooldownKey = (emailStr: string) => `ugcfy_brand_otp_sent:${emailStr.trim().toLowerCase()}`;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedFirstName) {
      setErrorMsg("Please enter your first name.");
      return;
    }

    if (!trimmedLastName) {
      setErrorMsg("Please enter your last name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMsg("Please enter a valid work email.");
      return;
    }

    const lastSentStr = localStorage.getItem(getCooldownKey(normalizedEmail));
    if (lastSentStr) {
      const lastSent = parseInt(lastSentStr, 10);
      const remaining = Math.max(0, 60 - Math.floor((Date.now() - lastSent) / 1000));
      if (remaining > 0) {
        setErrorMsg(`Please wait ${remaining}s before requesting another OTP.`);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
          data: {
            role: "brand",
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            full_name: `${trimmedFirstName} ${trimmedLastName}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-otp`,
        },
      });

      if (error) {
        throw error;
      }

      sessionStorage.setItem(
        "pendingBrandSignup",
        JSON.stringify({
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          email: normalizedEmail,
          passwordSet: false,
        })
      );

      localStorage.setItem(getCooldownKey(normalizedEmail), Date.now().toString());
      setCooldown(60);

      router.push(`/auth/verify-otp?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "We could not send the verification code. Please try again.";
      const match = errMsg.match(/wait\s+(\d+)s/i) || errMsg.match(/after\s+(\d+)\s+seconds?/i);
      if (match) {
        const secs = parseInt(match[1] || "60", 10);
        setCooldown(secs);
        localStorage.setItem(getCooldownKey(normalizedEmail), (Date.now() - (60 - secs) * 1000).toString());
        setErrorMsg(`Please wait ${secs}s before requesting another OTP.`);
      } else if (errMsg.toLowerCase().includes("rate limit") || errMsg.toLowerCase().includes("too many requests")) {
        setErrorMsg("Too many requests. Please wait before requesting another code.");
      } else {
        setErrorMsg(errMsg);
      }
    } finally {
      setLoading(false);
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

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Join thousands of brands scaling their creator pipeline.</p>

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
          {errorMsg && <p className="text-red-500 text-xs font-bold mb-4">{errorMsg}</p>}

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-sm font-medium text-slate-400">or continue with email</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">First Name</label>
                <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="John" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Work Email</label>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50" placeholder="john@company.com" />
            </div>

            <button 
              type="submit" 
              disabled={loading || cooldown > 0} 
              className="w-full btn-primary flex items-center justify-center gap-2 group text-lg px-8 py-4 mt-8 shadow-xl shadow-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Sending Code..." : cooldown > 0 ? `Wait ${cooldown}s` : "Send Verification Code"}
              {!loading && cooldown === 0 && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account? <Link href="/login" className="text-[var(--color-primary)] hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Dashboard" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Sarah" className="w-14 h-14 rounded-full border-2 border-white/50" />
              <div>
                <h4 className="font-bold text-lg">Sarah Jenkins</h4>
                <p className="text-white/70 text-sm">VP Marketing, Acme Corp</p>
              </div>
            </div>
            <p className="text-xl font-medium leading-relaxed">
              &quot;Switching to UGC FY completely transformed our acquisition pipeline. We dropped our CPA by 40% in the first month just by sourcing authentic creators at scale.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
