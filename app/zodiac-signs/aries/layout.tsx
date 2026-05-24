import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aries Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Aries (March 21 – April 19). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Mars. Brutally honest astrology — no fluff.",
  keywords: [
    "aries", "aries zodiac sign", "aries personality", "aries traits",
    "aries dates", "aries compatibility", "aries personality traits",
    "aries sign", "aries horoscope", "aries strengths and weaknesses",
    "aries in love", "aries man", "aries woman", "aries rising",
    "aries moon", "aries zodiac", "aries element fire",
    "aries mars ruled", "aries characteristics",
  ],
  openGraph: {
    title: "Aries Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Aries (March 21 – April 19): personality traits, strengths, weaknesses, love compatibility, and what Mars actually does to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/aries",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aries Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Courageous, impatient, and impossible to ignore — everything you need to know about Aries, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/aries" },
};

export default function AriesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Aries Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Aries zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be an Aries Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/aries",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/aries",
        about: {
          "@type": "Thing",
          name: "Aries (astrology)",
          description: "Aries is the first astrological sign in the zodiac, spanning the first 30 degrees of celestial longitude (0° to 30°). Under the tropical zodiac, the Sun is in Aries roughly from March 21 to April 19.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Aries?", acceptedAnswer: { "@type": "Answer", text: "Aries season runs from March 21 to April 19. People born during this period have Aries as their Sun sign. The exact start date can shift by a day depending on the year, so those born on March 20 or April 20 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Aries?", acceptedAnswer: { "@type": "Answer", text: "Aries are known for being courageous, direct, competitive, energetic, and honest. They are natural leaders who take initiative and act before others think. Their weaknesses include impatience, impulsiveness, short temper, and a tendency to abandon things when they lose interest." } },
          { "@type": "Question", name: "What signs are most compatible with Aries?", acceptedAnswer: { "@type": "Answer", text: "Aries is most compatible with fellow fire signs Leo and Sagittarius, who match their energy and passion. Air signs Gemini and Aquarius also pair well, providing intellectual stimulation. Aries often has a magnetic but challenging connection with their opposite sign, Libra." } },
          { "@type": "Question", name: "What is Aries ruled by?", acceptedAnswer: { "@type": "Answer", text: "Aries is ruled by Mars, the planet of war, action, aggression, and desire. Mars gives Aries their competitive drive, physical energy, direct communication style, and fearless approach to challenges. It also explains their quick temper and tendency toward impatience." } },
          { "@type": "Question", name: "What element is Aries?", acceptedAnswer: { "@type": "Answer", text: "Aries is a Fire sign, along with Leo and Sagittarius. Fire signs are known for their passion, energy, enthusiasm, and dynamic personalities. Aries specifically is Cardinal Fire — meaning they initiate with passionate, direct energy rather than sustaining or adapting it." } },
          { "@type": "Question", name: "What does Aries Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Aries Rising (Aries Ascendant) means Aries was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Aries Rising come across as bold, confident, direct, and energetic. They make strong first impressions and often have a competitive or athletic appearance." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Aries", item: "https://bluntchart.com/zodiac-signs/aries" },
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