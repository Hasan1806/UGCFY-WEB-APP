"use client";

import React from "react";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ExternalLink,
  Instagram,
  MapPin,
  Play,
  Send,
  X,
} from "lucide-react";
import { Creator } from "@/types/creator";
import { formatFollowerCount, formatNumberIndian } from "@/lib/creators/filterEngine";
import CreatorAvatar from "./CreatorAvatar";

interface CreatorProfileModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (creatorId: string) => void;
}

export default function CreatorProfileModal({
  creator,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: CreatorProfileModalProps) {
  if (!isOpen || !creator) return null;

  const username = creator.instagramUsername;
  const avatarUrl = creator.profileImageUrl;
  const isVerified = creator.verified;
  const locationLabel = [creator.city, creator.state].filter(Boolean).join(", ") || creator.country || "India";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-[#E8E8E8] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Sticky Header with Title, Close, and Actions */}
        <div className="relative border-b border-[#E8E8E8] bg-white px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F5F5F5] text-[#111111]">
              <Instagram className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
              Creator Profile
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={creator.instagramProfileUrl || `https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E8E8] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] hover:border-[#D0D0D0] transition"
            >
              <Instagram className="h-3.5 w-3.5 text-pink-600" />
              <span className="hidden sm:inline">Instagram</span>
              <ExternalLink className="h-3 w-3 text-[#8A8A8A]" />
            </a>

            <button
              type="button"
              onClick={() => onToggleSave(creator.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition cursor-pointer ${
                isSaved
                  ? "border-brand-red-200 bg-brand-red-50 text-brand-red-600 shadow-xs"
                  : "border-[#E8E8E8] bg-white text-[#8A8A8A] hover:bg-[#F5F5F5] hover:text-[#111111]"
              }`}
              aria-label={isSaved ? "Saved to shortlist" : "Save to shortlist"}
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 fill-brand-red-600 text-brand-red-600" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#8A8A8A] hover:bg-[#F5F5F5] hover:text-[#111111] transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">
          {/* Creator Primary Identity Section */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <CreatorAvatar
                src={avatarUrl}
                name={creator.displayName}
                username={username}
                size={72}
                className="ring-1 ring-[#E8E8E8]"
              />
              {isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-500 shadow-xs ring-1 ring-white">
                  <CheckCircle2 className="h-4 w-4 fill-blue-500 text-white" />
                </span>
              )}
            </div>

            {/* Name, Handle, Location */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-semibold text-[#111111] leading-tight">
                  {creator.displayName || `@${username}`}
                </h2>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#F5F5F5] border border-[#E8E8E8] px-2 py-0.5 text-[10px] font-medium text-[#111111]">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#666666] mt-1">
                <span className="font-medium text-[#111111] flex items-center gap-1">
                  @{username}
                </span>
                <span className="text-[#D0D0D0]">•</span>
                <span className="flex items-center gap-1 text-[#666666]">
                  <MapPin className="h-3 w-3 text-[#8A8A8A]" />
                  {locationLabel}
                </span>
              </div>

              {/* Niches Chips */}
              <div className="mt-2.5 flex flex-wrap gap-1">
                {creator.primaryNiche && (
                  <span className="rounded-md bg-[#F5F5F5] border border-[#E8E8E8] px-2 py-0.5 text-xs font-medium text-[#111111]">
                    {creator.primaryNiche}
                  </span>
                )}
                {creator.niches
                  .filter((n) => n !== creator.primaryNiche)
                  .map((n) => (
                    <span
                      key={n}
                      className="rounded-md bg-[#FAFAFA] border border-[#E8E8E8] px-2 py-0.5 text-xs text-[#666666]"
                    >
                      {n}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Bio Snippet */}
          {creator.bio && (
            <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-xs sm:text-sm text-[#666666] leading-relaxed">
              {creator.bio}
            </div>
          )}

          {/* 4 Key Metrics Bar */}
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#8A8A8A] mb-2">
              Performance Metrics
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-center">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#8A8A8A]">
                  Followers
                </div>
                <div className="mt-0.5 text-base font-semibold text-[#111111]">
                  {formatFollowerCount(creator.followersCount)}
                </div>
                <div className="text-[10px] text-[#8A8A8A] mt-0.5">
                  {formatNumberIndian(creator.followersCount)} total
                </div>
              </div>

              <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-center">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#8A8A8A]">
                  Engagement
                </div>
                <div className="mt-0.5 text-base font-semibold text-emerald-600">
                  {typeof creator.engagementRate === "number" ? `${creator.engagementRate}%` : "N/A"}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Above average
                </div>
              </div>

              <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-center">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#8A8A8A]">
                  Avg. Likes
                </div>
                <div className="mt-0.5 text-base font-semibold text-[#111111]">
                  {formatFollowerCount(creator.avgLikes)}
                </div>
                <div className="text-[10px] text-[#8A8A8A] mt-0.5">per post</div>
              </div>

              <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3 text-center">
                <div className="text-[10px] font-medium uppercase tracking-wider text-[#8A8A8A]">
                  Avg. Reel Views
                </div>
                <div className="mt-0.5 text-base font-semibold text-[#111111]">
                  {formatFollowerCount(creator.avgReelViews)}
                </div>
                <div className="text-[10px] text-[#8A8A8A] mt-0.5">per reel</div>
              </div>
            </div>
          </div>

          {/* Top Reels Performance */}
          {creator.topReels && creator.topReels.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] mb-2">
                <Play className="h-3.5 w-3.5 text-[#111111]" />
                Top Performing UGC Content
              </div>
              <div className="space-y-1.5">
                {creator.topReels.map((reel, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-[#E8E8E8] bg-white px-3 py-2 text-xs"
                  >
                    <span className="font-medium text-[#111111] truncate">
                      {reel.title}
                    </span>
                    <div className="flex items-center gap-3 shrink-0 text-[#666666] font-medium text-[11px]">
                      <span>{reel.views} views</span>
                      <span>{reel.likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rate Card & Starting Price */}
          {creator.startingPrice && (
            <div className="rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-[#666666]">
                  Estimated UGC Rate
                </span>
                <div className="text-base font-semibold text-[#111111]">
                  Starting from ₹{formatNumberIndian(creator.startingPrice)}
                </div>
              </div>
              <div className="text-xs text-[#8A8A8A] sm:text-right">
                Includes usage rights & 1 revision round
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA Bar */}
        <div className="border-t border-[#E8E8E8] bg-white px-5 sm:px-6 py-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E8E8E8] px-3.5 py-1.5 text-xs font-medium text-[#666666] hover:bg-[#F5F5F5] transition cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleSave(creator.id);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E8E8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] transition cursor-pointer"
          >
            {isSaved ? "Saved in Shortlist" : "Add to Shortlist"}
          </button>

          <a
            href={`/dashboard/campaigns`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-red-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-brand-red-700 transition"
          >
            <Send className="h-3.5 w-3.5" />
            Invite to Campaign
          </a>
        </div>
      </div>
    </div>
  );
}
