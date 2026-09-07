/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Lock,
  CreditCard,
  ArrowLeft,
  Plus,
  ShieldCheck,
  Building,
  Key,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/ui/PasswordInput";

interface Props {
  initialProfile: any;
  initialTeamMembers: any[];
}

export function SettingsClient({ initialProfile, initialTeamMembers }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "team" | "security" | "billing">("general");

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [profile, setProfile] = useState(initialProfile);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [enable2FA, setEnable2FA] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        brand_name: profile.company_name || "Unknown Brand",
        company_name: profile.company_name,
        website: profile.website_url,
        industry: profile.industry,
        contact_phone: profile.phone,
        business_description: profile.business_description
      };
      const res = await fetch("/api/brand/profile", {
        method: "PATCH",
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
        throw new Error(result.error?.message || "Failed to update profile");
      }
      showToast("General settings saved successfully!");
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      showToast(err instanceof Error ? err.message : "Failed to save settings.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("New passwords do not match!", "error");
      return;
    }
    if (passwords.new.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswords({ current: "", new: "", confirm: "" });
      showToast("Password updated successfully!");
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "team", label: "Team", icon: Users },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 selection:bg-red-100 select-none">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-slate-100 border border-slate-200/50 rounded-xl text-slate-600 transition flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Brand Portal</span>
              <span>/</span>
              <span className="text-slate-600 font-bold">Settings</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm tracking-tighter">U</span>
            </div>
            <span className="font-extrabold text-md tracking-tight text-slate-900 hidden sm:inline">
              UGC<span className="text-red-600">FY</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Wrapper */}
      <div className="max-w-6xl mx-auto px-6 pt-8 space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Go Plus Settings</h1>
          <p className="text-slate-500 text-xs mt-1.5 font-medium">Manage your brand info, team permissions, security configurations, and billing tiers.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          {/* Left Column */}
          <aside className="w-full md:w-1/4 bg-white/80 border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:sticky md:top-24">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-200 whitespace-nowrap cursor-pointer w-full text-left relative ${isActive
                      ? "text-red-600 bg-red-50/50 border-l-4 border-red-600"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-red-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Right Column */}
          <main className="w-full md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-sm rounded-2xl p-6 md:p-8 text-left"
              >
                {/* GENERAL TAB */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">General Information</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Customize your brand description, public website links, and contact profile.</p>
                    </div>

                    <form onSubmit={handleSaveGeneral} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Brand Name</label>
                          <input
                            type="text"
                            required
                            value={profile.company_name}
                            onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="e.g. Nike Sports"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Website URL</label>
                          <input
                            type="url"
                            required
                            value={profile.website_url}
                            onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Industry Sector</label>
                          <select
                            value={profile.industry}
                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                          >
                            <option value="Athletic Apparels & Footwear">Athletic Apparels & Footwear</option>
                            <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                            <option value="Tech & Gadgets">Tech & Gadgets</option>
                            <option value="Food & Beverages">Food & Beverages</option>
                            <option value="Health & Wellness">Health & Wellness</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Headquarters Location</label>
                          <input
                            type="text"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="e.g. New York, USA"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Hotline Phone</label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="+91..."
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Billing/Contact Email</label>
                          <input
                            type="email"
                            disabled
                            value={profile.contact_email}
                            className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-400 cursor-not-allowed"
                            title="To change billing email, contact system administrator."
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Brand Biography / Description</label>
                        <textarea
                          rows={4}
                          value={profile.business_description}
                          onChange={(e) => setProfile({ ...profile, business_description: e.target.value })}
                          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                          placeholder="Write a brief description of your Go Plus goals and target market..."
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-lg shadow-red-500/20 flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                        >
                          {isSaving && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TEAM TAB */}
                {activeTab === "team" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Team Members & Access Control</h2>
                        <p className="text-slate-500 text-xs mt-0.5">Invite new admin managers, view roles, and track status approvals.</p>
                      </div>
                      <Link href="/dashboard/team" className="border border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 rounded-xl px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>Manage Team</span>
                      </Link>
                    </div>

                    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl bg-white/40 shadow-sm">
                      <table className="w-full border-collapse text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200/80">
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Email Address</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {initialTeamMembers.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-slate-400 font-normal">No team members found.</td>
                            </tr>
                          ) : (
                            initialTeamMembers.map((member) => (
                              <tr key={member.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-6 py-4 flex items-center gap-3">
                                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                    {member.name?.charAt(0) || "U"}
                                  </div>
                                  <span className="font-bold text-slate-800">{member.name}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono">{member.email}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                    {member.role || "Admin"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full ${member.status === "Active"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : "bg-amber-50 text-amber-700 border border-amber-100"
                                    }`}>
                                    {member.status || "Pending"}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Security Settings</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Manage credentials, enable multi-factor authentication, and monitor logins.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                          <Key className="h-3.5 w-3.5 text-slate-400" />
                          Update Password
                        </h3>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Current Password</label>
                          <PasswordInput
                            autoComplete="current-password"
                            required
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">New Password</label>
                          <PasswordInput
                            autoComplete="new-password"
                            required
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="••••••••"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Confirm New Password</label>
                          <PasswordInput
                            autoComplete="new-password"
                            required
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
                            placeholder="••••••••"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider w-full"
                        >
                          {isSaving && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
                          <span>Update Password</span>
                        </button>
                      </form>

                      <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-slate-200/80 pt-6 lg:pt-0 lg:pl-8">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                          <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
                          Security Verification
                        </h3>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between gap-4">
                          <div className="space-y-1 text-left">
                            <span className="font-extrabold text-slate-800 text-xs block">Enable Two-Factor Auth (2FA)</span>
                            <span className="font-semibold text-[10px] text-slate-400 leading-normal block">Adds an extra layer of protection during login verification.</span>
                          </div>

                          <button
                            onClick={() => {
                              setEnable2FA(!enable2FA);
                              showToast(`2FA verification ${!enable2FA ? "enabled" : "disabled"}.`);
                            }}
                            className={`w-11 h-6 rounded-full transition-colors relative outline-none border cursor-pointer border-slate-200 shrink-0 ${enable2FA ? "bg-red-600 border-red-600" : "bg-slate-200"}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 bg-white size-4.5 rounded-full shadow-sm transition-transform ${enable2FA ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                          <span className="font-extrabold text-slate-800 text-xs block">Authorized Sign-In Sessions</span>
                          <div className="space-y-2.5 text-[10px] text-slate-500 font-bold">
                            <div className="flex justify-between items-center border-b border-slate-200/40 pb-2">
                              <span>Current Session</span>
                              <span className="text-red-600">Active Now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* BILLING TAB */}
                {activeTab === "billing" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Billing & Plans</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Review subscription plans, active credits, campaign quotas, and billing invoices.</p>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 rounded-3xl shadow-md relative overflow-hidden shadow-red-500/20">
                      <div className="absolute right-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-10 translate-y-10" />

                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-white/20 border border-white/30 text-white rounded-full text-[9px] font-bold uppercase tracking-wider">
                            Current Plan
                          </span>
                          <h3 className="text-2xl font-extrabold tracking-tight mt-3">
                            {profile.subscription_status === "free" ? "Free Tier" : "Go Plus Pro"}
                          </h3>
                        </div>

                        
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/20 pt-4.5 mt-6 text-left">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-red-200 tracking-wider">POC Limits</span>
                          <span className="font-extrabold text-sm block mt-0.5">{profile.subscription_status === "free" ? "Up to 3" : "Unlimited"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-red-200 tracking-wider">Escrow Limit</span>
                          <span className="font-extrabold text-sm block mt-0.5">{profile.subscription_status === "free" ? "Limited" : "Unlimited"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-red-200 tracking-wider">Fee Structure</span>
                          <span className="font-extrabold text-sm block mt-0.5">2.5% Flat Rate</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-1 sm:max-w-md">
                        <span className="font-extrabold text-slate-800 text-xs block">Update Payment Information</span>
                        <span className="font-semibold text-[10px] text-slate-400 leading-normal block">Manage your corporate card to prevent transaction delays.</span>
                      </div>
                      <button className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/80 font-bold py-2.5 px-5 rounded-xl transition shadow-sm text-xs cursor-pointer shrink-0">
                        Manage Billing
                      </button>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-xs font-bold text-white flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-600 shadow-emerald-500/10" : "bg-red-600 shadow-red-500/10"
              }`}
          >
            {toast.type === "success" ? <ShieldCheck className="h-4.5 w-4.5" /> : <ShieldAlert className="h-4.5 w-4.5" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
