"use client";

import React from "react";
import { PlayCircle, Image as ImageIcon, BarChart3, TrendingUp, CheckCircle2, Clock, Eye } from "lucide-react";

export default function CampaignDashboardMockup() {
  const deliverables = [
    {
      type: "4K Video Review",
      platform: "YouTube",
      creator: "@aanya.creates",
      status: "Approved",
      views: "920K",
      icon: PlayCircle,
      iconColor: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      type: "Sponsored Reel",
      platform: "Instagram",
      creator: "@rohan.fits",
      status: "In Review",
      views: "450K",
      icon: ImageIcon,
      iconColor: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      type: "Hook & Unboxing",
      platform: "Instagram",
      creator: "@priyanair",
      status: "Drafting",
      views: "680K",
      icon: PlayCircle,
      iconColor: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="w-full h-full bg-white rounded-2xl md:rounded-[24px] border border-gray-100/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden text-sm select-none">
      {/* SaaS Window Header */}
      <div className="bg-[#FAF8F8] border-b border-gray-100 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="text-xs font-bold text-gray-700 ml-2">Campaign Console</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
            ● Live Campaign
          </span>
          <div className="flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
            <span>85%</span>
            <span className="text-[10px] text-gray-400 font-semibold uppercase">Done</span>
          </div>
        </div>
      </div>

      {/* KPI Micro Strip */}
      <div className="grid grid-cols-3 gap-2 px-4 sm:px-5 py-2.5 bg-[#FAF9F8] border-b border-gray-100 text-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Reach</span>
          <span className="text-xs sm:text-sm font-black text-gray-900">2.4M</span>
        </div>
        <div className="flex flex-col border-x border-gray-200/60">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Avg. Eng.</span>
          <span className="text-xs sm:text-sm font-black text-gray-900 flex items-center justify-center gap-0.5 text-emerald-600">
            4.8% <TrendingUp className="w-2.5 h-2.5" />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Verified ROI</span>
          <span className="text-xs sm:text-sm font-black text-gray-900">4.2x</span>
        </div>
      </div>

      {/* Deliverable Rows */}
      <div className="p-3 sm:p-4 flex flex-col gap-2.5 flex-1 bg-[#FCFBFA]/50">
        <div className="flex justify-between items-center px-1 mb-0.5">
          <span className="text-xs font-bold text-gray-700">Recent Content Deliverables</span>
          <span className="text-[11px] text-gray-400 font-medium">3 of 6 Approved</span>
        </div>

        {deliverables.map((item, i) => (
          <div
            key={i}
            className="bg-white p-2.5 sm:p-3 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between group hover:border-rose-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <item.icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-gray-900 text-xs sm:text-sm leading-tight">
                  {item.type}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {item.creator} • <span className="text-gray-400">{item.platform}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                <Eye className="w-3 h-3 text-gray-400" /> {item.views}
              </span>

              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 ${
                  item.status === "Approved"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : item.status === "In Review"
                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {item.status === "Approved" && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />}
                {item.status === "In Review" && <Clock className="w-2.5 h-2.5 text-amber-600" />}
                <span>{item.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom SaaS Reach Highlight */}
      <div className="border-t border-gray-100 p-3 sm:p-3.5 bg-gray-950 text-white flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Campaign Performance</div>
            <div className="text-xs font-semibold text-gray-200">
              <span className="text-emerald-400 font-bold">+184% reach surge</span> vs. past benchmarks
            </div>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <span className="text-base sm:text-lg font-black text-white">2.4M</span>
          <span className="block text-[9px] text-gray-400 font-bold uppercase">Impressions</span>
        </div>
      </div>
    </div>
  );
}
