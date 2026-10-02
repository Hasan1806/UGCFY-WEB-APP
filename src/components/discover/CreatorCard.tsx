"use client";

import React from "react";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Eye,
  MapPin,
} from "lucide-react";
import { Creator, ViewMode } from "@/types/creator";
import { formatFollowerCount } from "@/lib/creators/filterEngine";
import CreatorAvatar from "./CreatorAvatar";

interface CreatorCardProps {
  creator: Creator;
  viewMode?: ViewMode;
  isSaved: boolean;
  onToggleSave: (creatorId: string) => void;
  onViewProfile: (creator: Creator) => void;
}

export default function CreatorCard({
  creator,
  viewMode = "grid",
  isSaved,
  onToggleSave,
  onViewProfile,
}: CreatorCardProps) {
  const username = creator.instagramUsername;
  const avatarUrl = creator.profileImageUrl;
  const isVerified = creator.verified;
  const followersCount = creator.followersCount;
  const locationLabel = [creator.city, creator.state].filter(Boolean).join(", ") || creator.country || "India";

  // LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <div
        className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-[#E8E8E8] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:border-[#D0D0D0] hover:shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
      >
        {/* Creator Info & Identity */}
        <div className="flex items-center gap-3.5 min-w-0 md:w-1/3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <CreatorAvatar
              src={avatarUrl}
              name={creator.displayName}
              username={username}
              size={48}
              className="ring-1 ring-[#E8E8E8]"
            />
            {isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-blue-500 shadow-xs ring-1 ring-white">
                <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-[#111111] group-hover:text-brand-red-600 transition">
                {creator.displayName || `@${username}`}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 text-xs mt-0.5">
              <a
                href={`https://www.instagram.com/${username}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-medium text-pink-600 hover:underline hover:text-pink-700 transition"
                onClick={(e) => e.stopPropagation()}
              >
                @{username}
              </a>
              <span className="text-[#D0D0D0]">•</span>
              <span className="truncate flex items-center gap-0.5 text-[11px] text-[#8A8A8A]">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                {locationLabel}
              </span>
            </div>

            {/* Niches */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              {creator.primaryNiche && (
                <span className="rounded-md bg-[#F5F5F5] border border-[#E8E8E8] px-1.5 py-0.5 text-[10px] font-medium text-[#111111]">
                  {creator.primaryNiche}
                </span>
              )}
              {creator.niches
                .filter((n) => n !== creator.primaryNiche)
                .slice(0, 1)
                .map((n) => (
                  <span
                    key={n}
                    className="rounded-md bg-[#FAFAFA] border border-[#E8E8E8] px-1.5 py-0.5 text-[10px] text-[#666666]"
                  >
                    {n}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-4 gap-2 md:w-5/12 text-center py-2 md:py-0 border-y md:border-y-0 md:border-x border-[#E8E8E8] px-2 md:px-4">
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Followers
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(followersCount)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Engagement
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-emerald-600">
              {typeof creator.engagementRate === "number" ? `${creator.engagementRate}%` : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Avg. Likes
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(creator.avgLikes)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Reel Views
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(creator.avgReelViews)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-end md:w-1/4">
          <button
            type="button"
            onClick={() => onToggleSave(creator.id)}
            aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
            className={`flex h-8.5 w-8.5 items-center justify-center rounded-lg border transition cursor-pointer ${
              isSaved
                ? "border-brand-red-200 bg-brand-red-50 text-brand-red-600 shadow-xs"
                : "border-[#E8E8E8] bg-white text-[#8A8A8A] hover:border-[#D0D0D0] hover:bg-[#F5F5F5] hover:text-[#111111]"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 fill-brand-red-600 text-brand-red-600" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onViewProfile(creator)}
            className="flex-1 md:flex-initial inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg bg-brand-red-600 px-3.5 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:bg-brand-red-700 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            View Profile
          </button>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT (DEFAULT)
  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl border border-[#E8E8E8] bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-150 hover:-translate-y-[1px] hover:border-[#D0D0D0] hover:shadow-[0_3px_6px_rgba(0,0,0,0.04)]"
    >
      {/* Top Header Row: Avatar, Identity, and Bookmark Button */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="relative shrink-0">
              <CreatorAvatar
                src={avatarUrl}
                name={creator.displayName}
                username={username}
                size={48}
                className="ring-1 ring-[#E8E8E8]"
              />
              {isVerified && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-blue-500 shadow-xs ring-1 ring-white">
                  <CheckCircle2 className="h-3 w-3 fill-blue-500 text-white" />
                </span>
              )}
            </div>

            {/* Name, Handle & Location */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-[#111111] group-hover:text-brand-red-600 transition">
                {creator.displayName || `@${username}`}
              </h3>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <a
                  href={`https://www.instagram.com/${username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate font-medium text-pink-600 hover:underline hover:text-pink-700 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  @{username}
                </a>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#8A8A8A] mt-0.5">
                <MapPin className="h-2.5 w-2.5 shrink-0" />
                <span className="truncate">
                  {locationLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => onToggleSave(creator.id)}
            aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition cursor-pointer ${
              isSaved
                ? "border-brand-red-200 bg-brand-red-50 text-brand-red-600 shadow-xs"
                : "border-[#E8E8E8] bg-white text-[#8A8A8A] hover:border-[#D0D0D0] hover:bg-[#F5F5F5] hover:text-[#111111]"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="h-3.5 w-3.5 fill-brand-red-600 text-brand-red-600" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Niches Chips */}
        <div className="mt-3 flex flex-wrap gap-1">
          {creator.primaryNiche && (
            <span className="rounded-md bg-[#F5F5F5] border border-[#E8E8E8] px-2 py-0.5 text-[10px] font-medium text-[#111111]">
              {creator.primaryNiche}
            </span>
          )}
          {creator.niches
            .filter((n) => n !== creator.primaryNiche)
            .slice(0, 2)
            .map((n) => (
              <span
                key={n}
                className="rounded-md bg-[#FAFAFA] border border-[#E8E8E8] px-2 py-0.5 text-[10px] text-[#666666]"
              >
                {n}
              </span>
            ))}
        </div>

        {/* Bio Snippet */}
        {creator.bio && (
          <p className="mt-2.5 line-clamp-2 text-xs text-[#666666] leading-relaxed">
            {creator.bio}
          </p>
        )}
      </div>

      {/* 4 Metric Statistics Cards */}
      <div className="mt-4 pt-3 border-t border-[#E8E8E8]">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#FAFAFA] p-2.5 border border-[#E8E8E8]">
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Followers
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(followersCount)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Engagement
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-emerald-600">
              {typeof creator.engagementRate === "number" ? `${creator.engagementRate}%` : "N/A"}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Avg. Likes
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(creator.avgLikes)}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-[#8A8A8A] uppercase tracking-wider">
              Avg. Reel Views
            </div>
            <div className="mt-0.5 text-xs sm:text-sm font-semibold text-[#111111]">
              {formatFollowerCount(creator.avgReelViews)}
            </div>
          </div>
        </div>

        {/* Card CTA */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProfile(creator)}
            className="flex-1 inline-flex h-8.5 items-center justify-center gap-1.5 rounded-lg bg-brand-red-600 px-3 text-xs font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:bg-brand-red-700 cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
