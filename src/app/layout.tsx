import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientChatWrapper from "@/components/ClientChatWrapper";
import { CookieConsentProvider } from "@/context/CookieConsentProvider";
import CookieBanner from "@/components/cookies/CookieBanner";
import CookieSettingsModal from "@/components/cookies/CookieSettingsModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.ugcfy.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UGC FY — AI-Powered Influencer Marketing Platform",
    template: "%s | UGC FY",
  },
  description:
    "UGC FY helps brands discover creators, manage UGC campaigns, review content, track performance, and scale influencer marketing with AI-powered workflows.",
  applicationName: "UGC FY",
  authors: [{ name: "UGC FY" }],
  creator: "UGC FY",
  publisher: "UGC FY",
  category: "Marketing Technology",
  keywords: [
    "UGC FY",
    "UGC platform",
    "influencer marketing",
    "creator marketing",
    "UGC campaigns",
    "brand creator collaboration",
    "AI influencer marketing",
    "creator discovery",
    "campaign management",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "UGC FY",
    title: "UGC FY — AI-Powered Influencer Marketing Platform",
    description:
      "Discover creators, launch UGC campaigns, manage approvals, and track creator performance with AI-powered influencer marketing workflows.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UGC FY — AI-Powered Influencer Marketing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UGC FY — AI-Powered Influencer Marketing Platform",
    description:
      "AI-powered creator discovery, UGC campaign management, content approvals, and performance tracking for modern brands.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-gray-900" suppressHydrationWarning>
        <CookieConsentProvider>
          {children}
          <CookieBanner />
          <CookieSettingsModal />
          <ClientChatWrapper />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
