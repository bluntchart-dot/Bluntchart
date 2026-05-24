import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Natal Chart — Astrology Chart Reading & Interpretation | BluntChart",
  description:
    "Get your free natal chart with planetary positions, houses, and aspects. Understand what your astrology chart reveals about your personality, relationships, and life path. High-precision ephemeris, instant result, no signup.",
  keywords: [
    "free natal chart", "natal chart", "natal chart calculator", "natal chart reading",
    "natal chart interpretation", "free natal chart reading", "natal chart online",
    "astrology natal chart", "natal chart meaning", "natal chart free online",
    "natal chart report", "natal chart analysis", "my natal chart", "natal horoscope",
    "free astrology chart", "natal chart with interpretation",
  ],
  openGraph: {
    title: "Free Natal Chart Reading & Interpretation | BluntChart",
    description: "Generate your free natal chart instantly. Understand what your planets, houses, and aspects reveal about you.",
    url: "https://bluntchart.com/natal-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Natal Chart — Your Astrology Blueprint | BluntChart",
    description: "Your natal chart is your cosmic fingerprint. Generate yours free.",
  },
  alternates: { canonical: "https://bluntchart.com/natal-chart" },
};

export default function NatalChartLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "BluntChart Free Natal Chart",
        url: "https://bluntchart.com/natal-chart",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: "Free natal chart generator with planetary positions, house placements, and aspect analysis.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What is a natal chart?", acceptedAnswer: { "@type": "Answer", text: "A natal chart is a map of the sky at the exact moment of your birth, showing the positions of all planets across the zodiac signs and houses." } },
          { "@type": "Question", name: "How do I read a natal chart?", acceptedAnswer: { "@type": "Answer", text: "Start with Sun (identity), Moon (emotions), and Rising (outward personality). Then examine each planet's sign and house placement." } },
          { "@type": "Question", name: "Is a natal chart the same as a horoscope?", acceptedAnswer: { "@type": "Answer", text: "No. Your natal chart is a permanent calculation of your birth sky. A horoscope is a forecast based on current planetary movements." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Free Natal Chart", item: "https://bluntchart.com/natal-chart" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}