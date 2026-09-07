import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, "../"),
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
