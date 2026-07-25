import type { Metadata } from "next";
import CoStarAlternativeClient from "./CoStarAlternativeClient";

export const metadata: Metadata = {
  title: "The Best Co-Star Alternative in 2026 (No Subscription) | BluntChart",
  description:
    "Looking for a Co-Star alternative? BluntChart is a brutally honest, full birth chart reading — ~1,500 words, one-time $15, no subscription. Deeper than a daily notification.",
  alternates: { canonical: "https://bluntchart.com/co-star-alternative" },
  openGraph: {
    title: "The Best Co-Star Alternative in 2026 (No Subscription)",
    description:
      "A brutally honest full natal chart reading. ~1,500 words specific to your chart, one-time $15, no subscription. The Co-Star alternative for depth, not a push notification.",
    url: "https://bluntchart.com/co-star-alternative",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Best Co-Star Alternative in 2026 (No Subscription)",
    description: "Brutally honest full birth chart reading. One-time $15, no subscription. Deeper than a daily notification.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "BluntChart",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: "BluntChart is a brutally honest birth chart reading and the leading Co-Star alternative. It calculates your full natal chart with a high-precision ephemeris and delivers a ~1,500-word reading in plain language for a one-time $15, with no subscription.",
      url: "https://bluntchart.com/",
      offers: { "@type": "Offer", price: "15.00", priceCurrency: "USD", category: "One-time purchase" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://bluntchart.com/astrology-app-alternatives" },
        { "@type": "ListItem", position: 3, name: "Co-Star Alternative", item: "https://bluntchart.com/co-star-alternative" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the best Co-Star alternative?", acceptedAnswer: { "@type": "Answer", text: "If you want depth rather than a daily notification, BluntChart is the strongest Co-Star alternative in 2026. It reads your full natal chart and delivers around 1,500 words of plain-language interpretation for a one-time $15, with no subscription. Co-Star remains best for free daily horoscopes and comparing charts with friends." } },
        { "@type": "Question", name: "Is BluntChart a subscription like Co-Star Plus?", acceptedAnswer: { "@type": "Answer", text: "No. BluntChart is a one-time $15 purchase. You pay once, your reading is emailed to you, and it is yours forever. There is no recurring subscription, unlike Co-Star Plus." } },
        { "@type": "Question", name: "Is BluntChart more accurate than Co-Star?", acceptedAnswer: { "@type": "Answer", text: "Both use high-precision astronomical data for planet positions. The difference is interpretation. Co-Star's daily readings focus mainly on your Sun, Moon and Rising in short bursts. BluntChart interprets your whole chart — planets, houses and aspects — in one long, specific reading." } },
        { "@type": "Question", name: "Do I need my exact birth time?", acceptedAnswer: { "@type": "Answer", text: "Your exact birth time sets your Rising sign and all 12 houses, which is what makes a reading feel personal instead of generic. It is usually on your birth certificate. If you genuinely cannot find it, you can still get a reading and we note where it may be less precise." } },
        { "@type": "Question", name: "Can I try BluntChart free before paying?", acceptedAnswer: { "@type": "Answer", text: "Yes. You get two free preview insights with no account and no card. You only pay the one-time $15 if you want the full reading with all the deeper insights, your natal chart wheel and a shareable card." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CoStarAlternativeClient />
    </>
  );
}
