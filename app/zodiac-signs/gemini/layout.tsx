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
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the Gemini dates?", acceptedAnswer: { "@type": "Answer", text: "May 21 to June 20. Those on cusp dates should check their birth chart." } },
          { "@type": "Question", name: "What planet rules Gemini?", acceptedAnswer: { "@type": "Answer", text: "Mercury, the planet of communication and thought. It gives Gemini their quick mind and restless curiosity." } },
          { "@type": "Question", name: "What element is Gemini?", acceptedAnswer: { "@type": "Answer", text: "Air, along with Libra and Aquarius. Gemini is Mutable Air — adapting and communicating." } },
          { "@type": "Question", name: "What signs are most compatible with Gemini?", acceptedAnswer: { "@type": "Answer", text: "Aries and Leo (fire signs matching energy), and Aquarius (air sign sharing intellectual curiosity)." } },
          { "@type": "Question", name: "Why are Gemini called two-faced?", acceptedAnswer: { "@type": "Answer", text: "It's a misconception. Their duality is genuine versatility — they contain multiple perspectives and see every side simultaneously." } },
          { "@type": "Question", name: "What is Gemini Rising?", acceptedAnswer: { "@type": "Answer", text: "Your outward personality projects curiosity and wit. People see you as quick, youthful, and adaptable." } },
          { "@type": "Question", name: "What is Gemini Moon?", acceptedAnswer: { "@type": "Answer", text: "You process emotions through thought and conversation. Anxiety spirals when you can't articulate what's wrong." } },
        ],
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