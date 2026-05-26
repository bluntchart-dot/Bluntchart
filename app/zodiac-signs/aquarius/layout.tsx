import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aquarius Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Aquarius (January 20 – February 18). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Uranus and Saturn. Brutally honest astrology — no fluff.",
  keywords: [
    "aquarius", "aquarius zodiac sign", "aquarius personality", "aquarius traits",
    "aquarius dates", "aquarius compatibility", "aquarius personality traits",
    "aquarius sign", "aquarius horoscope", "aquarius strengths and weaknesses",
    "aquarius in love", "aquarius man", "aquarius woman", "aquarius rising",
    "aquarius moon", "aquarius zodiac", "aquarius element air",
    "aquarius uranus ruled", "aquarius saturn ruled", "aquarius characteristics",
    "aquarius fixed air", "aquarius water bearer", "aquarius and leo",
    "aquarius independent", "aquarius humanitarian", "aquarius rebellious",
    "aquarius intellectual", "aquarius detached", "aquarius innovative",
  ],
  openGraph: {
    title: "Aquarius Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Aquarius (January 20 – February 18): personality traits, strengths, weaknesses, love compatibility, and what Uranus and Saturn actually do to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/aquarius",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquarius Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Independent, unconventional, and impossible to categorize — everything you need to know about Aquarius, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/aquarius" },
};

export default function AquariusLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Aquarius Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Aquarius zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be an Aquarius Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/aquarius",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/aquarius",
        about: {
          "@type": "Thing",
          name: "Aquarius (astrology)",
          description: "Aquarius is the eleventh astrological sign in the zodiac, spanning from 300° to 330° of celestial longitude. Under the tropical zodiac, the Sun is in Aquarius roughly from January 20 to February 18.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Aquarius?", acceptedAnswer: { "@type": "Answer", text: "Aquarius season runs from January 20 to February 18. People born during this period have Aquarius as their Sun sign. The exact start date can shift by a day depending on the year, so those born on January 19 or February 19 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Aquarius?", acceptedAnswer: { "@type": "Answer", text: "Aquarians are known for being independent, intellectual, innovative, humanitarian, and unconventional. They are natural visionaries who think about systems, societies, and the future. Their weaknesses include emotional detachment, stubbornness, contrarianism, an aloof demeanor, and a tendency to intellectualize feelings instead of experiencing them." } },
          { "@type": "Question", name: "What signs are most compatible with Aquarius?", acceptedAnswer: { "@type": "Answer", text: "Aquarius is most compatible with fellow air signs Gemini and Libra, who share their intellectual curiosity and social nature. Fire signs Aries and Sagittarius also pair well, providing energy and enthusiasm that complements Aquarius' ideas. Aquarius often has a magnetic but challenging connection with their opposite sign, Leo." } },
          { "@type": "Question", name: "What is Aquarius ruled by?", acceptedAnswer: { "@type": "Answer", text: "Aquarius has two ruling planets: Uranus (modern ruler) and Saturn (traditional ruler). Uranus governs innovation, rebellion, sudden change, and unconventional thinking, giving Aquarius their visionary nature. Saturn adds structure, discipline, and a serious commitment to their ideals. Together they make Aquarius both revolutionary and systematic." } },
          { "@type": "Question", name: "What element is Aquarius?", acceptedAnswer: { "@type": "Answer", text: "Aquarius is an Air sign, along with Gemini and Libra. Despite the 'water bearer' symbol, Aquarius is not a water sign. Air signs are known for their intellect, communication, and social orientation. Aquarius specifically is Fixed Air — meaning they sustain and commit to their ideas and ideals with unwavering determination." } },
          { "@type": "Question", name: "What does Aquarius Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Aquarius Rising (Aquarius Ascendant) means Aquarius was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Aquarius Rising come across as unique, friendly, slightly eccentric, and intellectually engaged. They have an approachable yet detached energy that makes people curious about them." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Aquarius", item: "https://bluntchart.com/zodiac-signs/aquarius" },
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