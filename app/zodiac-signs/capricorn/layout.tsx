import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capricorn Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Capricorn (December 22 – January 19). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Saturn. Brutally honest astrology — no fluff.",
  keywords: [
    "capricorn", "capricorn zodiac sign", "capricorn personality", "capricorn traits",
    "capricorn dates", "capricorn compatibility", "capricorn personality traits",
    "capricorn sign", "capricorn horoscope", "capricorn strengths and weaknesses",
    "capricorn in love", "capricorn man", "capricorn woman", "capricorn rising",
    "capricorn moon", "capricorn zodiac", "capricorn element earth",
    "capricorn saturn ruled", "capricorn characteristics",
    "capricorn cardinal earth", "capricorn sea goat", "capricorn and cancer",
    "capricorn ambitious", "capricorn discipline", "capricorn workaholic",
    "capricorn determination", "capricorn responsible", "capricorn stoic",
  ],
  openGraph: {
    title: "Capricorn Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Capricorn (December 22 – January 19): personality traits, strengths, weaknesses, love compatibility, and what Saturn actually does to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/capricorn",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capricorn Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Ambitious, disciplined, and impossible to outwork — everything you need to know about Capricorn, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/capricorn" },
};

export default function CapricornLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Capricorn Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Capricorn zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be a Capricorn Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/capricorn",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/capricorn",
        about: {
          "@type": "Thing",
          name: "Capricorn (astrology)",
          description: "Capricorn is the tenth astrological sign in the zodiac, spanning from 270° to 300° of celestial longitude. Under the tropical zodiac, the Sun is in Capricorn roughly from December 22 to January 19.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Capricorn?", acceptedAnswer: { "@type": "Answer", text: "Capricorn season runs from December 22 to January 19. People born during this period have Capricorn as their Sun sign. The exact start date can shift by a day depending on the year, so those born on December 21 or January 20 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Capricorn?", acceptedAnswer: { "@type": "Answer", text: "Capricorns are known for being ambitious, disciplined, patient, responsible, and strategic. They are natural planners who build toward long-term goals with relentless persistence. Their weaknesses include emotional coldness, workaholism, pessimism, stubbornness, and a tendency to equate self-worth with professional achievement." } },
          { "@type": "Question", name: "What signs are most compatible with Capricorn?", acceptedAnswer: { "@type": "Answer", text: "Capricorn is most compatible with fellow earth signs Taurus and Virgo, who share their practical approach and value stability. Water signs Scorpio and Pisces also pair well, providing emotional depth that balances Capricorn's stoicism. Capricorn often has a magnetic but challenging connection with their opposite sign, Cancer." } },
          { "@type": "Question", name: "What is Capricorn ruled by?", acceptedAnswer: { "@type": "Answer", text: "Capricorn is ruled by Saturn, the planet of discipline, structure, time, responsibility, and karma. Saturn gives Capricorn their work ethic, patience, respect for tradition, and understanding that lasting success requires sustained effort. It also explains their tendency toward pessimism, rigidity, and the feeling that nothing ever comes easily." } },
          { "@type": "Question", name: "What element is Capricorn?", acceptedAnswer: { "@type": "Answer", text: "Capricorn is an Earth sign, along with Taurus and Virgo. Earth signs are known for their practicality, reliability, and grounded nature. Capricorn specifically is Cardinal Earth — meaning they initiate and build with strategic, goal-oriented energy rather than sustaining or adapting it." } },
          { "@type": "Question", name: "What does Capricorn Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Capricorn Rising (Capricorn Ascendant) means Capricorn was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Capricorn Rising come across as serious, composed, competent, and slightly reserved. They project authority and maturity, often looking older when young and younger when old." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Capricorn", item: "https://bluntchart.com/zodiac-signs/capricorn" },
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