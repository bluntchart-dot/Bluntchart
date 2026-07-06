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
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the Taurus dates?", acceptedAnswer: { "@type": "Answer", text: "Taurus season runs from April 20 to May 20. Those born on cusp dates should check their birth chart." } },
          { "@type": "Question", name: "What planet rules Taurus?", acceptedAnswer: { "@type": "Answer", text: "Venus, the planet of love, beauty, and value. It gives Taurus refined taste, sensual nature, and deep attachment to comfort." } },
          { "@type": "Question", name: "What element is Taurus?", acceptedAnswer: { "@type": "Answer", text: "Earth, along with Virgo and Capricorn. Taurus is Fixed Earth — sustaining and preserving rather than initiating or adapting." } },
          { "@type": "Question", name: "What signs are most compatible with Taurus?", acceptedAnswer: { "@type": "Answer", text: "Cancer (emotional depth meets physical security), Virgo (shared practical values), and Capricorn (mutual ambition and work ethic)." } },
          { "@type": "Question", name: "Why are Taurus so stubborn?", acceptedAnswer: { "@type": "Answer", text: "Their Fixed quality means they sustain and persist. Change threatens the stability they've carefully built. Pushing them only makes them dig in harder." } },
          { "@type": "Question", name: "What is Taurus Rising?", acceptedAnswer: { "@type": "Answer", text: "Your outward personality projects Venus energy — calm, attractive, grounded. You make others feel safe." } },
          { "@type": "Question", name: "What is Taurus Moon?", acceptedAnswer: { "@type": "Answer", text: "Your emotional needs center on physical comfort, routine, and security. You process slowly and show love through touch." } },
        ],
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