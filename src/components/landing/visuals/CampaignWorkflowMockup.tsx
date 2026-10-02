"use client";

import React from "react";
import { Send, Clock, Mail, Sparkles, UserCheck, FileText, Check } from "lucide-react";

export default function CampaignWorkflowMockup() {
  const steps = [
    {
      title: "Review Profile & Audience Fit",
      status: "completed",
      icon: UserCheck,
      time: "2m ago",
      desc: "Audience verified (89% Mumbai/Delhi)",
    },
    {
      title: "Generate AI Brief & Script Angle",
      status: "completed",
      icon: FileText,
      time: "Just now",
      desc: "Hook: '3 ways to style linen this summer'",
    },
    {
      title: "Send Personalized Outreach",
      status: "current",
      icon: Mail,
      time: "In Progress",
      desc: "Template: D2C High-Conversion Offer",
    },
    {
      title: "Confirm Deliverables & Escrow",
      status: "pending",
      icon: Clock,
      time: "Next Step",
      desc: "Standard 2 Reels + 1 Story deliverable",
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
          <span className="text-xs font-bold text-gray-700 ml-2">Outreach Automation</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Email Synced
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 shadow-2xs">
            32 In Queue
          </span>
        </div>
      </div>

      {/* Target Creator Ribbon */}
      <div className="px-4 sm:px-5 py-2.5 bg-rose-50/50 border-b border-rose-100/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">
            A
          </div>
          <div className="text-xs">
            <span className="font-bold text-gray-900">Sequence: @aanya.creates</span>
            <span className="text-gray-400 text-[10px] ml-1.5 hidden sm:inline">Summer Launch 2026</span>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" /> AI Script Ready
        </span>
      </div>

      {/* Stepper Timeline & Preview */}
      <div className="p-4 sm:p-5 flex flex-col gap-4 flex-1 bg-[#FCFBFA]/50">
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-4 sm:space-y-4.5">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-6 group">
              {/* Stepper Dot */}
              <div
                className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.status === "completed"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : step.status === "current"
                    ? "bg-rose-500 border-rose-500 ring-4 ring-rose-100 animate-pulse"
                    : "bg-white border-gray-300"
                }`}
              >
                {step.status === "completed" && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>

              {/* Step Info */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div
                    className={`font-bold text-xs sm:text-sm leading-tight ${
                      step.status === "completed"
                        ? "text-gray-900"
                        : step.status === "current"
                        ? "text-rose-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 font-medium">{step.desc}</div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      step.status === "completed"
                        ? "bg-emerald-50 text-emerald-700"
                        : step.status === "current"
                        ? "bg-rose-50 text-rose-600 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {step.time}
                  </span>
                </div>
              </div>

              {/* Active Step Quick Action Card */}
              {step.status === "current" && (
                <div className="mt-2.5 p-3 rounded-xl bg-white border border-rose-200/80 shadow-xs flex items-center justify-between gap-2">
                  <div className="text-xs text-gray-700">
                    <span className="font-bold text-gray-900 block">Subject: Brand Collaboration Brief</span>
                    <span className="text-gray-400 text-[10px]">Hi Aanya, we loved your reel on styling...</span>
                  </div>
                  <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-3 py-1.5 rounded-lg font-bold text-xs inline-flex items-center gap-1.5 shadow-xs shrink-0 transition-colors">
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
