"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, KeyRound, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPromptModal({ isOpen, onClose }: LoginPromptModalProps) {
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden z-10 text-gray-900"
          >
            {/* Ambient Purple Glow in background */}
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-[var(--color-primary)]/10 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-purple-500/10 blur-3xl pointer-events-none rounded-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon Badge */}
            <div className="flex justify-center mb-6 mt-4">
              <div className="h-16 w-16 bg-gradient-to-tr from-[var(--color-primary)]/10 to-purple-500/10 border border-[var(--color-primary)]/20 rounded-2xl flex items-center justify-center shadow-inner text-[var(--color-primary)]">
                <KeyRound className="h-7 w-7" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center px-2">
              <h3 className="text-2xl font-black tracking-tight mb-3 text-gray-900">
                Login to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-purple-600">continue</span>
              </h3>
              <p className="text-xs text-purple-600 font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                UGCFY Platform Access
              </p>

              <p className="text-sm text-gray-500 leading-relaxed mb-8 font-medium">
                Join UGCFY to connect with creators, campaigns, and brand opportunities.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full py-4 px-6 bg-gradient-to-tr from-[var(--color-primary)] to-purple-600 hover:from-[var(--color-primary-hover)] hover:to-purple-700 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-purple-500/20 text-center active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-2xl text-sm transition-all border border-gray-100 text-center active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
