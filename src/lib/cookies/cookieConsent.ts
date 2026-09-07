export const COOKIE_CONSENT_VERSION = "2026-07-01";
export const COOKIE_CONSENT_KEY = "ugcfy_cookie_consent";

export interface ConsentPreferences {
  version: string;
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  acceptedAt: string;
  updatedAt: string;
}

export function getDefaultConsent(): ConsentPreferences {
  const now = new Date().toISOString();
  return {
    version: COOKIE_CONSENT_VERSION,
    necessary: true,
    analytics: false,
    marketing: false,
    acceptedAt: now,
    updatedAt: now,
  };
}

export function isValidConsent(consent: unknown): consent is ConsentPreferences {
  if (!consent || typeof consent !== 'object') return false;
  const c = consent as Record<string, unknown>;
  return (
    c.version === COOKIE_CONSENT_VERSION &&
    typeof c.necessary === 'boolean' &&
    typeof c.analytics === 'boolean' &&
    typeof c.marketing === 'boolean' &&
    typeof c.acceptedAt === 'string' &&
    typeof c.updatedAt === 'string'
  );
}

export function saveConsentToStorage(consent: ConsentPreferences) {
  if (typeof window === 'undefined') return;

  consent.updatedAt = new Date().toISOString();
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));

  // 180 days expiry for the browser cookie
  const maxAge = 60 * 60 * 24 * 180;
  
  // Safe value encoding without personal info
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      v: consent.version,
      n: consent.necessary,
      a: consent.analytics,
      m: consent.marketing,
    })
  );

  document.cookie = `${COOKIE_CONSENT_KEY}=${cookieValue}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

export function getConsentFromStorage(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (isValidConsent(parsed)) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.error("Failed to parse cookie consent from storage:", err);
    return null;
  }
}

/**
 * Helper to delete all cookies that might have been set by analytics (e.g., _ga).
 * Keeps necessary cookies intact.
 */
export function clearAnalyticsCookies() {
  if (typeof window === 'undefined') return;
  const cookies = document.cookie.split("; ");
  cookies.forEach(c => {
    const name = c.split("=")[0];
    if (!name) return;
    // List of known analytics cookies to clear
    if (name.startsWith("_ga") || name.startsWith("_gid") || name === "_gat") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

/**
 * Helper to delete marketing cookies (e.g., fbp).
 */
export function clearMarketingCookies() {
  if (typeof window === 'undefined') return;
  const cookies = document.cookie.split("; ");
  cookies.forEach(c => {
    const name = c.split("=")[0];
    if (!name) return;
    if (name.startsWith("_fbp") || name.startsWith("_gcl")) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}
