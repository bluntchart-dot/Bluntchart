import type { Metadata } from "next";
import RisingSignClient from "./RisingSignClient";

export const metadata: Metadata = {
  title: "Rising Sign Calculator: Find Your Ascendant | BluntChart",
  description:
    "Find your Rising sign free using your exact birth time and place. See your Ascendant, chart ruler and full Big Three instantly. No account, no paywall.",
  openGraph: {
    title: "Free Rising Sign Calculator | BluntChart",
    description:
      "Find your Rising sign (Ascendant) free using high-precision ephemeris. Enter birth date, time, and place. Instant result.",
    url: "https://bluntchart.com/rising-sign-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Rising Sign Calculator | BluntChart",
    description: "What's your Rising sign? Enter your birth time and find out instantly — free, no signup.",
  },
  alternates: {
    canonical: "https://bluntchart.com/rising-sign-calculator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Rising Sign Calculator",
      url: "https://bluntchart.com/rising-sign-calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Free Rising sign (Ascendant) calculator using high-precision astronomical ephemeris. Enter your birth date, time, and place to find your Ascendant sign instantly.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is your birthday sign your Rising sign?", acceptedAnswer: { "@type": "Answer", text: "No. Your birthday sign is your Sun sign, determined by date alone. Your Rising sign is determined by the time and place you were born. They coincide only if you were born close to sunrise, which puts the Sun on the eastern horizon by definition — roughly 1 in 12 people." } },
        { "@type": "Question", name: "How do you calculate your Ascendant manually?", acceptedAnswer: { "@type": "Answer", text: "The traditional method uses a Table of Houses: convert your birth time to Local Mean Time (correcting for historical daylight saving), find Sidereal Time at Greenwich for noon on your birth date, adjust for elapsed time and longitude to get Local Sidereal Time, then look up LST and your latitude in the table. The calculator above resolves it directly from a high-precision ephemeris." } },
        { "@type": "Question", name: "Can I find my Rising sign without my birth time?", acceptedAnswer: { "@type": "Answer", text: "No — this is the one placement that genuinely cannot be derived without a time. The Ascendant changes signs every 2 hours, so an unknown time means twelve candidates. Anyone offering a Rising sign without birth time is guessing or running a personality quiz." } },
        { "@type": "Question", name: "What is a chart ruler?", acceptedAnswer: { "@type": "Answer", text: "Your chart ruler is the planet that rules your Rising sign — Aries Rising is ruled by Mars, Taurus and Libra by Venus, Cancer by the Moon, Leo by the Sun, Sagittarius by Jupiter, and so on. Its sign, house, and aspects describe the overall trajectory of your life more accurately than almost any single placement." } },
        { "@type": "Question", name: "What is my Descendant sign?", acceptedAnswer: { "@type": "Answer", text: "Your Descendant is the sign opposite your Rising — always 180° away, on the western horizon. It's the cusp of your 7th house of partnership. It describes the quality you don't experience as your own and keep meeting in other people. The pattern 'I always attract the same type' is very often the Descendant." } },
        { "@type": "Question", name: "Does my Rising sign affect my appearance?", acceptedAnswer: { "@type": "Answer", text: "Traditional astrology says yes; controlled evidence doesn't exist. Appearance is genetics. What likely happens is the Rising sign governs presentation — posture, expression, mannerism, eye contact — and those change how a face reads. It's a reasonable framework for the part of appearance that's actually behaviour." } },
        { "@type": "Question", name: "Which Rising sign is rarest?", acceptedAnswer: { "@type": "Answer", text: "It depends on your latitude. At mid-northern latitudes, Aries, Pisces, Aquarius and Capricorn Rising are genuinely less common, while Libra, Scorpio and Virgo Rising are over-represented. The effect intensifies further north and reverses in the southern hemisphere." } },
        { "@type": "Question", name: "Is any Rising sign the luckiest?", acceptedAnswer: { "@type": "Answer", text: "No. The Ascendant alone carries no fortune. Sagittarius and Pisces Rising are Jupiter-ruled by tradition, but a Sagittarius Rising with Jupiter in fall in Capricorn is not having an easier life than a Capricorn Rising with a well-placed Saturn. What matters is the condition of your chart ruler." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Rising Sign Calculator", item: "https://bluntchart.com/rising-sign-calculator" },
      ],
    },
  ],
};

export default function RisingSignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RisingSignClient />
    </>
  );
}