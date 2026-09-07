"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  "More POC capacity",
  "More campaign access",
  "Advanced creator discovery",
  "Shortlist and invite tools",
  "Priority support",
  "Premium analytics",
  "Faster campaign workflow",
];

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4">
          <motion.button
            type="button"
            aria-label="Close pricing modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pricing-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-2xl sm:p-6"
          >
            <button
              type="button"
              aria-label="Close pricing modal"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-2xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="pr-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-red-100 bg-brand-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-red-600">
                
                Go Plus
              </div>
              <h2 id="pricing-modal-title" className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Upgrade to Go Plus
              </h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-600">
                Scale your team and campaign workflow with higher limits, deeper creator tooling, and premium operational support.
              </p>
            </div>

            <div className="mt-6 rounded-[22px] border border-slate-200 bg-brand-surface p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold text-slate-950">Go Plus</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">For brands scaling UGC campaigns with larger teams.</p>
                </div>
                <div className="shrink-0 rounded-2xl bg-white px-4 py-3 text-left shadow-sm sm:text-right">
                  <p className="text-2xl font-extrabold text-slate-950">₹4,999</p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">per month</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700">
                    <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-brand-red-600" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700">
              Payment setup coming soon. Subscription checkout is not connected yet, so this action is intentionally disabled.
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                disabled
                className="min-h-11 flex-1 cursor-not-allowed rounded-2xl bg-slate-200 px-5 text-sm font-extrabold text-slate-500"
              >
                Upgrade to Go Plus
              </button>
              <button
                type="button"
                onClick={onClose}
                className="min-h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
