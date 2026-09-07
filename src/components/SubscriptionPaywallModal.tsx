"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, X } from "lucide-react";

interface SubscriptionPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export default function SubscriptionPaywallModal({
  isOpen,
  onClose,
  onUpgrade
}: SubscriptionPaywallModalProps) {
  if (!isOpen) return null;

  const features = [
    "Launch Unlimited UGC Campaigns",
    "Direct Creator Chat & Contact Access",
    "Advanced Real-Time Campaign Analytics",
    "Escrow Protection fee reduced to 1.5%",
    "Priority Creator Matchmaking & Vetting"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0D0D12]/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-left"
      >
        {/* Glow ambient background lights */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-brand-red-600/15 blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-zinc-800/20 blur-[60px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-xl text-zinc-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-red-950/50 border border-brand-red-500/30 text-brand-red-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            
            <span>Premium Tier</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Unlock Unlimited Scale <br />
            on <span className="text-brand-red-500">UGC FY</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
            You&apos;ve successfully created 3 Proof of Concepts! Upgrade to our Premium Subscription tier to launch unlimited campaigns, unlock direct creator contact, and access advanced analytics.
          </p>
        </div>

        {/* Benefits List */}
        <div className="my-6 p-4.5 bg-zinc-900/40 border border-zinc-850 rounded-2xl space-y-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-800 pb-1.5">
            What&apos;s included in Premium:
          </span>
          <div className="space-y-2">
            {features.map((feature, i) => (
              <div key={i} className="flex gap-2 items-center text-xs text-zinc-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onUpgrade}
            className="w-full bg-brand-red-600 hover:bg-brand-red-700 text-white rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-brand-red-600/20 hover:shadow-brand-red-600/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
          >
            <Zap className="h-4 w-4 fill-white" />
            Upgrade Now (₹4,999/mo)
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-transparent hover:bg-zinc-900/50 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl py-3 text-xs font-bold transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
