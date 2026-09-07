"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { 
  ArrowRight, 
  Mail, 
  Building, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users,
  ArrowLeft
} from "lucide-react";

// Form Validation Schema
const requestAccessSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid work email address"),
  
  websiteUrl: z.string()
    .transform(val => {
      if (!val) return "";
      if (!/^https?:\/\//i.test(val)) return `https://${val}`;
      return val;
    })
    .refine(val => {
      if (!val) return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
});

type RequestAccessFormValues = z.infer<typeof requestAccessSchema>;
import { useRouter } from "next/navigation";

export default function RequestAccessPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedBrandName, setSubmittedBrandName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      companyName: "",
      email: "",
      
      websiteUrl: ""
    }
  });

  const onSubmit = async (data: RequestAccessFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSubmittedBrandName(data.companyName);

    try {
      // 1. Sign up the user in Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
          data: {
            role: "brand",
            full_name: data.companyName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-otp`,
        },
      });

      if (signUpError) {
        // Handle specific errors like user already registered
        if (signUpError.message.includes("already registered")) {
          setErrorMsg("This work email has already submitted an access request. Please check your email for updates or contact support.");
        } else {
          setErrorMsg(signUpError.message);
        }
        setIsLoading(false);
        return;
      }


      setIsSubmitted(true);
      reset();

      sessionStorage.setItem(
        "pendingBrandSignup",
        JSON.stringify({
          firstName: data.companyName,
          lastName: "Brand",
          email: data.email.toLowerCase(),
          passwordSet: false,
        })
      );

      if (signUpData?.session) {
        await fetch("/api/auth/complete-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            firstName: data.companyName,
            lastName: "Brand",
            email: data.email.toLowerCase(),
          }),
        });
        router.push("/dashboard/verification");
      } else {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email.toLowerCase())}`);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("An unexpected connection error occurred. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-screen flex overflow-hidden bg-white select-none">
      
      {/* LEFT SIDE (40%): Visual Sticky Pane with Exclusive branding */}
      <section className="hidden md:flex md:w-[40%] relative mesh-bg-gradient items-center justify-center p-8 overflow-hidden z-10">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="w-full max-w-md flex flex-col justify-between h-full relative z-20 text-white py-12">
          {/* Logo */}
          <Link href="/" className="flex items-center self-start cursor-pointer group">
            <Image src="/brand/ugcfy-logo.png" alt="UGCFY" width={160} height={45} className="h-10 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform" priority />
          </Link>

          {/* Floating Vetted Cards */}
          <div className="my-auto space-y-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <Users className="h-6 w-6 text-brand-red-200" />
              </div>
              <div>
                <p className="text-sm text-brand-red-100 font-medium">Curated Network Only</p>
                <h3 className="text-2xl font-bold mt-0.5">Top 1% Creators</h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="p-3 bg-white/10 rounded-xl">
                <TrendingUp className="h-6 w-6 text-brand-red-200" />
              </div>
              <div>
                <p className="text-sm text-brand-red-100 font-medium">Secure Brand Escrow</p>
                <h3 className="text-2xl font-bold mt-0.5">Zero-Risk Payouts</h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="backdrop-blur-md bg-white/10 border border-white/20 p-5 rounded-2xl shadow-xl relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-2 bg-brand-red-500 rounded-bl-xl text-[10px] uppercase font-bold tracking-wider opacity-85">
                Vetted Members
              </div>
              <p className="text-sm italic text-white/95 mt-1 leading-relaxed">
                &quot;UGCFY enforces absolute quality. Every creator is verified via video KYC and manual performance screens, cutting ad iteration costs by 60%.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  B
                </div>
                <div>
                  <p className="text-xs font-semibold">Blinkit Marketing</p>
                  <p className="text-[10px] text-white/60">Creative Lead</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Info */}
          <div className="text-xs text-white/60 flex items-center justify-between border-t border-white/10 pt-6">
            <span>© 2026 UGCFY. All rights reserved.</span>
            <div className="flex gap-3">
              <Link href="#" className="hover:text-white transition">Privacy</Link>
              <Link href="#" className="hover:text-white transition">Terms</Link>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE (60%): Request Access Container */}
      <section className="w-full md:w-[60%] flex items-center justify-center p-6 sm:p-12 md:p-24 relative overflow-y-auto bg-slate-50/50">
        
        {/* Soft decorative blur shapes */}
        <div className="absolute right-[-10%] top-[-10%] h-[30vw] w-[30vw] rounded-full bg-brand-red-50 blur-[120px] pointer-events-none" />
        <div className="absolute left-[10%] bottom-[-10%] h-[30vw] w-[30vw] rounded-full bg-slate-100 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-lg bg-white/80 backdrop-blur-md border border-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-slate-100/50 relative z-20">
          
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition mb-6 font-semibold cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          <AnimatePresence>
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Form Header */}
                <div className="mb-8 text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    Apply for Brand Access
                    
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    UGC FY is an exclusive network of vetted creators. Submit your brand details below, and our team will review your application within 24 hours.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-red-50/80 border border-red-100 flex items-start gap-3 text-red-700 text-xs font-semibold leading-relaxed"
                  >
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      Brand / Company Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="text"
                        {...register("companyName")}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-xs sm:text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white font-medium"
                        placeholder="e.g. Nike India"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
                      Work Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <input
                        type="email"
                        {...register("email")}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-xs sm:text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white font-medium"
                        placeholder="partnership@yourbrand.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Company Website</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        {...register("websiteUrl")}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all bg-slate-50"
                        placeholder="example.com"
                      />
                    </div>
                    {errors.websiteUrl && <p className="text-red-500 text-xs mt-1 font-medium">{errors.websiteUrl.message}</p>}
                  </div>

                  {/* Premium Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative overflow-hidden bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider transition shadow-lg shadow-brand-red-600/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {/* Premium loading state border & shine */}
                      {isLoading ? (
                        <>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          />
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Access Request</span>
                          <ArrowRight className="h-4.5 w-4.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Redirect back to Login */}
                <div className="mt-8 text-center text-xs text-slate-500 font-semibold">
                  Already have access?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-brand-red-600 hover:text-brand-red-700 transition cursor-pointer"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* Success / Pending Verification State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="text-center space-y-6 py-6"
              >
                {/* Large Elegant Clock/CheckCircle visual with glowing auras */}
                <div className="relative flex items-center justify-center mx-auto w-24 h-24">
                  {/* Glowing background circles */}
                  <div className="absolute inset-0 bg-brand-red-100 rounded-full blur-md opacity-70 animate-pulse" />
                  <div className="absolute inset-2 bg-brand-red-50 rounded-full" />
                  
                  {/* Glowing center icon */}
                  <div className="relative z-10 w-16 h-16 bg-brand-red-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-red-600/20">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Application Received
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
                    Our curation team is currently reviewing <span className="font-extrabold text-brand-red-600">{submittedBrandName}</span>. You will receive an email with your access link once approved.
                  </p>
                </div>

                {/* Vetting checklist */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-[11px] font-semibold text-slate-500 max-w-md mx-auto space-y-3.5">
                  <span className="font-extrabold text-slate-700 uppercase tracking-wider block border-b border-slate-200/50 pb-1.5 text-[10px]">What happens next?</span>
                  
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="h-4 w-4 text-brand-red-500 shrink-0 mt-0.5" />
                    <span>Our curators check your brand alignment against our creator verticals.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="h-4 w-4 text-brand-red-500 shrink-0 mt-0.5" />
                    <span>Once vetted, we generate your unique, tokenized access link.</span>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle2 className="h-4 w-4 text-brand-red-500 shrink-0 mt-0.5" />
                    <span>You&apos;ll get an email notification to setup your billing and launch your first UGC campaign.</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3 max-w-md mx-auto">
                  <Link
                    href="/"
                    className="w-full bg-slate-900 hover:bg-black text-white rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md text-center block"
                  >
                    Return to Homepage
                  </Link>
                  <Link
                    href="/login"
                    className="text-xs text-slate-400 hover:text-slate-600 transition font-bold"
                  >
                    Login with another account
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

    </main>
  );
}
