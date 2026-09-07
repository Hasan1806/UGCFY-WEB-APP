import React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Info } from "lucide-react";

interface VerificationStatusWallProps {
  status: "pending" | "approved" | "rejected" | "on_hold";
  rejectionReason?: string;
  holdReason?: string;
  onEdit?: () => void;
  onGoDashboard?: () => void;
  onSignOut?: () => void;
}

export function VerificationStatusWall({
  status,
  rejectionReason,
  holdReason,
  onEdit,
  onGoDashboard,
  onSignOut,
}: VerificationStatusWallProps) {
  let Icon = Clock;
  let iconColor = "text-amber-600";
  let iconBg = "bg-amber-50";
  let badgeColor = "border-amber-200 bg-amber-50 text-amber-700";
  let badgeText = "Pending Review";
  let title = "Verification submitted";
  let subtitle = "Your brand verification is under review. We will notify you once the review is complete.";

  if (status === "approved") {
    Icon = CheckCircle2;
    iconColor = "text-emerald-600";
    iconBg = "bg-emerald-50";
    badgeColor = "border-emerald-200 bg-emerald-50 text-emerald-700";
    badgeText = "Verified";
    title = "Verification approved";
    subtitle = "Your brand account has been verified. You can now access the full dashboard.";
  } else if (status === "rejected") {
    Icon = AlertCircle;
    iconColor = "text-red-600";
    iconBg = "bg-red-50";
    badgeColor = "border-red-200 bg-red-50 text-red-700";
    badgeText = "Rejected";
    title = "Verification needs attention";
    subtitle = "Your submission was rejected. Please review the reason below and submit again.";
  } else if (status === "on_hold") {
    Icon = Info;
    iconColor = "text-blue-600";
    iconBg = "bg-blue-50";
    badgeColor = "border-blue-200 bg-blue-50 text-blue-700";
    badgeText = "Action Required";
    title = "Changes requested";
    subtitle = "Our team needs a few updates before we can approve your account.";
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} ${iconColor} mb-6`}>
            <Icon className="h-8 w-8" />
          </div>
          
          <div className={`mb-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeColor}`}>
            {badgeText}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-950">{title}</h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
            {subtitle}
          </p>

          {(status === "rejected" || status === "on_hold") && (
            <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                Reason
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {status === "rejected" ? (rejectionReason || "Please review your details and re-submit.") : (holdReason || "Please update your submission and re-submit.")}
              </p>
            </div>
          )}

          <div className="mt-8 flex w-full flex-col gap-3">
            {status === "approved" && (
              <button
                type="button"
                onClick={onGoDashboard}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-black px-5 text-sm font-extrabold text-white transition hover:bg-slate-800"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {(status === "rejected" || status === "on_hold") && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E11D48] px-5 text-sm font-extrabold text-white transition hover:bg-[#BE123C]"
              >
                {status === "rejected" ? "Edit and Resubmit" : "Update Verification"}
              </button>
            )}

            {status === "pending" && (
              <a
                href="mailto:support@ugcfy.com"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E11D48] px-5 text-sm font-extrabold text-white transition hover:bg-[#BE123C]"
              >
                Contact Support
              </a>
            )}

            {status !== "approved" && (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
