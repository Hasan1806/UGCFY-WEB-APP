"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Mail } from "lucide-react";

const GlobalChatDialog = dynamic(() => import("./GlobalChatDialog"), {
  ssr: false,
});

export default function GlobalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [startOnboarding, setStartOnboarding] = useState(false);

  // Onboarding Intercept trigger
  useEffect(() => {
    const handleOpenOnboarding = () => {
      setHasInteracted(true);
      setStartOnboarding(true);
      setIsOpen(true);
    };

    window.addEventListener("open-SIYAA-onboarding", handleOpenOnboarding);
    return () => {
      window.removeEventListener("open-SIYAA-onboarding", handleOpenOnboarding);
    };
  }, []);

  const handleToggle = () => {
    setHasInteracted(true);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* EMAIL / CONTACT US BUTTON */}
      <a
        href="mailto:support@ugcfy.com"
        className={`fixed right-6 z-40 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-500 cursor-pointer group bottom-[96px] overflow-visible ${
          isOpen
            ? "opacity-0 pointer-events-none translate-y-4 scale-75"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        aria-label="Contact Us via Email"
        title="Contact Us"
      >
        {/* Outer Animated Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 blur-[12px] opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none"></div>

        {/* Button Surface */}
        <div className="absolute inset-0 rounded-full bg-[#0A0A0A] border border-white/20 overflow-hidden flex items-center justify-center pointer-events-none shadow-inner transition-colors duration-300 group-hover:border-white/40 group-hover:bg-[#111111]">
          <Mail className="h-6 w-6 text-slate-300 group-hover:text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
      </a>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <button
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-50 h-[60px] w-[60px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:scale-95 transition-all duration-300 cursor-pointer group overflow-visible"
        aria-label="Open Chat with SIYAA"
      >
        {/* Outer Animated Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E11D48] to-[#F43F5E] blur-[12px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none"></div>

        {/* Button Surface */}
        <div className="absolute inset-0 rounded-full bg-[#0A0A0A] border border-white/20 overflow-hidden flex items-center justify-center pointer-events-none shadow-inner">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full h-full text-white"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center w-full h-full text-white"
              >
                <div className="relative">
                  <MessageSquare
                    className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300"
                    fill="currentColor"
                    fillOpacity={0.1}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Indicator */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20 translate-x-[5%] -translate-y-[5%]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0A0A0A]"></span>
          </span>
        )}
      </button>

      {/* LAZY LOADED CHAT DIALOG */}
      {hasInteracted && (
        <GlobalChatDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          startOnboarding={startOnboarding}
        />
      )}
    </>
  );
}
