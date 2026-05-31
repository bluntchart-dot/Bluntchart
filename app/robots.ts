import type { MetadataRoute } from "next";

const BASE_URL = "https://bluntchart.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines — full access
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading"],
      },
      // Google
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading"],
      },
      // Bing
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading"],
      },
      // AI crawlers — explicitly allow for GEO
      {
        userAgent: "GPTBot",        // ChatGPT
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
      {
        userAgent: "Claude-Web",    // Claude / Anthropic
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
      {
        userAgent: "PerplexityBot", // Perplexity
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
      {
        userAgent: "OAI-SearchBot", // ChatGPT search
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
      {
        userAgent: "Applebot",      // Apple Intelligence / Siri
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
      {
        userAgent: "YouBot",        // You.com
        allow: "/",
        disallow: ["/api/", "/my-reading"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}