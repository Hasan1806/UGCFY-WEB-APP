"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ConsentPreferences,
  getDefaultConsent,
  getConsentFromStorage,
  saveConsentToStorage,
  clearAnalyticsCookies,
  clearMarketingCookies,
} from "@/lib/cookies/cookieConsent";

interface CookieConsentContextType {
  consent: ConsentPreferences;
  hasConsent: boolean;
  showBanner: boolean;
  isSettingsOpen: boolean;
  canUseAnalytics: boolean;
  canUseMarketing: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  acceptNecessary: () => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: ConsentPreferences) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences>(getDefaultConsent());
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const initialize = () => {
      setIsMounted(true);
      const storedConsent = getConsentFromStorage();
      if (storedConsent) {
        setConsent(storedConsent);
        setHasConsent(true);
        setShowBanner(false);
        
        // Cleanup cookies if they were previously accepted but now rejected
        if (!storedConsent.analytics) clearAnalyticsCookies();
        if (!storedConsent.marketing) clearMarketingCookies();
      } else {
        setShowBanner(true);
      }
    };
    
    initialize();
  }, []);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const applyConsent = (newConsent: ConsentPreferences) => {
    setConsent(newConsent);
    setHasConsent(true);
    setShowBanner(false);
    saveConsentToStorage(newConsent);

    if (!newConsent.analytics) clearAnalyticsCookies();
    if (!newConsent.marketing) clearMarketingCookies();
  };

  const acceptNecessary = () => {
    applyConsent({
      ...getDefaultConsent(),
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const acceptAll = () => {
    applyConsent({
      ...getDefaultConsent(),
      necessary: true,
      analytics: true,
      marketing: true,
    });
    closeSettings();
  };

  const rejectAll = () => {
    applyConsent({
      ...getDefaultConsent(),
      necessary: true,
      analytics: false,
      marketing: false,
    });
    closeSettings();
  };

  const savePreferences = (preferences: ConsentPreferences) => {
    applyConsent(preferences);
    closeSettings();
  };

  const value: CookieConsentContextType = {
    consent,
    hasConsent,
    showBanner: isMounted ? showBanner : false,
    isSettingsOpen: isMounted ? isSettingsOpen : false,
    canUseAnalytics: isMounted && hasConsent ? consent.analytics : false,
    canUseMarketing: isMounted && hasConsent ? consent.marketing : false,
    openSettings,
    closeSettings,
    acceptNecessary,
    acceptAll,
    rejectAll,
    savePreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
