import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancer Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Cancer (June 21 – July 22). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Moon. Brutally honest astrology — no fluff.",
  keywords: [
    "cancer", "cancer zodiac sign", "cancer personality", "cancer traits",
    "cancer dates", "cancer compatibility", "cancer personality traits",
    "cancer sign", "cancer horoscope", "cancer strengths and weaknesses",
    "cancer in love", "cancer man", "cancer woman", "cancer rising",
    "cancer moon", "cancer zodiac", "cancer element water",
    "cancer moon ruled", "cancer characteristics",
  ],
  openGraph: {
    title: "Cancer Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Cancer (June 21 – July 22): personality traits, strengths, weaknesses, love compatibility, and what Moon actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/cancer",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/cancer" },
};

export default function CancerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Cancer Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/cancer",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Cancer", item: "https://bluntchart.com/zodiac-signs/cancer" },
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