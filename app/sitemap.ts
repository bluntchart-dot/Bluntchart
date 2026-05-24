import type { MetadataRoute } from "next";

const BASE_URL = "https://bluntchart.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    // ── Homepage ──
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },

    // ── Free tool pages ──
    {
      url: `${BASE_URL}/free-birth-chart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/natal-chart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/big-three-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/moon-sign-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rising-sign-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    // ── Zodiac hub + only Aries is live ──
    {
      url: `${BASE_URL}/zodiac-signs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/zodiac-signs/aries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ── Legal ──
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refunds`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}