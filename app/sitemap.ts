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
    // ── Zodiac Pages ──
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
{
  url: `${BASE_URL}/zodiac-signs/taurus`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/gemini`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/cancer`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/leo`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/virgo`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/libra`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/scorpio`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/sagittarius`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/capricorn`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/aquarius`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
{
  url: `${BASE_URL}/zodiac-signs/pisces`,
  lastModified: now,
  changeFrequency: "monthly",
  priority: 0.8,
},
    // ── Learn / Editorial ──
    {
      url: `${BASE_URL}/free-birth-chart-readings`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/is-mercury-retrograde`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mercury-retrograde-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/mercury-retrograde-in-cancer-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/mercury-retrograde-in-scorpio-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/venus-retrograde-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/saturn-return-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/why-you-attract-the-wrong-person`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },

    // ── Quizzes / calculators ──
    {
      url: `${BASE_URL}/relationship-red-flags-birth-chart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/career-strength-birth-chart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/love-language-birth-chart`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-toxic-are-you-quiz`,
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