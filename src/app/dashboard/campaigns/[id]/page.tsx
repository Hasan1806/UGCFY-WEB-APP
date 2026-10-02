"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Calendar,
  DollarSign,
  Users,
  Instagram,
  Youtube,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  Edit,
  ShieldCheck,
  FileText,
  Video,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useDashboard, CampaignApplication } from "@/context/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {
    role,
    campaigns,
    applications,
    applyToCampaign,
    updateApplicationStatus,
    creatorProfile,
  } = useDashboard();

  const isBrand = role === "brand";
  const campaign = campaigns.find((c) => c.id === resolvedParams.id);

  // Brand tabs
  const [activeBrandTab, setActiveBrandTab] = useState<
    "overview" | "applications" | "selected" | "deliverables"
  >("applications");

  // Creator Apply Modal
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [availability, setAvailability] = useState("Available immediately");
  const [notes, setNotes] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  if (!campaign) {
    return (
      <div className="py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-base font-extrabold text-slate-900">Campaign Not Found</h2>
        <p className="text-xs text-slate-500">The campaign you are trying to view does not exist.</p>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-xs font-bold text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
      </div>
    );
  }

  // Applications for this campaign
  const campaignApps = applications.filter((a) => a.campaignId === campaign.id);
  const selectedCreators = campaignApps.filter((a) => a.status === "accepted");

  // Check if current creator has already applied
  const myApplication = applications.find(
    (a) =>
      a.campaignId === campaign.id &&
      (a.creatorId === creatorProfile.id || a.creatorHandle === creatorProfile.handle)
  );

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    applyToCampaign({
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      brandId: campaign.brand_id,
      brandName: campaign.brand_name,
      creatorId: creatorProfile.id,
      creatorName: creatorProfile.name,
      creatorHandle: creatorProfile.handle,
      creatorAvatar: creatorProfile.avatar,
      creatorNiche: creatorProfile.niches,
      creatorLocation: creatorProfile.location,
      creatorFollowers: creatorProfile.followersCount,
      creatorEngagement: creatorProfile.avgEngagement,
      pitch,
      availability,
      notes,
    });

    setApplySuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplySuccess(false);
    }, 1500);
  };

  // =========================================================================
  // BRAND VIEW (SECTION 14)
  // =========================================================================
  if (isBrand) {
    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-300">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/campaigns/${campaign.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Brief</span>
            </Link>
          </div>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  campaign.cover_image ||
                  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80"
                }
                alt={campaign.title}
                className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-slate-200"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      campaign.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : campaign.status === "draft"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {campaign.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{campaign.category}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {campaign.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 shrink-0">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Total Budget</p>
                <p className="text-sm font-black text-slate-950 mt-0.5">{formatINR(campaign.budget)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Per Creator</p>
                <p className="text-sm font-black text-slate-950 mt-0.5">
                  {formatINR(campaign.creatorCompensation)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Deadline</p>
                <p className="text-sm font-black text-slate-950 mt-0.5">{campaign.applicationDeadline}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 border-t border-slate-100 pt-4 flex items-center gap-2 overflow-x-auto">
            {[
              { id: "applications", label: `Applications (${campaignApps.length})` },
              { id: "selected", label: `Selected Creators (${selectedCreators.length})` },
              { id: "overview", label: "Brief Overview" },
              { id: "deliverables", label: `Deliverables (${campaign.deliverables.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveBrandTab(tab.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeBrandTab === tab.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: APPLICATIONS REVIEW */}
        {activeBrandTab === "applications" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {campaignApps.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900">No applications received yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  As creators discover your campaign and submit their pitch, their profiles will appear here for review.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {campaignApps.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          app.creatorAvatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                        }
                        alt={app.creatorName}
                        className="h-14 w-14 rounded-2xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-950">{app.creatorName}</h3>
                          <span className="text-xs font-semibold text-slate-400">@{app.creatorHandle}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                              app.status === "accepted"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : app.status === "rejected"
                                ? "bg-rose-50 text-brand-red-600 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1 font-medium">
                          <span>{app.creatorNiche.join(", ")}</span>
                          <span>·</span>
                          <span>{app.creatorLocation}</span>
                          {app.creatorFollowers && (
                            <>
                              <span>·</span>
                              <span>
                                Followers: <strong className="text-slate-800">{app.creatorFollowers}</strong>
                              </span>
                            </>
                          )}
                          {app.creatorEngagement && (
                            <>
                              <span>·</span>
                              <span>
                                Engagement: <strong className="text-slate-800">{app.creatorEngagement}</strong>
                              </span>
                            </>
                          )}
                        </div>

                        {/* Pitch Quote */}
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 italic">
                          &quot;{app.pitch}&quot;
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <Link
                        href={`/dashboard/creators/${app.creatorId}`}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View Profile
                      </Link>

                      {app.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateApplicationStatus(app.id, "accepted")}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 text-xs font-extrabold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-extrabold text-brand-red-600 hover:bg-rose-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SELECTED CREATORS */}
        {activeBrandTab === "selected" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {selectedCreators.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8">
                <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-slate-900">No creators accepted yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Review applicant pitches in the Applications tab and click Accept to hire them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCreators.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-3xl border border-emerald-200/80 bg-white p-5 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          app.creatorAvatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                        }
                        alt={app.creatorName}
                        className="h-12 w-12 rounded-2xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-950 truncate">{app.creatorName}</p>
                        <p className="text-xs text-slate-500 truncate">@{app.creatorHandle}</p>
                        <span className="inline-block mt-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Contract Active
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/collaboration"
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-black transition-colors shrink-0"
                    >
                      Message
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OVERVIEW */}
        {activeBrandTab === "overview" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 mb-2">About Campaign</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Creator Requirements
                </h3>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li>• Niches: {campaign.creatorRequirements.niche.join(", ")}</li>
                  <li>• Platforms: {campaign.platforms.join(", ")}</li>
                  <li>• Target Location: {campaign.creatorRequirements.location || "Pan-India"}</li>
                  <li>• Min Followers: {campaign.creatorRequirements.minFollowers?.toLocaleString() || "10,000"}</li>
                  <li>• Min Engagement: {campaign.creatorRequirements.minEngagement || "3.0%"}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Timeline & Terms
                </h3>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  <li>• Application Deadline: {campaign.applicationDeadline}</li>
                  <li>• Campaign Start: {campaign.startDate || "Immediate"}</li>
                  <li>• Campaign End: {campaign.endDate || "30 days after launch"}</li>
                  <li>• Payout Schedule: Escrow released upon video delivery and brand approval</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERABLES */}
        {activeBrandTab === "deliverables" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4 animate-in fade-in duration-200">
            <h2 className="text-base font-extrabold text-slate-950 mb-3">Required Deliverables</h2>
            <div className="space-y-3">
              {campaign.deliverables.map((del, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-950">{del.format}</span>
                    <span className="text-xs font-bold text-slate-500">Qty: {del.quantity}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{del.guidelines}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // CREATOR VIEW (SECTION 12 & 13)
  // =========================================================================
  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Navigation Breadcrumb */}
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discover Campaigns</span>
      </Link>

      {/* Hero Header Card */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                campaign.cover_image ||
                "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80"
              }
              alt={campaign.title}
              className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={campaign.brand_logo} alt={campaign.brand_name} className="w-4 h-4 rounded-full object-cover" />
                <span className="text-xs font-extrabold text-slate-900">{campaign.brand_name}</span>
                <span className="text-slate-400">·</span>
                <span className="text-xs font-semibold text-rose-600">{campaign.category}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {campaign.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            <div className="text-left md:text-right">
              <p className="text-[11px] font-bold uppercase text-slate-400">Creator Compensation</p>
              <p className="text-2xl font-black text-rose-600">{formatINR(campaign.creatorCompensation)}</p>
            </div>

            {myApplication ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Application {myApplication.status.toUpperCase()}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="px-6 py-3 rounded-2xl bg-rose-600 text-sm font-extrabold text-white hover:bg-rose-700 transition-all shadow-sm active:scale-[0.98]"
              >
                Apply for Campaign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 mb-2">About the Campaign</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{campaign.description}</p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-950 mb-3">Required Deliverables</h2>
              <div className="space-y-3">
                {campaign.deliverables.map((del, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-extrabold text-slate-950">{del.format}</span>
                      <span className="text-xs font-bold text-slate-500">Qty: {del.quantity}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{del.guidelines}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h2 className="text-base font-extrabold text-slate-950 mb-2">Terms & Guidelines</h2>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li>• All video deliverables must be shot in high-definition (minimum 1080p, 60fps preferred).</li>
                <li>• Must adhere to UGC guidelines: natural lighting, honest wear-test storytelling, clear audio.</li>
                <li>• Brand will review draft submission within 48 hours before posting.</li>
                <li>• Direct payment of {formatINR(campaign.creatorCompensation)} released automatically upon approval.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Col: Metadata Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-950">Creator Requirements</h2>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Niche:</span>
                <span className="font-bold">{campaign.creatorRequirements.niche.join(", ")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Platforms:</span>
                <span className="font-bold capitalize">{campaign.platforms.join(", ")}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Min Followers:</span>
                <span className="font-bold">
                  {campaign.creatorRequirements.minFollowers?.toLocaleString() || "10K"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Min Engagement:</span>
                <span className="font-bold">{campaign.creatorRequirements.minEngagement || "3.0%"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Application Deadline:</span>
                <span className="font-bold text-rose-600">{campaign.applicationDeadline}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Mobile Apply CTA */}
      <div className="fixed bottom-16 inset-x-0 p-3 bg-white/95 border-t border-slate-200/80 backdrop-blur-md md:hidden z-20">
        {myApplication ? (
          <div className="w-full py-3 rounded-2xl bg-emerald-50 text-emerald-700 text-center text-xs font-extrabold">
            Application {myApplication.status.toUpperCase()}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-rose-600 text-white text-xs font-extrabold shadow-sm"
          >
            Apply for Campaign ({formatINR(campaign.creatorCompensation)})
          </button>
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
              >
                {applySuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">Application Submitted!</h3>
                    <p className="text-xs text-slate-500">
                      The brand has received your pitch and will review your profile shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">Apply to Campaign</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{campaign.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Your Pitch & Concept Idea *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Explain why you're a great fit for this brand and describe your creative angle..."
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Availability
                      </label>
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="e.g. Available to shoot this week"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Additional Notes / Equipment (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. 4K Sony Alpha camera setup, wireless mic"
                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsApplyModalOpen(false)}
                        className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-2xl bg-rose-600 text-xs font-extrabold text-white hover:bg-rose-700 shadow-sm"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
