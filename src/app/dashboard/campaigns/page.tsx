"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useDashboard, Campaign } from "@/context/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";

export default function CampaignsPage() {
  const { role, campaigns, updateCampaign, deleteCampaign, applications, creatorProfile } = useDashboard();
  const isBrand = role === "brand";

  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Delete modal state
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);

  // Filter campaigns
  const filteredCampaigns = campaigns.filter((camp) => {
    if (isBrand) {
      if (activeTab !== "all" && camp.status !== activeTab) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = camp.title.toLowerCase().includes(q);
      const matchDesc = camp.description.toLowerCase().includes(q);
      const matchBrand = camp.brand_name.toLowerCase().includes(q);
      const matchCategory = camp.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchBrand && !matchCategory) return false;
    }
    if (selectedCategory !== "all" && camp.category !== selectedCategory) return false;
    if (selectedPlatform !== "all" && !camp.platforms.includes(selectedPlatform)) return false;
    return true;
  });

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amt);
  };

  const handleToggleStatus = (camp: Campaign) => {
    const nextStatus = camp.status === "active" ? "paused" : "active";
    updateCampaign(camp.id, { status: nextStatus });
  };

  const handleDeleteConfirm = () => {
    if (campaignToDelete) {
      deleteCampaign(campaignToDelete.id);
      setCampaignToDelete(null);
    }
  };

  // Categories list for filter
  const categories = Array.from(new Set(campaigns.map((c) => c.category)));

  // =========================================================================
  // BRAND CAMPAIGNS VIEW (SECTION 8)
  // =========================================================================
  if (isBrand) {
    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-300">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Campaign Management</h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Create, monitor, and manage your creator briefs and hired influencers.
            </p>
          </div>

          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-red-600 px-5 text-sm font-extrabold text-white transition-all shadow-sm hover:bg-brand-red-700 active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </Link>
        </div>

        {/* Filter / Search Bar */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100/80 rounded-2xl border border-slate-200/50">
              {["all", "active", "draft", "paused", "completed"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-white text-slate-950 shadow-2xs font-extrabold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200/80 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-red-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Campaign List */}
        {filteredCampaigns.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8">
            <BriefcaseBusiness className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-slate-900">No campaigns found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No campaigns match your search query."
                : "Create your first campaign and start finding creators."}
            </p>
            <Link
              href="/dashboard/campaigns/new"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-red-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-brand-red-700"
            >
              <Plus className="w-4 h-4" /> Create Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCampaigns.map((camp) => {
              const campApps = applications.filter((a) => a.campaignId === camp.id);
              const acceptedCount = campApps.filter((a) => a.status === "accepted").length;

              return (
                <div
                  key={camp.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={camp.cover_image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80"}
                      alt={camp.title}
                      className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-slate-200/80"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                            camp.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : camp.status === "draft"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {camp.status}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{camp.category}</span>
                        <div className="flex items-center gap-1 ml-1 text-slate-400">
                          {camp.platforms.includes("instagram") && <Instagram className="w-3.5 h-3.5" />}
                          {camp.platforms.includes("youtube") && <Youtube className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <Link href={`/dashboard/campaigns/${camp.id}`} className="group">
                        <h2 className="text-base font-extrabold text-slate-950 group-hover:text-brand-red-600 transition-colors truncate">
                          {camp.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xl">
                        {camp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
                        <span>
                          Budget: <strong className="text-slate-900">{formatINR(camp.budget)}</strong>
                        </span>
                        <span>
                          Compensation: <strong className="text-slate-900">{formatINR(camp.creatorCompensation)}/creator</strong>
                        </span>
                        <span>
                          Deadline: <strong className="text-slate-900">{camp.applicationDeadline}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Metrics & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-black text-slate-950">
                        {campApps.length} <span className="text-xs font-normal text-slate-500">applicants</span>
                      </p>
                      <p className="text-xs font-bold text-emerald-600">
                        {acceptedCount} / {camp.creatorRequirements.creatorsCount} selected
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/dashboard/campaigns/${camp.id}`}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        title="View campaign"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/dashboard/campaigns/${camp.id}/edit`}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        title="Edit campaign"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(camp)}
                        className="p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        title={camp.status === "active" ? "Pause campaign" : "Activate campaign"}
                      >
                        {camp.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setCampaignToDelete(camp)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {campaignToDelete && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setCampaignToDelete(null)}
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
                >
                  <div className="flex items-center gap-3 text-rose-600 mb-3">
                    <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-950">Delete campaign?</h3>
                      <p className="text-xs text-slate-500">This action cannot be undone.</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 mb-6">
                    Are you sure you want to permanently delete <strong>&quot;{campaignToDelete.title}&quot;</strong> and all of its associated applications?
                  </p>

                  <div className="flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCampaignToDelete(null)}
                      className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteConfirm}
                      className="px-4 py-2.5 rounded-2xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors"
                    >
                      Delete Campaign
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // CREATOR DISCOVER CAMPAIGNS VIEW (SECTION 11)
  // =========================================================================
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Discover Campaigns</h1>
        <p className="text-sm font-medium text-slate-600 mt-1">
          Browse paid opportunities from verified brands, review creative briefs, and apply.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, niche or brief..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Niches</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 rounded-2xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
        </div>
      </div>

      {/* Discover Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white p-8">
          <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">No campaigns match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or clearing niche filters to see more opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCampaigns.map((camp) => {
            const hasApplied = applications.some(
              (a) => a.campaignId === camp.id && (a.creatorId === creatorProfile.id || a.creatorHandle === creatorProfile.handle)
            );

            return (
              <div
                key={camp.id}
                className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Cover Image & Brand Badge */}
                <div className="relative h-44 w-full bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={camp.cover_image || "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"}
                    alt={camp.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-900 shadow-sm flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={camp.brand_logo} alt={camp.brand_name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{camp.brand_name}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-sm">
                    {formatINR(camp.creatorCompensation)}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1.5">
                      <span>{camp.category}</span>
                      <span>·</span>
                      <span className="capitalize">{camp.platforms.join(", ")}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-950 line-clamp-1">{camp.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{camp.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">Deliverables:</span>
                      <span className="font-bold text-slate-900">{camp.deliverables[0]?.format || "Reel"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">Deadline:</span>
                      <span className="font-bold text-slate-900">{camp.applicationDeadline}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <Link
                        href={`/dashboard/campaigns/${camp.id}`}
                        className={`w-full py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                          hasApplied
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-900 hover:bg-black text-white shadow-xs"
                        }`}
                      >
                        {hasApplied ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <span>View Brief & Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
