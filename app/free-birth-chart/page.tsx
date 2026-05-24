import type { Metadata } from "next";
import FreeBirthChartClient from "./FreeBirthChartClient";

/* ── SEO Metadata ────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Free Birth Chart Calculator — Natal Chart with Exact Planetary Positions | BluntChart",
  description:
    "Generate your free birth chart instantly using high-precision ephemeris. Enter your birth date, time, and place to see your Sun, Moon, Rising sign, all planetary placements, houses, and aspects. No signup required.",
  keywords: [
    "free birth chart",
    "natal chart calculator",
    "birth chart free",
    "free natal chart",
    "birth chart calculator",
    "astrology chart",
    "free astrology chart",
    "natal chart free online",
    "rising sign calculator",
    "sun moon rising",
    "birth chart with houses",
    "planetary positions birth chart",
    "free horoscope chart",
  ],
  openGraph: {
    title: "Free Birth Chart Calculator | BluntChart",
    description:
      "Generate your free natal chart with exact planetary positions. Sun, Moon, Rising, Venus, Mars, and more — calculated from high-precision ephemeris.",
    url: "https://bluntchart.com/free-birth-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Birth Chart Calculator | BluntChart",
    description:
      "Your exact natal chart — Sun, Moon, Rising, all planets, houses, and aspects. Free, instant, no signup.",
  },
  alternates: {
    canonical: "https://bluntchart.com/free-birth-chart",
  },
};

/* ── JSON-LD Schema ──────────────────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Free Birth Chart Calculator",
      url: "https://bluntchart.com/free-birth-chart",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free natal chart calculator using high-precision astronomical ephemeris. Get your exact Sun, Moon, Rising sign, planetary placements, house positions, and aspects instantly.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a birth chart?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A birth chart (natal chart) is a map of exactly where every planet was at the exact moment you were born. It shows your Sun sign, Moon sign, Rising sign (Ascendant), and the positions of Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto across the 12 zodiac signs and 12 houses.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need my exact birth time for a birth chart?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your birth time is essential for calculating your Rising sign (Ascendant) and house placements. Without it, your Sun, Moon, and planetary signs will still be accurate, but house positions and the Rising sign may be off. Check your birth certificate for the exact time.",
          },
        },
        {
          "@type": "Question",
          name: "What is a Rising sign?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your Rising sign (Ascendant) is the zodiac sign that was rising on the eastern horizon at the exact moment of your birth. It determines how others perceive you and your outward personality. It requires your exact birth time and location to calculate.",
          },
        },
        {
          "@type": "Question",
          name: "How accurate is this birth chart calculator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This calculator uses astronomy-engine, a high-precision astronomical library that computes geocentric planetary positions. Planet positions are accurate to arc-second precision, matching professional-grade ephemeris tools.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between a birth chart and a horoscope?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A birth chart is a precise map of the sky at your exact moment of birth, unique to you. A horoscope is a general forecast based only on your Sun sign, shared with roughly 1/12th of the population. Birth charts are far more specific and personal.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "BluntChart",
          item: "https://bluntchart.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Birth Chart Calculator",
          item: "https://bluntchart.com/free-birth-chart",
        },
      ],
    },
  ],
};

export default function FreeBirthChartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FreeBirthChartClient />
    </>
  );
}