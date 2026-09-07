"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "@/context/CookieConsentProvider";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CookieCategoryToggle from "./CookieCategoryToggle";
import { ConsentPreferences } from "@/lib/cookies/cookieConsent";

export default function CookieSettingsModal() {
  const { isSettingsOpen, closeSettings, consent, savePreferences, acceptAll, rejectAll } = useCookieConsent();
  const [localConsent, setLocalConsent] = useState<ConsentPreferences>(consent);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const initialize = () => {
      if (isSettingsOpen) {
        setLocalConsent(consent);
        previousFocus.current = document.activeElement as HTMLElement;
        // Focus modal on open
        setTimeout(() => {
          modalRef.current?.focus();
        }, 50);
        
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeSettings();
          }
        };
        document.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.body.style.overflow = '';
          previousFocus.current?.focus();
        };
      }
    };
    
    return initialize();
  }, [isSettingsOpen, consent, closeSettings]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    savePreferences(localConsent);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
        onClick={closeSettings}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0 }}
          className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          tabIndex={-1}
          ref={modalRef}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
            <h2 id="cookie-settings-title" className="text-xl font-bold text-[#0A0A0A]">
              Cookie Preferences
            </h2>
            <button
              onClick={closeSettings}
              className="text-gray-400 hover:text-gray-900 transition-colors rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E11D48]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-gray-500 mb-6">
              We use cookies to help you navigate efficiently and perform certain functions. You will find detailed information about all cookies under each consent category below.
            </p>

            <div className="flex flex-col gap-2">
              <CookieCategoryToggle
                id="cookie-necessary"
                title="Strictly Necessary"
                description="Required for website security, session management, preferences, and core functionality. These cannot be disabled."
                checked={true}
                disabled={true}
                onChange={() => {}}
              />
              <CookieCategoryToggle
                id="cookie-analytics"
                title="Analytics"
                description="Helps us understand website usage and improve performance."
                checked={localConsent.analytics}
                onChange={(checked) => setLocalConsent({ ...localConsent, analytics: checked })}
              />
              <CookieCategoryToggle
                id="cookie-marketing"
                title="Marketing"
                description="Helps us measure campaigns and show relevant promotional content."
                checked={localConsent.marketing}
                onChange={(checked) => setLocalConsent({ ...localConsent, marketing: checked })}
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={rejectAll}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-transparent"
              >
                Reject All
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#E11D48] focus:border-transparent"
              >
                Accept All
              </button>
            </div>
            
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#E11D48] text-white font-semibold text-sm hover:bg-[#BE123C] transition w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E11D48] whitespace-nowrap"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
