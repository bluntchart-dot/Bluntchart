import type { Metadata } from "next";
import RisingSignClient from "./RisingSignClient";

export const metadata: Metadata = {
  title: "Rising Sign Calculator — Find Your Ascendant Sign Free | BluntChart",
  description:
    "Find your Rising sign (Ascendant) instantly with our free calculator. Enter your birth date, exact birth time, and birth place. Calculated using high-precision astronomical ephemeris. No signup required.",
  keywords: [
    "rising sign calculator",
    "what is my rising sign",
    "ascendant sign calculator",
    "rising sign",
    "ascendant calculator",
    "what is my ascendant",
    "how to find rising sign",
    "whats my rising sign",
    "calculate rising sign",
    "ascendant sign",
    "rising sign meaning",
    "free rising sign calculator",
    "find my ascendant",
    "rising sign birth time",
  ],
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
        {
          "@type": "Question",
          name: "What is a Rising sign?",
          acceptedAnswer: { "@type": "Answer", text: "Your Rising sign (Ascendant) is the zodiac sign that was rising on the eastern horizon at the exact moment and location of your birth. It shapes how others perceive you, your outward personality, and your physical appearance. It changes roughly every two hours, which is why your exact birth time is essential." },
        },
        {
          "@type": "Question",
          name: "How do I find my Rising sign?",
          acceptedAnswer: { "@type": "Answer", text: "To find your Rising sign, you need three pieces of information: your birth date, your exact birth time (from your birth certificate), and your birth city. Enter these into a Rising sign calculator and it will determine which zodiac sign was on the eastern horizon at your moment of birth." },
        },
        {
          "@type": "Question",
          name: "Can I find my Rising sign without birth time?",
          acceptedAnswer: { "@type": "Answer", text: "No, your exact birth time is essential for determining your Rising sign. The Ascendant changes zodiac signs roughly every 2 hours, so even a 30-minute difference can shift your Rising sign entirely. Check your birth certificate — the birth time is almost always recorded there." },
        },
        {
          "@type": "Question",
          name: "What is the difference between Sun sign and Rising sign?",
          acceptedAnswer: { "@type": "Answer", text: "Your Sun sign represents your core identity, ego, and sense of self — it's determined by your birth date alone. Your Rising sign (Ascendant) represents your outward personality, first impressions, and how others perceive you — it requires your exact birth time and location. Many astrologers consider the Rising sign equally or more important than the Sun sign for understanding your personality." },
        },
        {
          "@type": "Question",
          name: "Why is the Rising sign important?",
          acceptedAnswer: { "@type": "Answer", text: "The Rising sign is important because it determines the entire house system of your birth chart, shaping which life areas are emphasized. It also governs your outward personality, physical appearance, and the first impression you make on others. Many people identify more strongly with their Rising sign than their Sun sign." },
        },
        {
          "@type": "Question",
          name: "Does my Rising sign change?",
          acceptedAnswer: { "@type": "Answer", text: "Your Rising sign is fixed at birth and never changes. However, the Rising sign changes on the horizon approximately every 2 hours throughout the day, which is why two people born on the same day but at different times will have different Rising signs." },
        },
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