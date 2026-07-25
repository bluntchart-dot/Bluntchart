import type { Metadata } from "next";
import SanctuaryAlternativeClient from "./SanctuaryAlternativeClient";

export const metadata: Metadata = {
  title: "The Best Sanctuary Astrology Alternative in 2026 (Flat $15) | BluntChart",
  description:
    "Looking for a Sanctuary alternative? BluntChart is a full birth chart reading for a flat one-time $15 — no per-minute meter, no scheduling, ~1,500 words you keep forever.",
  alternates: { canonical: "https://bluntchart.com/sanctuary-alternative" },
  openGraph: {
    title: "The Best Sanctuary Astrology Alternative in 2026 (Flat $15)",
    description: "Depth of a real reading, without the per-minute meter. Flat one-time $15, ~1,500 words, yours forever.",
    url: "https://bluntchart.com/sanctuary-alternative",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Best Sanctuary Astrology Alternative in 2026 (Flat $15)",
    description: "All the depth, none of the clock. Flat one-time $15 birth chart reading, yours forever.",
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
      description: "BluntChart is the leading Sanctuary alternative — a flat one-time $15 for a brutally honest full natal chart reading in ~1,500 words, delivered instantly, yours forever. No per-minute meter, no scheduling.",
      url: "https://bluntchart.com/",
      offers: { "@type": "Offer", price: "15.00", priceCurrency: "USD", category: "One-time purchase" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://bluntchart.com/astrology-app-alternatives" },
        { "@type": "ListItem", position: 3, name: "Sanctuary Alternative", item: "https://bluntchart.com/sanctuary-alternative" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the best Sanctuary alternative?", acceptedAnswer: { "@type": "Answer", text: "If you want the depth of a real reading without a per-minute meter, BluntChart is the strongest Sanctuary alternative in 2026. Sanctuary connects you to live human readers billed by the minute; BluntChart delivers a full ~1,500-word natal chart reading for a flat one-time $15 that you keep forever. Sanctuary is best when you specifically want to talk to a real person live." } },
        { "@type": "Question", name: "How much does BluntChart cost compared to Sanctuary?", acceptedAnswer: { "@type": "Answer", text: "BluntChart is a flat one-time $15, with no per-minute charges and no subscription. Sanctuary starts around a $4.99 five-minute intro and then bills per minute, so an in-depth session can climb quickly. With BluntChart the price is fixed before you start." } },
        { "@type": "Question", name: "Is BluntChart a real reading or just an app horoscope?", acceptedAnswer: { "@type": "Answer", text: "It interprets your full natal chart — planets, houses and aspects — in about 1,500 words specific to you, not a generic sun-sign horoscope. It's delivered instantly and in writing so you can re-read it. Sanctuary offers live human readers; BluntChart offers a deep written reading with no clock running." } },
        { "@type": "Question", name: "Do I get to keep my BluntChart reading?", acceptedAnswer: { "@type": "Answer", text: "Yes. Your reading is emailed to you the moment payment goes through and is yours forever, along with your natal chart wheel and a shareable card. A live Sanctuary chat ends when the session ends; a BluntChart reading you can revisit any time." } },
        { "@type": "Question", name: "Can I try BluntChart free before paying?", acceptedAnswer: { "@type": "Answer", text: "Yes. Two free preview insights, no account, no card. You only pay the flat one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SanctuaryAlternativeClient />
    </>
  );
}
