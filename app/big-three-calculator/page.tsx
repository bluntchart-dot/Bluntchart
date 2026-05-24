import type { Metadata } from "next";
import BigThreeClient from "./BigThreeClient";

export const metadata: Metadata = {
  title: "Big Three Calculator — Sun, Moon & Rising Sign Free | BluntChart",
  description:
    "Find your Big Three — Sun, Moon, and Rising signs — free with our astrology calculator. Discover how your core identity, emotional nature, and outward personality work together. High-precision ephemeris. No signup.",
  keywords: [
    "big three astrology",
    "sun moon rising calculator",
    "big three calculator",
    "what are my big three",
    "sun moon rising sign",
    "big 3 astrology",
    "whats my big three",
    "big three signs",
    "sun moon rising sign calculator",
    "my big three astrology",
    "find my big three",
    "astrology big 3 calculator",
    "sun moon ascendant calculator",
    "big three zodiac",
  ],
  openGraph: {
    title: "Free Big Three Calculator — Sun, Moon & Rising | BluntChart",
    description: "Find your Big Three astrology signs free. Sun = who you are. Moon = how you feel. Rising = how the world sees you.",
    url: "https://bluntchart.com/big-three-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Your Big Three? Free Sun Moon Rising Calculator | BluntChart",
    description: "Sun, Moon, Rising — your three most important astrology placements. Find yours free, instantly.",
  },
  alternates: { canonical: "https://bluntchart.com/big-three-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Big Three Calculator",
      url: "https://bluntchart.com/big-three-calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Free Sun, Moon, and Rising sign calculator using high-precision astronomical ephemeris. Find your Big Three astrology placements instantly.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What are the Big Three in astrology?", acceptedAnswer: { "@type": "Answer", text: "The Big Three refers to your Sun sign, Moon sign, and Rising sign (Ascendant) — the three most important placements in your birth chart. Your Sun sign is your core identity. Your Moon sign is your emotional nature and inner world. Your Rising sign is how others perceive you and your outward personality. Together they give a far more complete picture than your Sun sign alone." } },
        { "@type": "Question", name: "How do I find my Big Three?", acceptedAnswer: { "@type": "Answer", text: "To find your Big Three, you need your birth date, exact birth time (from your birth certificate), and birth city. Enter these into a Big Three calculator. Your Sun sign is determined by your birth date. Your Moon sign requires the date and approximate time. Your Rising sign requires the exact time and location." } },
        { "@type": "Question", name: "Why are the Big Three important?", acceptedAnswer: { "@type": "Answer", text: "The Big Three are important because they capture the three most fundamental dimensions of your personality. Sun = your ego and conscious identity. Moon = your emotions, instincts, and subconscious needs. Rising = your social mask, first impressions, and physical appearance. Most people identify with their Big Three far more than their Sun sign alone." } },
        { "@type": "Question", name: "Can two people have the same Big Three?", acceptedAnswer: { "@type": "Answer", text: "It's extremely rare. While many people share a Sun sign, the Moon changes signs every 2.5 days and the Rising sign changes every 2 hours. For two people to share all three, they would need to be born on the same day, around the same time, in a similar geographic location. Even then, the exact degrees would differ." } },
        { "@type": "Question", name: "Which is more important — Sun sign or Rising sign?", acceptedAnswer: { "@type": "Answer", text: "Neither is objectively more important — they represent different things. Your Sun sign is your core self that emerges over time. Your Rising sign is your day-to-day personality that others interact with. Many astrologers recommend reading horoscopes for both your Sun and Rising signs for the most accurate picture." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Big Three Calculator", item: "https://bluntchart.com/big-three-calculator" },
      ],
    },
  ],
};

export default function BigThreePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BigThreeClient />
    </>
  );
}