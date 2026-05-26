import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taurus Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Taurus (April 20 – May 20). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Venus. Brutally honest astrology — no fluff.",
  keywords: [
    "taurus", "taurus zodiac sign", "taurus personality", "taurus traits",
    "taurus dates", "taurus compatibility", "taurus personality traits",
    "taurus sign", "taurus horoscope", "taurus strengths and weaknesses",
    "taurus in love", "taurus man", "taurus woman", "taurus rising",
    "taurus moon", "taurus zodiac", "taurus element earth",
    "taurus venus ruled", "taurus characteristics",
  ],
  openGraph: {
    title: "Taurus Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Taurus (April 20 – May 20): personality traits, strengths, weaknesses, love compatibility, and what Venus actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/taurus",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/taurus" },
};

export default function TaurusLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Taurus Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/taurus",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Taurus", item: "https://bluntchart.com/zodiac-signs/taurus" },
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