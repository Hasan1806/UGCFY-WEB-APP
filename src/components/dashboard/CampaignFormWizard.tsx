"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  DollarSign,
  Users,
  Video,
  FileText,
  Instagram,
  Youtube,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useDashboard, Campaign } from "@/context/DashboardContext";

interface CampaignFormWizardProps {
  initialData?: Campaign;
  isEdit?: boolean;
}

const NICHES = [
  "Beauty & Skincare",
  "Fashion & Apparel",
  "Tech & Gadgets",
  "Fitness & Health",
  "Food & Beverage",
  "Travel & Hospitality",
  "Gaming & Entertainment",
  "Parenting & Family",
  "Finance & Business",
];

const DELIVERABLE_FORMATS = [
  "Instagram Reel (30-60s)",
  "Instagram Stories (3 frames)",
  "Dedicated UGC Product Review",
  "Unboxing ASMR Video",
  "TikTok / Vertical Short",
  "YouTube Dedicated Integration",
];

export function CampaignFormWizard({ initialData, isEdit = false }: CampaignFormWizardProps) {
  const router = useRouter();
  const { addCampaign, updateCampaign } = useDashboard();

  const [step, setStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || NICHES[0] || "Beauty & Skincare",
    description: initialData?.description || "",
    objective: "Brand Awareness & UGC Conversions",
    platforms: initialData?.platforms || ["instagram"],
    niches: initialData?.creatorRequirements?.niche || [NICHES[0] || "Beauty & Skincare"],
    location: initialData?.creatorRequirements?.location || "India",
    minFollowers: initialData?.creatorRequirements?.minFollowers || 10000,
    maxFollowers: initialData?.creatorRequirements?.maxFollowers || 500000,
    creatorsCount: initialData?.creatorRequirements?.creatorsCount || 5,
    minEngagement: initialData?.creatorRequirements?.minEngagement || "3.0%",
    deliverables: initialData?.deliverables || [
      {
        format: "Instagram Reel (30-60s)",
        quantity: 1,
        guidelines: "Show natural product usage, key features, and discount code call-to-action.",
      },
    ],
    budget: initialData?.budget || 100000,
    creatorCompensation: initialData?.creatorCompensation || 20000,
    currency: initialData?.currency || "INR",
    applicationDeadline: initialData?.applicationDeadline || "2026-05-30",
    startDate: initialData?.startDate || "2026-05-15",
    endDate: initialData?.endDate || "2026-06-15",
    cover_image:
      initialData?.cover_image ||
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80",
  });

  const validateStep = (currentStep: number): boolean => {
    setErrorMsg("");
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        setErrorMsg("Please enter a campaign title.");
        return false;
      }
      if (!formData.description.trim()) {
        setErrorMsg("Please enter a brief description of the campaign.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (formData.platforms.length === 0) {
        setErrorMsg("Please select at least one target platform.");
        return false;
      }
      if (formData.creatorsCount < 1) {
        setErrorMsg("Target number of creators must be at least 1.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.deliverables.length === 0) {
        setErrorMsg("Please configure at least one deliverable.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (formData.budget <= 0) {
        setErrorMsg("Campaign budget must be greater than zero.");
        return false;
      }
      if (formData.creatorCompensation <= 0) {
        setErrorMsg("Creator compensation must be greater than zero.");
        return false;
      }
      if (!formData.applicationDeadline) {
        setErrorMsg("Please set an application deadline.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSave = (status: "draft" | "active") => {
    if (!validateStep(4)) return;

    if (isEdit && initialData) {
      updateCampaign(initialData.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platforms: formData.platforms,
        creatorRequirements: {
          minFollowers: formData.minFollowers,
          maxFollowers: formData.maxFollowers,
          niche: formData.niches,
          location: formData.location,
          creatorsCount: formData.creatorsCount,
          minEngagement: formData.minEngagement,
        },
        deliverables: formData.deliverables,
        budget: formData.budget,
        creatorCompensation: formData.creatorCompensation,
        currency: formData.currency,
        applicationDeadline: formData.applicationDeadline,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: status,
        cover_image: formData.cover_image,
      });
      router.push(`/dashboard/campaigns/${initialData.id}`);
    } else {
      const created = addCampaign({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        platforms: formData.platforms,
        creatorRequirements: {
          minFollowers: formData.minFollowers,
          maxFollowers: formData.maxFollowers,
          niche: formData.niches,
          location: formData.location,
          creatorsCount: formData.creatorsCount,
          minEngagement: formData.minEngagement,
        },
        deliverables: formData.deliverables,
        budget: formData.budget,
        creatorCompensation: formData.creatorCompensation,
        currency: formData.currency,
        applicationDeadline: formData.applicationDeadline,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: status,
        payment_status: "paid",
        cover_image: formData.cover_image,
      });
      router.push(`/dashboard/campaigns/${created.id}`);
    }
  };

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Campaigns</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">Step {step} of 5</span>
      </div>

      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        {/* Progress Bar Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-950">
            {isEdit ? "Edit Campaign Brief" : "Create New Campaign"}
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Define your campaign requirements, deliverables, budget, and timeline for creators.
          </p>

          <div className="mt-6 flex items-center justify-between gap-2">
            {[
              { num: 1, label: "Basics" },
              { num: 2, label: "Requirements" },
              { num: 3, label: "Deliverables" },
              { num: 4, label: "Budget & Dates" },
              { num: 5, label: "Review" },
            ].map((s) => (
              <div key={s.num} className="flex-1 flex flex-col gap-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    s.num <= step ? "bg-brand-red-600" : "bg-slate-100"
                  }`}
                />
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    s.num === step ? "text-brand-red-600" : s.num < step ? "text-slate-800" : "text-slate-300"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-brand-red-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: CAMPAIGN BASICS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Campaign Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Summer Glow Serum Launch 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category / Niche *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Primary Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Product Launch, Brand Awareness"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Campaign Brief & Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe what your brand wants the creators to showcase, tone of voice, key talking points..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 2: CREATOR REQUIREMENTS */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Target Platforms *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "instagram", label: "Instagram", icon: Instagram },
                  { id: "youtube", label: "YouTube", icon: Youtube },
                ].map((p) => {
                  const isChecked = formData.platforms.includes(p.id);
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        const newPlatforms = isChecked
                          ? formData.platforms.filter((x) => x !== p.id)
                          : [...formData.platforms, p.id];
                        setFormData({ ...formData, platforms: newPlatforms });
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-sm font-bold transition-all ${
                        isChecked
                          ? "border-brand-red-600 bg-rose-50 text-brand-red-600"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{p.label}</span>
                      {isChecked && <Check className="w-4 h-4 ml-auto text-brand-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Number of Creators Required *
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.creatorsCount}
                  onChange={(e) => setFormData({ ...formData, creatorsCount: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Creator Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. India, Mumbai, Pan-India"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Min Followers
                </label>
                <input
                  type="number"
                  step={5000}
                  value={formData.minFollowers}
                  onChange={(e) => setFormData({ ...formData, minFollowers: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Min Engagement Rate
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.0%"
                  value={formData.minEngagement}
                  onChange={(e) => setFormData({ ...formData, minEngagement: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DELIVERABLES */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Deliverables & Content Specifications *
              </label>

              <div className="space-y-3">
                {formData.deliverables.map((del, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Content Format</label>
                        <select
                          value={del.format}
                          onChange={(e) => {
                            const updated = [...formData.deliverables];
                            const currentDel = updated[idx];
                            if (currentDel) {
                              updated[idx] = { ...currentDel, format: e.target.value };
                              setFormData({ ...formData, deliverables: updated });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                        >
                          {DELIVERABLE_FORMATS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          min={1}
                          value={del.quantity}
                          onChange={(e) => {
                            const updated = [...formData.deliverables];
                            const currentDel = updated[idx];
                            if (currentDel) {
                              updated[idx] = { ...currentDel, quantity: parseInt(e.target.value) || 1 };
                              setFormData({ ...formData, deliverables: updated });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Content Guidelines</label>
                      <input
                        type="text"
                        placeholder="Specific guidelines for this deliverable..."
                        value={del.guidelines}
                        onChange={(e) => {
                          const updated = [...formData.deliverables];
                          const currentDel = updated[idx];
                          if (currentDel) {
                            updated[idx] = { ...currentDel, guidelines: e.target.value };
                            setFormData({ ...formData, deliverables: updated });
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    deliverables: [
                      ...formData.deliverables,
                      {
                        format: DELIVERABLE_FORMATS[0] || "Instagram Reel (30-60s)",
                        quantity: 1,
                        guidelines: "Natural brand storytelling",
                      },
                    ],
                  });
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-red-600 hover:text-brand-red-700"
              >
                <Plus className="w-4 h-4" /> Add another deliverable
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: BUDGET & TIMELINE */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Total Campaign Budget (₹) *
                </label>
                <input
                  type="number"
                  step={5000}
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Compensation per Creator (₹) *
                </label>
                <input
                  type="number"
                  step={1000}
                  value={formData.creatorCompensation}
                  onChange={(e) =>
                    setFormData({ ...formData, creatorCompensation: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Application Deadline *
                </label>
                <input
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & PUBLISH */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-red-600">
                  {formData.category} · {formData.platforms.join(", ")}
                </span>
                <h3 className="text-xl font-black text-slate-950 mt-0.5">{formData.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{formData.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Budget</p>
                  <p className="text-sm font-black text-slate-950 mt-0.5">{formatINR(formData.budget)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Compensation</p>
                  <p className="text-sm font-black text-slate-950 mt-0.5">{formatINR(formData.creatorCompensation)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Creators Target</p>
                  <p className="text-sm font-black text-slate-950 mt-0.5">{formData.creatorsCount} creators</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">Deadline</p>
                  <p className="text-sm font-black text-slate-950 mt-0.5">{formData.applicationDeadline}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Deliverables</p>
                <div className="space-y-1.5">
                  {formData.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs text-slate-700 font-medium">
                      <span>• {d.format} (Qty: {d.quantity})</span>
                      <span className="text-slate-400 italic text-[11px]">{d.guidelines}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Wizard Controls */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {step === 5 ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSave("draft")}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("active")}
                  className="px-6 py-2.5 rounded-2xl bg-brand-red-600 text-xs font-extrabold text-white hover:bg-brand-red-700 transition-colors shadow-sm"
                >
                  {isEdit ? "Update & Publish" : "Publish Campaign"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-xs font-extrabold text-white hover:bg-black transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
