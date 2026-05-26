import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scorpio Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Scorpio (October 23 – November 21). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Pluto and Mars. Brutally honest astrology — no fluff.",
  keywords: [
    "scorpio", "scorpio zodiac sign", "scorpio personality", "scorpio traits",
    "scorpio dates", "scorpio compatibility", "scorpio personality traits",
    "scorpio sign", "scorpio horoscope", "scorpio strengths and weaknesses",
    "scorpio in love", "scorpio man", "scorpio woman", "scorpio rising",
    "scorpio moon", "scorpio zodiac", "scorpio element water",
    "scorpio pluto ruled", "scorpio mars ruled", "scorpio characteristics",
    "scorpio fixed water", "scorpio intensity", "scorpio and taurus",
    "scorpio jealous", "scorpio mysterious", "scorpio transformation",
  ],
  openGraph: {
    title: "Scorpio Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Scorpio (October 23 – November 21): personality traits, strengths, weaknesses, love compatibility, and what Pluto and Mars actually do to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/scorpio",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scorpio Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Intense, secretive, and impossible to forget — everything you need to know about Scorpio, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/scorpio" },
};

export default function ScorpioLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Scorpio Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Scorpio zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be a Scorpio Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/scorpio",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/scorpio",
        about: {
          "@type": "Thing",
          name: "Scorpio (astrology)",
          description: "Scorpio is the eighth astrological sign in the zodiac, spanning from 210° to 240° of celestial longitude. Under the tropical zodiac, the Sun is in Scorpio roughly from October 23 to November 21.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Scorpio?", acceptedAnswer: { "@type": "Answer", text: "Scorpio season runs from October 23 to November 21. People born during this period have Scorpio as their Sun sign. The exact start date can shift by a day depending on the year, so those born on October 22 or November 22 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Scorpio?", acceptedAnswer: { "@type": "Answer", text: "Scorpios are known for being intense, loyal, perceptive, passionate, and deeply emotional. They are natural investigators who see beneath the surface of everything. Their weaknesses include jealousy, possessiveness, secrecy, a tendency toward obsession, and difficulty letting go of grudges." } },
          { "@type": "Question", name: "What signs are most compatible with Scorpio?", acceptedAnswer: { "@type": "Answer", text: "Scorpio is most compatible with fellow water signs Cancer and Pisces, who understand their emotional depth. Earth signs Virgo and Capricorn also pair well, providing the stability and loyalty Scorpio craves. Scorpio often has a magnetic but volatile connection with their opposite sign, Taurus." } },
          { "@type": "Question", name: "What is Scorpio ruled by?", acceptedAnswer: { "@type": "Answer", text: "Scorpio has two ruling planets: Pluto (modern ruler) and Mars (traditional ruler). Pluto governs transformation, power, death, and rebirth, giving Scorpio their depth and fascination with what lies beneath. Mars adds drive, passion, and intensity. Together they make Scorpio one of the most powerful signs in the zodiac." } },
          { "@type": "Question", name: "What element is Scorpio?", acceptedAnswer: { "@type": "Answer", text: "Scorpio is a Water sign, along with Cancer and Pisces. Water signs are known for their emotional depth, intuition, and sensitivity. Scorpio specifically is Fixed Water — meaning they sustain emotional intensity with unwavering focus rather than initiating or adapting it." } },
          { "@type": "Question", name: "What does Scorpio Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Scorpio Rising (Scorpio Ascendant) means Scorpio was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Scorpio Rising come across as intense, magnetic, mysterious, and slightly intimidating. They have a penetrating gaze and a presence that people notice immediately." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Scorpio", item: "https://bluntchart.com/zodiac-signs/scorpio" },
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