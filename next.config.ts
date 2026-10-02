import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@ai-sdk/react", "@supabase/ssr"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "**.instagram.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/dashboard/feed",
        destination: "/dashboard/inspiration",
        permanent: false,
      },
      {
        source: "/dashboard/messages",
        destination: "/dashboard/collaboration",
        permanent: false,
      },
      {
        source: "/dashboard/poc",
        destination: "/dashboard/team",
        permanent: false,
      },
      {
        source: "/brand/kyc",
        destination: "/dashboard/verification",
        permanent: false,
      },
      {
        source: "/settings",
        destination: "/dashboard/settings",
        permanent: false,
      },
      {
        source: "/legal/terms-of-service",
        destination: "/legal/terms-and-conditions",
        permanent: true,
      },
      {
        source: "/solutions/brands",
        destination: "/ecosystem/brands",
        permanent: true,
      },
      {
        source: "/solutions/agencies",
        destination: "/ecosystem/brands",
        permanent: true,
      },
      {
        source: "/solutions/social-commerce",
        destination: "/ecosystem/brands",
        permanent: true,
      },
      {
        source: "/solutions/content-seeding",
        destination: "/ecosystem/brands",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/legal/terms-and-conditions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
