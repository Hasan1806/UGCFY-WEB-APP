"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  ShieldCheck,
  Edit,
  Building2,
  Users,
  BriefcaseBusiness,
  Clapperboard,
  Sparkles,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  X,
  Check,
  CheckCircle2,
} from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";

export default function ProfileClient() {
  const {
    role,
    brandProfile,
    updateBrandProfile,
    creatorProfile,
    updateCreatorProfile,
    campaigns,
    reels,
  } = useDashboard();

  const isBrand = role === "brand";

  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "reels">("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Editing
  const [editForm, setEditForm] = useState({
    name: isBrand ? brandProfile.name : creatorProfile.name,
    handle: isBrand ? brandProfile.handle : creatorProfile.handle,
    avatar: isBrand ? brandProfile.logo : creatorProfile.avatar,
    coverImage: isBrand ? brandProfile.coverImage : creatorProfile.coverImage,
    bio: isBrand ? brandProfile.bio : creatorProfile.bio,
    location: isBrand ? brandProfile.location : creatorProfile.location,
    website: isBrand ? brandProfile.website : creatorProfile.website,
    industryOrNiches: isBrand
      ? brandProfile.industry
      : creatorProfile.niches.join(", "),
  });

  const handleOpenEdit = () => {
    setEditForm({
      name: isBrand ? brandProfile.name : creatorProfile.name,
      handle: isBrand ? brandProfile.handle : creatorProfile.handle,
      avatar: isBrand ? brandProfile.logo : creatorProfile.avatar,
      coverImage: isBrand ? brandProfile.coverImage : creatorProfile.coverImage,
      bio: isBrand ? brandProfile.bio : creatorProfile.bio,
      location: isBrand ? brandProfile.location : creatorProfile.location,
      website: isBrand ? brandProfile.website : creatorProfile.website,
      industryOrNiches: isBrand
        ? brandProfile.industry
        : creatorProfile.niches.join(", "),
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBrand) {
      updateBrandProfile({
        name: editForm.name,
        handle: editForm.handle,
        logo: editForm.avatar,
        coverImage: editForm.coverImage,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        industry: editForm.industryOrNiches,
      });
    } else {
      updateCreatorProfile({
        name: editForm.name,
        handle: editForm.handle,
        avatar: editForm.avatar,
        coverImage: editForm.coverImage,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        niches: editForm.industryOrNiches.split(",").map((s) => s.trim()).filter(Boolean),
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSaveSuccess(false);
    }, 1200);
  };

  const currentCover = isBrand ? brandProfile.coverImage : creatorProfile.coverImage;
  const currentAvatar = isBrand ? brandProfile.logo : creatorProfile.avatar;
  const currentName = isBrand ? brandProfile.name : creatorProfile.name;
  const currentHandle = isBrand ? brandProfile.handle : creatorProfile.handle;
  const currentBio = isBrand ? brandProfile.bio : creatorProfile.bio;
  const currentLocation = isBrand ? brandProfile.location : creatorProfile.location;
  const currentWebsite = isBrand ? brandProfile.website : creatorProfile.website;
  const currentJoined = isBrand ? brandProfile.joinedDate : creatorProfile.joinedDate;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* X/TWITTER INSPIRED PROFILE CONTAINER                                      */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        {/* Banner / Cover */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentCover}
            alt="Cover Banner"
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Profile Info Header */}
        <div className="px-6 sm:px-8 pb-6 relative">
          {/* Avatar & Action Button Row */}
          <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentAvatar}
                alt={currentName}
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                {currentName}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                  isBrand ? "bg-brand-red-50 text-brand-red-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {role}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mt-0.5">@{currentHandle}</p>
          </div>

          {/* Bio */}
          <p className="text-xs sm:text-sm text-slate-700 mt-3.5 max-w-2xl leading-relaxed">
            {currentBio}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500 mt-4">
            {currentLocation && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{currentLocation}</span>
              </div>
            )}
            {currentWebsite && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <a
                  href={currentWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red-600 hover:underline font-bold truncate max-w-[200px]"
                >
                  {currentWebsite.replace("https://", "")}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Joined {currentJoined}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 mt-5 pt-4 border-t border-slate-100 text-xs">
            {isBrand ? (
              <>
                <div>
                  <strong className="text-slate-950 font-black">{campaigns.length}</strong>{" "}
                  <span className="text-slate-500 font-medium">Campaigns</span>
                </div>
                <div>
                  <strong className="text-slate-950 font-black">{brandProfile.creatorsWorkedWith}</strong>{" "}
                  <span className="text-slate-500 font-medium">Creators Worked With</span>
                </div>
                <div>
                  <strong className="text-slate-950 font-black">{brandProfile.activeCampaignsCount}</strong>{" "}
                  <span className="text-slate-500 font-medium">Active Briefs</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong className="text-slate-950 font-black">{creatorProfile.followersCount}</strong>{" "}
                  <span className="text-slate-500 font-medium">Followers</span>
                </div>
                <div>
                  <strong className="text-slate-950 font-black">{creatorProfile.avgEngagement}</strong>{" "}
                  <span className="text-slate-500 font-medium">Avg Engagement</span>
                </div>
                <div>
                  <strong className="text-slate-950 font-black">{creatorProfile.completedCampaignsCount}</strong>{" "}
                  <span className="text-slate-500 font-medium">Campaigns Completed</span>
                </div>
              </>
            )}
          </div>

          {/* Niche Tags for Creator */}
          {!isBrand && creatorProfile.niches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {creatorProfile.niches.map((niche) => (
                <span
                  key={niche}
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 border border-slate-200/50"
                >
                  {niche}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Profile Tabs */}
        <div className="border-t border-slate-200/80 bg-slate-50/50 px-6 sm:px-8 flex items-center gap-4 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "campaigns", label: isBrand ? "Active Campaigns" : "Campaign History" },
            { id: "reels", label: isBrand ? "Creator Content" : "Portfolio Reels" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 text-xs font-extrabold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-brand-red-600 text-brand-red-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-950">About {currentName}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{currentBio}</p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Industry / Focus</p>
              <p className="text-xs font-extrabold text-slate-900 mt-1">
                {isBrand ? brandProfile.industry : creatorProfile.niches.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400">Location Base</p>
              <p className="text-xs font-extrabold text-slate-900 mt-1">{currentLocation}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="space-y-3">
          {campaigns.map((camp) => (
            <Link
              key={camp.id}
              href={`/dashboard/campaigns/${camp.id}`}
              className="block p-4 rounded-3xl border border-slate-200/80 bg-white hover:border-brand-red-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-950">{camp.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700">
                  {camp.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">{camp.description}</p>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "reels" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {reels.map((reel) => (
            <div key={reel.id} className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reel.thumbnailUrl} alt={reel.title} className="h-40 w-full object-cover" />
              <div className="p-3">
                <p className="text-xs font-extrabold text-slate-950 truncate">{reel.title}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{reel.views} views</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
              >
                {saveSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">Profile Saved!</h3>
                    <p className="text-xs text-slate-500">Your changes have been updated and persisted.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base font-black text-slate-950">
                        Edit {isBrand ? "Brand Profile" : "Creator Profile"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Handle (@username)
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.handle}
                          onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Avatar / Logo Image URL
                      </label>
                      <input
                        type="url"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Cover Banner Image URL
                      </label>
                      <input
                        type="url"
                        value={editForm.coverImage}
                        onChange={(e) => setEditForm({ ...editForm, coverImage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Bio / Description
                      </label>
                      <textarea
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          {isBrand ? "Industry" : "Niches (comma separated)"}
                        </label>
                        <input
                          type="text"
                          value={editForm.industryOrNiches}
                          onChange={(e) => setEditForm({ ...editForm, industryOrNiches: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Website Link
                      </label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-2xl bg-slate-900 text-xs font-extrabold text-white hover:bg-black shadow-sm"
                      >
                        Save Changes
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
