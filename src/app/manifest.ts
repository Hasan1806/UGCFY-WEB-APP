import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UGC FY",
    short_name: "UGC FY",
    description:
      "AI-powered influencer marketing and UGC campaign management platform for brands.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBFB",
    theme_color: "#0A0A0A",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
