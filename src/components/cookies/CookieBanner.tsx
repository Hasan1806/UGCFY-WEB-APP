"use client";

import React from "react";
import { useCookieConsent } from "@/context/CookieConsentProvider";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function CookieBanner() {
  const { showBanner, acceptNecessary, acceptAll, rejectAll, openSettings } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:pb-8 pointer-events-none"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden pointer-events-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6">
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0A0A0A] mb-2 flex items-center justify-between">
                  Cookies & Privacy
                  <button 
                    onClick={acceptNecessary} 
                    className="md:hidden text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close cookie banner"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
                  We use cookies to keep our website secure, improve your browsing experience, analyze site performance, and support marketing. You can accept all cookies, use only necessary cookies, or manage your preferences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
                <button
                  onClick={openSettings}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition text-center w-full sm:w-auto"
                >
                  Manage
                </button>
                <button
                  onClick={rejectAll}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition text-center w-full sm:w-auto"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2.5 rounded-lg bg-[#E11D48] text-white font-semibold text-sm hover:bg-[#BE123C] transition text-center w-full sm:w-auto"
                >
                  Accept All
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
