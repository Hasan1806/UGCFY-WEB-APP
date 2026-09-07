"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestAccessModal({ isOpen, onClose }: RequestAccessModalProps) {

  const handleStartOnboarding = () => {
    onClose();
    // Dispatch custom event to trigger SIYAA AI onboarding in GlobalChatWidget
    window.dispatchEvent(new CustomEvent("open-SIYAA-onboarding"));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-6 shadow-2xl overflow-hidden z-10"
          >
            {/* Ambient Red Glow in background */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-brand-red-600/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-rose-600/10 blur-3xl pointer-events-none rounded-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon Badge */}
            <div className="flex justify-center mb-5 mt-2">
              <div className="h-14 w-14 bg-gradient-to-tr from-brand-red-500/10 to-rose-500/10 border border-brand-red-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                
              </div>
            </div>

            {/* Content */}
            <div className="text-center px-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
                Meet <span className="text-brand-red-500">SIYAA</span>
              </h3>
              <p className="text-xs text-brand-red-400 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                AI Onboarding Concierge
              </p>

              <p className="text-xs text-zinc-400 leading-relaxed mb-6 font-semibold">
                SIYAA will handle your verification process securely. She will gather your brand profile details, walk you through the onboarding questions, and expedite your access request.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartOnboarding}
              className="w-full py-3.5 px-6 bg-gradient-to-tr from-brand-red-600 to-rose-600 hover:from-brand-red-700 hover:to-rose-700 text-white font-bold rounded-2xl text-xs transition shadow-lg shadow-brand-red-600/20 hover:shadow-brand-red-600/30 cursor-pointer active:scale-[0.98]"
            >
              Start Onboarding with SIYAA ✨
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
