"use client";

import React from "react";
import { useCookieConsent } from "@/context/CookieConsentProvider";

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CookieSettingsButton({ className, children }: CookieSettingsButtonProps) {
  const { openSettings } = useCookieConsent();

  return (
    <button
      onClick={openSettings}
      className={className || "hover:text-[#E11D48] transition-colors"}
    >
      {children || "Cookie Settings"}
    </button>
  );
}
