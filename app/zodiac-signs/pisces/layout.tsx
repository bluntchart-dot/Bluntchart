import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pisces Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Pisces (February 19 – March 20). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Neptune and Jupiter. Brutally honest astrology — no fluff.",
  keywords: [
    "pisces", "pisces zodiac sign", "pisces personality", "pisces traits",
    "pisces dates", "pisces compatibility", "pisces personality traits",
    "pisces sign", "pisces horoscope", "pisces strengths and weaknesses",
    "pisces in love", "pisces man", "pisces woman", "pisces rising",
    "pisces moon", "pisces zodiac", "pisces element water",
    "pisces neptune ruled", "pisces jupiter ruled", "pisces characteristics",
    "pisces mutable water", "pisces fish", "pisces and virgo",
    "pisces empathic", "pisces dreamy", "pisces intuitive",
    "pisces creative", "pisces sensitive", "pisces spiritual",
    "pisces escapism", "pisces compassionate", "pisces artistic",
  ],
  openGraph: {
    title: "Pisces Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Pisces (February 19 – March 20): personality traits, strengths, weaknesses, love compatibility, and what Neptune and Jupiter actually do to your chart. No sugarcoating.",
    url: "https://bluntchart.com/zodiac-signs/pisces",
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pisces Zodiac Sign: The Brutally Honest Guide | BluntChart",
    description: "Empathic, creative, and impossible to fully know — everything you need to know about Pisces, without the fluff.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/pisces" },
};

export default function PiscesLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Pisces Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        description: "Complete guide to the Pisces zodiac sign. Personality traits, strengths, weaknesses, love and relationship compatibility, career insights, and what it means to be a Pisces Sun, Moon, or Rising.",
        url: "https://bluntchart.com/zodiac-signs/pisces",
        author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        mainEntityOfPage: "https://bluntchart.com/zodiac-signs/pisces",
        about: {
          "@type": "Thing",
          name: "Pisces (astrology)",
          description: "Pisces is the twelfth and final astrological sign in the zodiac, spanning from 330° to 360° of celestial longitude. Under the tropical zodiac, the Sun is in Pisces roughly from February 19 to March 20.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the dates for Pisces?", acceptedAnswer: { "@type": "Answer", text: "Pisces season runs from February 19 to March 20. People born during this period have Pisces as their Sun sign. The exact start date can shift by a day depending on the year, so those born on February 18 or March 21 should check their birth chart to confirm." } },
          { "@type": "Question", name: "What are the key personality traits of Pisces?", acceptedAnswer: { "@type": "Answer", text: "Pisces are known for being empathic, intuitive, creative, compassionate, and deeply emotional. They are the zodiac's most sensitive sign, capable of absorbing the emotions of everyone around them. Their weaknesses include escapism, indecisiveness, people-pleasing, a tendency toward martyrdom, and difficulty maintaining boundaries." } },
          { "@type": "Question", name: "What signs are most compatible with Pisces?", acceptedAnswer: { "@type": "Answer", text: "Pisces is most compatible with fellow water signs Cancer and Scorpio, who understand their emotional depth without being overwhelmed by it. Earth signs Taurus and Capricorn also pair well, providing the grounding and stability that Pisces needs. Pisces often has a magnetic but complex connection with their opposite sign, Virgo." } },
          { "@type": "Question", name: "What is Pisces ruled by?", acceptedAnswer: { "@type": "Answer", text: "Pisces has two ruling planets: Neptune (modern ruler) and Jupiter (traditional ruler). Neptune governs dreams, imagination, spirituality, illusion, and the unconscious, giving Pisces their otherworldly sensitivity and creative gifts. Jupiter adds expansiveness, faith, and a desire for meaning. Together they make Pisces the zodiac's most spiritually attuned sign." } },
          { "@type": "Question", name: "What element is Pisces?", acceptedAnswer: { "@type": "Answer", text: "Pisces is a Water sign, along with Cancer and Scorpio. Water signs are known for their emotional depth, intuition, and sensitivity. Pisces specifically is Mutable Water — meaning they adapt and flow with emotional currents rather than initiating or sustaining them, making them the most fluid and permeable sign in the zodiac." } },
          { "@type": "Question", name: "What does Pisces Rising mean?", acceptedAnswer: { "@type": "Answer", text: "Pisces Rising (Pisces Ascendant) means Pisces was the zodiac sign on the eastern horizon at your moment of birth. It shapes how others perceive you — people with Pisces Rising come across as gentle, dreamy, empathic, and slightly ethereal. They have a soft, approachable energy and a presence that makes people feel immediately comfortable and understood." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Pisces", item: "https://bluntchart.com/zodiac-signs/pisces" },
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