import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://www.ugcfy.com";

  const routes = [
    "",
    "/about",
    "/contact",
    "/ai-integration",
    "/legal/privacy-policy",
    "/legal/terms-and-conditions",
    "/legal/community-guidelines",
    "/legal/grievance",
    "/legal/security",
    "/legal/delete-account",
    "/support",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
