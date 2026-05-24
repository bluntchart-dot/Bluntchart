import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",          // Don't crawl API routes
          "/my-reading",    // Private reading pages (token-gated)
        ],
      },
    ],
    sitemap: "https://bluntchart.com/sitemap.xml",
  };
}