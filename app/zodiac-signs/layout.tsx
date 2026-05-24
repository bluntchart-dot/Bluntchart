import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "12 Zodiac Signs — Dates, Personality Traits, Compatibility & Meaning | BluntChart",
  description:
    "Explore all 12 zodiac signs with dates, personality traits, strengths, weaknesses, compatibility, and element meanings. Aries through Pisces — understand your Sun sign and what it reveals about you. Brutally honest astrology.",
  keywords: [
    "zodiac signs", "12 zodiac signs", "zodiac sign dates", "zodiac signs meaning",
    "zodiac sign traits", "zodiac signs personality", "astrology signs",
    "zodiac sign compatibility", "zodiac elements", "star signs",
    "sun signs", "horoscope signs", "zodiac sign dates and traits",
    "what zodiac sign am i", "zodiac signs list",
  ],
  openGraph: {
    title: "12 Zodiac Signs — Personality Traits, Dates & Compatibility | BluntChart",
    description: "All 12 zodiac signs explained. Dates, traits, strengths, weaknesses, compatibility. Brutally honest astrology.",
    url: "https://bluntchart.com/zodiac-signs",
    siteName: "BluntChart",
    type: "website",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs" },
};

export default function ZodiacSignsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "12 Zodiac Signs",
        url: "https://bluntchart.com/zodiac-signs",
        description: "Complete guide to all 12 zodiac signs with dates, personality traits, compatibility, and meanings.",
        hasPart: [
          { "@type": "Article", name: "Aries", url: "https://bluntchart.com/zodiac-signs/aries" },
          { "@type": "Article", name: "Taurus", url: "https://bluntchart.com/zodiac-signs/taurus" },
          { "@type": "Article", name: "Gemini", url: "https://bluntchart.com/zodiac-signs/gemini" },
          { "@type": "Article", name: "Cancer", url: "https://bluntchart.com/zodiac-signs/cancer" },
          { "@type": "Article", name: "Leo", url: "https://bluntchart.com/zodiac-signs/leo" },
          { "@type": "Article", name: "Virgo", url: "https://bluntchart.com/zodiac-signs/virgo" },
          { "@type": "Article", name: "Libra", url: "https://bluntchart.com/zodiac-signs/libra" },
          { "@type": "Article", name: "Scorpio", url: "https://bluntchart.com/zodiac-signs/scorpio" },
          { "@type": "Article", name: "Sagittarius", url: "https://bluntchart.com/zodiac-signs/sagittarius" },
          { "@type": "Article", name: "Capricorn", url: "https://bluntchart.com/zodiac-signs/capricorn" },
          { "@type": "Article", name: "Aquarius", url: "https://bluntchart.com/zodiac-signs/aquarius" },
          { "@type": "Article", name: "Pisces", url: "https://bluntchart.com/zodiac-signs/pisces" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
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