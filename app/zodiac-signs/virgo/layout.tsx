import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virgo Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Virgo (August 23 – September 22). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Mercury. Brutally honest astrology — no fluff.",
  keywords: [
    "virgo", "virgo zodiac sign", "virgo personality", "virgo traits",
    "virgo dates", "virgo compatibility", "virgo personality traits",
    "virgo sign", "virgo horoscope", "virgo strengths and weaknesses",
    "virgo in love", "virgo man", "virgo woman", "virgo rising",
    "virgo moon", "virgo zodiac", "virgo element earth",
    "virgo mercury ruled", "virgo characteristics", "virgo perfectionist",
    "virgo mutable earth", "virgo analytical", "virgo and pisces",
  ],
  openGraph: {
    title: "Virgo Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Virgo (August 23 – September 22): personality traits, strengths, weaknesses, love compatibility, and what Mercury actually does to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/virgo",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virgo Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Analytical, selfless, and quietly devastating — everything you need to know about Virgo, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/virgo" },
};

export default function VirgoLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Virgo Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Virgo zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be a Virgo Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/virgo",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/virgo",
        about: {
          "@type": "Thing",
          name: "Virgo (astrology)",
          description: "Virgo is the sixth astrological sign in the zodiac, spanning from 150° to 180° of celestial longitude. Under the tropical zodiac, the Sun is in Virgo roughly from August 23 to September 22.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Virgo?", acceptedAnswer: { "@type": "Answer", text: "Virgo season runs from August 23 to September 22. People born during this period have Virgo as their Sun sign. The exact start date can shift by a day depending on the year, so those born on August 22 or September 23 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Virgo?", acceptedAnswer: { "@type": "Answer", text: "Virgos are known for being analytical, detail-oriented, practical, hardworking, and deeply caring. They are natural problem-solvers who notice what everyone else misses. Their weaknesses include perfectionism, overthinking, harsh self-criticism, and a tendency to worry about everything." } },
          { "@type": "Question", name: "What signs are most compatible with Virgo?", acceptedAnswer: { "@type": "Answer", text: "Virgo is most compatible with fellow earth signs Taurus and Capricorn, who share their practical approach to life. Water signs Cancer and Scorpio also pair well, providing the emotional depth Virgo secretly craves. Virgo often has a magnetic but complex connection with their opposite sign, Pisces." } },
          { "@type": "Question", name: "What is Virgo ruled by?", acceptedAnswer: { "@type": "Answer", text: "Virgo is ruled by Mercury, the planet of communication, intellect, and analysis. Mercury gives Virgo their sharp mind, attention to detail, strong communication skills, and methodical approach to problem-solving. It also explains their tendency to overthink and get lost in details." } },
          { "@type": "Question", name: "What element is Virgo?", acceptedAnswer: { "@type": "Answer", text: "Virgo is an Earth sign, along with Taurus and Capricorn. Earth signs are known for being practical, grounded, and reliable. Virgo specifically is Mutable Earth — meaning they adapt and refine with flexible, service-oriented energy rather than initiating or sustaining it." } },
          { "@type": "Question", name: "What does Virgo Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Virgo Rising (Virgo Ascendant) means Virgo was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Virgo Rising come across as composed, observant, helpful, and put-together. They give off an impression of quiet competence and tend to have clean, understated style." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Virgo", item: "https://bluntchart.com/zodiac-signs/virgo" },
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