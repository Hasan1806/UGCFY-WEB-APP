"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Mail } from "lucide-react";

interface AppComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: "app-store" | "google-play" | "mobile-app";
}

export default function AppComingSoonModal({ isOpen, onClose, platform }: AppComingSoonModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Trap focus or at least set initial focus
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const closeButton = modalRef.current.querySelector("button");
      closeButton?.focus();
    }
  }, [isOpen]);

  const platformName = 
    platform === "app-store" ? "App Store" : 
    platform === "google-play" ? "Google Play" : "Mobile App";

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 p-8 text-center"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
              <Smartphone className="h-8 w-8" />
            </div>

            <h2 id="modal-title" className="mb-3 text-2xl font-bold text-slate-900 tracking-tight">
              Mobile app launching soon
            </h2>

            <p className="mb-4 text-slate-600 text-[15px] leading-relaxed">
              The UGCFY mobile app is being prepared for the {platformName} release. We’ll make the download links available as soon as the app goes live.
            </p>

            {(platform === "app-store" || platform === "google-play") && (
              <p className="mb-8 text-sm text-slate-500">
                Questions about {platform === "app-store" ? "iOS" : "Android"} launch?{" "}
                <a 
                  href={`mailto:${platform === "app-store" ? "appstore" : "playstore"}@ugcfy.com`}
                  className="font-semibold text-[var(--color-primary)] hover:underline"
                >
                  {platform === "app-store" ? "appstore" : "playstore"}@ugcfy.com
                </a>
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-slate-900 hover:bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                Got it
              </button>
              <a
                href="/contact"
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-2"
              >
                <Mail className="h-4 w-4" />
                Contact us
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
