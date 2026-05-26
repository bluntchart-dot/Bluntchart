import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leo Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Leo (July 23 – August 22). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Sun. Brutally honest astrology — no fluff.",
  keywords: [
    "leo", "leo zodiac sign", "leo personality", "leo traits",
    "leo dates", "leo compatibility", "leo personality traits",
    "leo sign", "leo horoscope", "leo strengths and weaknesses",
    "leo in love", "leo man", "leo woman", "leo rising",
    "leo moon", "leo zodiac", "leo element fire",
    "leo sun ruled", "leo characteristics",
  ],
  openGraph: {
    title: "Leo Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Leo (July 23 – August 22): personality traits, strengths, weaknesses, love compatibility, and what Sun actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/leo",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/leo" },
};

export default function LeoLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Leo Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/leo",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Leo", item: "https://bluntchart.com/zodiac-signs/leo" },
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