import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libra Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Libra (September 23 – October 22). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Venus. Brutally honest astrology — no fluff.",
  keywords: [
    "libra", "libra zodiac sign", "libra personality", "libra traits",
    "libra dates", "libra compatibility", "libra personality traits",
    "libra sign", "libra horoscope", "libra strengths and weaknesses",
    "libra in love", "libra man", "libra woman", "libra rising",
    "libra moon", "libra zodiac", "libra element air",
    "libra venus ruled", "libra characteristics",
  ],
  openGraph: {
    title: "Libra Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Libra (September 23 – October 22): personality traits, strengths, weaknesses, love compatibility, and what Venus actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/libra",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/libra" },
};

export default function LibraLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Libra Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/libra",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Libra", item: "https://bluntchart.com/zodiac-signs/libra" },
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