import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gemini Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Gemini (May 21 – June 20). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Mercury. Brutally honest astrology — no fluff.",
  keywords: [
    "gemini", "gemini zodiac sign", "gemini personality", "gemini traits",
    "gemini dates", "gemini compatibility", "gemini personality traits",
    "gemini sign", "gemini horoscope", "gemini strengths and weaknesses",
    "gemini in love", "gemini man", "gemini woman", "gemini rising",
    "gemini moon", "gemini zodiac", "gemini element air",
    "gemini mercury ruled", "gemini characteristics",
  ],
  openGraph: {
    title: "Gemini Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Gemini (May 21 – June 20): personality traits, strengths, weaknesses, love compatibility, and what Mercury actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/gemini",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/gemini" },
};

export default function GeminiLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Gemini Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/gemini",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Gemini", item: "https://bluntchart.com/zodiac-signs/gemini" },
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