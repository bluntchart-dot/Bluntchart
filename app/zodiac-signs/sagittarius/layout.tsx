import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sagittarius Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Sagittarius (November 22 – December 21). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Jupiter. Brutally honest astrology — no fluff.",
  keywords: [
    "sagittarius", "sagittarius zodiac sign", "sagittarius personality", "sagittarius traits",
    "sagittarius dates", "sagittarius compatibility", "sagittarius personality traits",
    "sagittarius sign", "sagittarius horoscope", "sagittarius strengths and weaknesses",
    "sagittarius in love", "sagittarius man", "sagittarius woman", "sagittarius rising",
    "sagittarius moon", "sagittarius zodiac", "sagittarius element fire",
    "sagittarius jupiter ruled", "sagittarius characteristics",
    "sagittarius mutable fire", "sagittarius archer", "sagittarius and gemini",
    "sagittarius adventurous", "sagittarius freedom", "sagittarius optimistic",
    "sagittarius travel", "sagittarius philosophy", "sagittarius blunt",
  ],
  openGraph: {
    title: "Sagittarius Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Sagittarius (November 22 – December 21): personality traits, strengths, weaknesses, love compatibility, and what Jupiter actually does to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/sagittarius",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sagittarius Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Adventurous, blunt, and impossible to pin down — everything you need to know about Sagittarius, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/sagittarius" },
};

export default function SagittariusLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Sagittarius Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Sagittarius zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be a Sagittarius Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/sagittarius",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/sagittarius",
        about: {
          "@type": "Thing",
          name: "Sagittarius (astrology)",
          description: "Sagittarius is the ninth astrological sign in the zodiac, spanning from 240° to 270° of celestial longitude. Under the tropical zodiac, the Sun is in Sagittarius roughly from November 22 to December 21.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Sagittarius?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius season runs from November 22 to December 21. People born during this period have Sagittarius as their Sun sign. The exact start date can shift by a day depending on the year, so those born on November 21 or December 22 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Sagittarius?", acceptedAnswer: { "@type": "Answer", text: "Sagittarians are known for being adventurous, optimistic, honest, philosophical, and freedom-loving. They are natural explorers who seek truth and meaning in everything. Their weaknesses include bluntness, restlessness, commitment issues, impatience with details, and a tendency to overpromise and underdeliver." } },
          { "@type": "Question", name: "What signs are most compatible with Sagittarius?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius is most compatible with fellow fire signs Aries and Leo, who match their energy and enthusiasm. Air signs Gemini and Aquarius also pair well, providing intellectual stimulation and shared love of freedom. Sagittarius often has a magnetic but challenging connection with their opposite sign, Gemini." } },
          { "@type": "Question", name: "What is Sagittarius ruled by?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius is ruled by Jupiter, the largest planet in the solar system and the planet of expansion, luck, wisdom, and higher learning. Jupiter gives Sagittarius their optimism, love of travel and philosophy, generosity, and tendency to think big. It also explains their excess — too much of everything, from opinions to appetites." } },
          { "@type": "Question", name: "What element is Sagittarius?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius is a Fire sign, along with Aries and Leo. Fire signs are known for their passion, energy, and enthusiasm. Sagittarius specifically is Mutable Fire — meaning they adapt and spread their passionate energy in multiple directions rather than initiating or sustaining it in one place." } },
          { "@type": "Question", name: "What does Sagittarius Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius Rising (Sagittarius Ascendant) means Sagittarius was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Sagittarius Rising come across as friendly, open, enthusiastic, and slightly restless. They have an approachable energy and a presence that makes people feel like anything is possible." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Sagittarius", item: "https://bluntchart.com/zodiac-signs/sagittarius" },
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