import type { MetadataRoute } from "next";

const BASE_URL = "https://bluntchart.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engines — full access
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading", "/admin/", "/internal/"],
      },
      // Google
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading", "/admin/", "/internal/"],
      },
      // Bing
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/my-reading", "/admin/", "/internal/"],
      },
      // AI crawlers — explicitly allow for GEO
      {
        userAgent: "GPTBot",        // ChatGPT
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
      {
        userAgent: "Claude-Web",    // Claude / Anthropic
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
      {
        userAgent: "PerplexityBot", // Perplexity
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
      {
        userAgent: "OAI-SearchBot", // ChatGPT search
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
      {
        userAgent: "Applebot",      // Apple Intelligence / Siri
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
      {
        userAgent: "YouBot",        // You.com
        allow: "/",
        disallow: ["/api/", "/my-reading", "/admin/", "/internal/"],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      "https://blog.bluntchart.com/sitemap.xml",
    ],
    host: BASE_URL,
  };
}