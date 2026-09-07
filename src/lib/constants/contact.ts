export const UGCFY_CONTACT_EMAILS = {
  support: "support@ugcfy.com",
  hello: "hello@ugcfy.com",
  billing: "billing@ugcfy.com",
  payments: "payments@ugcfy.com",
  legal: "legal@ugcfy.com",
  privacy: "privacy@ugcfy.com",
  grievance: "grievance@ugcfy.com",
  security: "security@ugcfy.com",
  admin: "admin@ugcfy.com",
  noReply: "no-reply@ugcfy.com",
  playstore: "playstore@ugcfy.com",
  appstore: "appstore@ugcfy.com",
  tech: "tech@ugcfy.com",
} as const;

export function mailto(email: string, subject?: string) {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${params}`;
}
