import type { Metadata } from "next";
import BirthChartBookClient from "./BirthChartBookClient";

export const metadata: Metadata = {
  title: "In-Depth Birth Chart Reading | Personalized Natal Chart Analysis | BluntChart",
  description:
    "Get a personalized birth chart reading built from your exact planetary placements. 10 chapters covering current transits, natal chart analysis, career, love, money, and purpose. Delivered as an online book + PDF in under 10 minutes. $24.",
  keywords: [
    "birth chart reading",
    "natal chart reading",
    "in-depth birth chart reading",
    "personalized birth chart reading",
    "birth chart analysis",
    "natal chart analysis",
    "astrology birth chart reading",
    "detailed birth chart reading",
    "astrology transits",
    "birth chart report PDF",
    "in depth natal chart reading",
  ],
  openGraph: {
    title:
      "In-Depth Birth Chart Reading — Personalized Natal Chart Analysis",
    description:
      "A personalized birth chart reading covering 10 chapters: your current transits, natal placements, career, love, money, and purpose. Built from real planetary positions. $24, delivered in minutes.",
    url: "https://bluntchart.com/in-depth-birth-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "In-Depth Birth Chart Reading | Personalized Natal Chart Analysis | BluntChart",
    description:
      "A personalized birth chart reading: 10 chapters built from your exact planetary positions. Current transits + full natal chart analysis. Ready in under 10 minutes.",
  },
  alternates: {
    canonical: "https://bluntchart.com/in-depth-birth-chart",
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "In-Depth Birth Chart Reading",
  description:
    "Personalized birth chart reading and natal chart analysis covering 10 chapters across your current astrology transits and birth chart placements. Delivered as an online book + downloadable PDF. Generated from real ephemeris data.",
  brand: { "@type": "Brand", name: "BluntChart" },
  offers: {
    "@type": "Offer",
    price: "24",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://bluntchart.com/in-depth-birth-chart",
  },
  category: "Astrology Reading",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an in-depth birth chart reading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An in-depth birth chart reading is a personalized analysis of every planet, house, and aspect in your natal chart — the map of the sky at the exact moment and place you were born. Unlike a basic horoscope that only covers your Sun sign, a full birth chart reading interprets your Moon sign, Rising sign, Mercury, Venus, Mars, and outer planets across all 12 houses to reveal patterns in your personality, career, relationships, and life path.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are birth chart readings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Birth chart readings are based on the precise astronomical positions of planets at your exact birth time and location, calculated using ephemeris data. The accuracy of the chart itself is mathematical. The interpretation depends on the astrologer or framework used. BluntChart uses an interpretive framework built by human astrologers, combined with AI to generate a personalized narrative from your specific placements — so two people born on the same day in different cities get different readings.",
      },
    },
    {
      "@type": "Question",
      name: "What do I need for a birth chart reading?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You need three things: your date of birth, your exact time of birth (as close to the minute as possible), and your place of birth. The birth time determines your Rising sign and house placements, which are essential for an accurate natal chart analysis. If you don't know your exact birth time, you can still get a reading, but some chapters will be more approximate.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between a birth chart reading and a horoscope?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A horoscope is a general forecast based on your Sun sign — one of 12 categories shared by everyone born in a roughly month-long window. A birth chart reading (also called a natal chart reading) is personalized to your exact birth time and location. It analyzes all planetary placements, house positions, and aspects unique to you. An in-depth reading also covers current transits — where the planets are now relative to your birth chart — showing what's active in your life right now.",
      },
    },
    {
      "@type": "Question",
      name: "How is this birth chart reading delivered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "After purchase, your personalized birth chart reading generates in 5-10 minutes. You receive a link to a swipeable online book you can read immediately, plus a downloadable PDF version. No account required — it's yours permanently.",
      },
    },
  ],
};

export default function BirthChartBookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BirthChartBookClient />
    </>
  );
}
