"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeAvatar } from "@/components/dashboard/SafeAvatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  Plus,
  X,
  AlertTriangle,
  Clock,
  UserCheck,
  ShieldAlert,
  Mail,
  User,
  Briefcase,
  Phone
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardStatusBadge";

const pocSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  work_email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
});

type PocFormValues = z.infer<typeof pocSchema>;

export type PocListItem = {
  id: string;
  brand_id: string | null;
  fullName: string;
  workEmail: string;
  phone: string | null;
  designation: string | null;
  isPrimary: boolean;
  status: string;
  createdAt: string | null;
};

interface Props {
  initialPocs: PocListItem[];
  initialSubscription: string;
}

const inputWithIconClassName =
  "w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const labelClassName = "mb-1.5 block text-sm font-semibold text-slate-800";

function normalizePocStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "pending") return "Pending Admin Approval";
  if (normalized === "active") return "Active";
  if (normalized === "rejected") return "Rejected";

  return status || "Pending Admin Approval";
}

export function PocClient({ initialPocs, initialSubscription }: Props) {
  const router = useRouter();
  const [pocs, setPocs] = useState<PocListItem[]>(initialPocs);
  const [subscriptionStatus] = useState(initialSubscription);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PocFormValues>({
    resolver: zodResolver(pocSchema),
    defaultValues: {
      full_name: "",
      work_email: "",
      phone: "",
      designation: "",
    }
  });

  const onSubmit = async (data: PocFormValues) => {
    if (subscriptionStatus === "free" && pocs.length >= 3) {
      window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        full_name: data.full_name,
        work_email: data.work_email,
        phone: data.phone?.trim() || null,
        designation: data.designation,
      };

      const res = await fetch("/api/brand/poc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to add POC");
      }

      reset();
      setErrorMsg(null);
      setSuccessMsg("POC saved successfully.");
      window.dispatchEvent(new CustomEvent("increment-poc-count"));
      router.refresh();

      const saved = result.data;
      
      setPocs([{
        id: saved.id,
        brand_id: saved.brand_id ?? null,
        fullName: saved.full_name ?? data.full_name,
        workEmail: saved.work_email ?? data.work_email,
        phone: saved.phone ?? data.phone ?? null,
        designation: saved.designation ?? saved.role_title ?? data.designation,
        isPrimary: Boolean(saved.is_primary),
        status: saved.status ?? "pending",
        createdAt: saved.created_at ?? null,
      }, ...pocs]);

      setIsAddOpen(false);

    } catch (err) {
      console.error("Failed to add POC:", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to add POC");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/brand/poc?id=${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error?.message || "Failed to delete POC");
      }
      
      setPocs(prev => prev.filter(p => p.id !== id));
      setErrorMsg(null);
      window.dispatchEvent(new CustomEvent("decrement-poc-count"));
      router.refresh();
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete POC");
    }
  };

  return (
    <div className="space-y-8 relative min-h-full">
      <DashboardPageHeader 
        title="Team & POC"
        description="Manage brand team members, POCs, approval status, and creator communication access."
        action={
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold border border-gray-200">
              <span
                className={`px-3 py-1.5 rounded-lg ${subscriptionStatus === "free"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-400"
                  }`}
              >
                Free Tier (Max 3)
              </span>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("open-pricing-modal"))}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${subscriptionStatus !== "free"
                    ? "bg-brand-red-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-brand-red-600"
                  }`}
              >
                Go Plus
              </button>
            </div>
            <button
              onClick={() => {
                if (subscriptionStatus === "free" && pocs.length >= 3) {
                  window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
                } else {
                  setErrorMsg(null);
                  setSuccessMsg(null);
                  setIsAddOpen(true);
                }
              }}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Team/POC
            </button>
          </div>
        }
      />

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-start gap-3">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <DashboardCard className="flex items-center justify-between p-6">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-extrabold text-gray-800 mt-1">{pocs.length}</h3>
          </div>
          <div className="h-10 w-10 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </DashboardCard>
        <DashboardCard className="flex items-center justify-between p-6">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Active Staff</p>
            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
              {pocs.filter(p => normalizePocStatus(p.status) === "Active").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-xl flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </DashboardCard>
        <DashboardCard className="flex items-center justify-between p-6">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Pending Verification</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">
              {pocs.filter(p => normalizePocStatus(p.status) === "Pending Admin Approval").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-500 border border-amber-100 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </DashboardCard>
      </div>

      {pocs.length === 0 ? (
        <DashboardEmptyState 
          title="No Team/POC added."
          description="Add a brand contact so campaign communication stays organized."
          icon={Users}
          ctaAction={() => {
            if (subscriptionStatus === "free" && pocs.length >= 3) {
              window.dispatchEvent(new CustomEvent("open-subscription-paywall"));
            } else {
              setErrorMsg(null);
              setSuccessMsg(null);
              setIsAddOpen(true);
            }
          }}
          ctaLabel="Add Team/POC"
        />
      ) : (
        <DashboardCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  <th className="px-6 py-4">Point of Contact</th>
                  <th className="px-6 py-4">Work Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {pocs.map((poc) => (
                  <tr key={poc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <SafeAvatar
                          name={poc.fullName}
                          alt={poc.fullName || "POC"}
                          size="sm"
                          className="h-9 w-9 border border-gray-200"
                        />
                        <span className="font-bold text-gray-900">{poc.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {poc.workEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      {poc.phone || "Not provided"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-600">
                      {poc.designation || "Point of Contact"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DashboardStatusBadge status={normalizePocStatus(poc.status)} type={normalizePocStatus(poc.status) === "Active" ? "success" : normalizePocStatus(poc.status) === "Rejected" ? "danger" : "warning"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(poc.id)}
                        className="px-2.5 py-1.5 border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-lg text-[10px] font-bold transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      )}

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative h-full w-full max-w-full bg-white p-4 shadow-2xl sm:max-w-md sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    Add Team/POC
                    
                  </h3>
                  <button
                    onClick={() => setIsAddOpen(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs font-semibold leading-relaxed text-amber-800 flex gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-amber-500" />
                  <span>Newly registered POCs require administrative verification before joining active campaign chat rooms.</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  {errorMsg && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {errorMsg}
                    </p>
                  )}

                  <div>
                    <label className={labelClassName}>Full name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register("full_name")}
                        className={inputWithIconClassName}
                        placeholder="e.g. Jane Doe"
                        autoComplete="name"
                      />
                    </div>
                    {errors.full_name && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.full_name?.message as string}</p>}
                  </div>

                  <div>
                    <label className={labelClassName}>Work email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        {...register("work_email")}
                        className={inputWithIconClassName}
                        placeholder="jane@company.com"
                        autoComplete="email"
                      />
                    </div>
                    {errors.work_email && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.work_email?.message as string}</p>}
                  </div>

                  <div>
                    <label className={labelClassName}>Phone</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        {...register("phone")}
                        className={inputWithIconClassName}
                        placeholder="9999999999"
                        autoComplete="tel"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">Optional, but useful for urgent campaign approvals.</p>
                  </div>

                  <div>
                    <label className={labelClassName}>Designation</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                        <Briefcase className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        {...register("designation")}
                        className={inputWithIconClassName}
                        placeholder="e.g. Marketing Manager"
                        autoComplete="organization-title"
                      />
                    </div>
                    {errors.designation && <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.designation?.message as string}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-3 text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
                  >
                    {isSubmitting ? "Saving Team/POC..." : "Save Team/POC"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
