"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { 
  Building, 
  Globe, 
  Phone,
  User as UserIcon,
  Briefcase,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const onboardingSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  businessType: z.string().min(2, "Please select a business type"),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.literal("")).optional(),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function BrandOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companyName: "",
      businessType: "",
      websiteUrl: "",
      contactName: "",
      contactPhone: ""
    }
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?next=/brand/onboarding");
        return;
      }

      const { data: profile } = await supabase
        .from("brand_profiles")
        .select("company_name, brand_name, website, kyc_status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        const hasCompletedProfile = Boolean(profile.company_name || profile.brand_name);
        if (hasCompletedProfile && profile.kyc_status === "pending_verification") {
          router.push("/dashboard");
          return;
        }

        if (hasCompletedProfile) {
          router.push("/dashboard/verification");
          return;
        }
        
        reset({
          companyName: profile.company_name || "",
          websiteUrl: profile.website || "",
          businessType: "",
          contactName: "",
          contactPhone: ""
        });
      }
    }
    
    fetchProfile();
  }, [supabase, router, reset]);

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const payload = {
        brand_name: data.companyName, // using companyName as brand_name temporarily or required field
        company_name: data.companyName,
        business_type: data.businessType,
        website: data.websiteUrl,
        contact_name: data.contactName,
        contact_phone: data.contactPhone
      };
      
      const res = await fetch("/api/brand/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 160)}`);
      }

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to update profile");
      }
      
      router.push("/dashboard/verification");
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Brand Profile
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Let&apos;s get your business profile set up so you can start launching campaigns.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200"
        >
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 text-xs font-semibold">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Company Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    {...register("companyName")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
                {errors.companyName && <p className="text-red-500 text-[10px] font-bold">{errors.companyName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Business Type
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="h-4.5 w-4.5" />
                  </span>
                  <select
                    {...register("businessType")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white appearance-none"
                  >
                    <option value="">Select industry...</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Technology">Technology</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.businessType && <p className="text-red-500 text-[10px] font-bold">{errors.businessType.message}</p>}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Website URL
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Globe className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    {...register("websiteUrl")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
                {errors.websiteUrl && <p className="text-red-500 text-[10px] font-bold">{errors.websiteUrl.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Contact Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    {...register("contactName")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
                {errors.contactName && <p className="text-red-500 text-[10px] font-bold">{errors.contactName.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Contact Phone
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    {...register("contactPhone")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 text-sm focus:border-brand-red-500 focus:ring-2 focus:ring-brand-red-100 outline-none transition bg-slate-50/50 focus:bg-white"
                  />
                </div>
                {errors.contactPhone && <p className="text-red-500 text-[10px] font-bold">{errors.contactPhone.message}</p>}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-4">
              {process.env.NODE_ENV !== "production" && (
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const res = await fetch("/api/brand/bypass", { method: "POST" });
                      if (res.ok) router.push("/dashboard");
                      else setErrorMsg("Bypass failed");
                    } catch {
                      setErrorMsg("Bypass failed");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-slate-800 transition px-2"
                >
                  Bypass (Test)
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto md:px-12 flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white rounded-xl py-3.5 text-sm font-bold transition disabled:opacity-75 cursor-pointer shadow-lg shadow-slate-900/10"
              >
                {isLoading ? "Saving..." : "Continue to KYC"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
