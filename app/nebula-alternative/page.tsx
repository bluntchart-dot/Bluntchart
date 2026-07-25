import type { Metadata } from "next";
import NebulaAlternativeClient from "./NebulaAlternativeClient";

export const metadata: Metadata = {
  title: "The Best Nebula Alternative in 2026 (No Subscription Trap) | BluntChart",
  description:
    "Looking for a Nebula alternative with no subscription trap? BluntChart is a full birth chart reading for a flat one-time $15 — no free-trial auto-renewal, no stored card, nothing to cancel.",
  alternates: { canonical: "https://bluntchart.com/nebula-alternative" },
  openGraph: {
    title: "The Best Nebula Alternative in 2026 (No Subscription Trap)",
    description: "A full birth chart reading for a flat one-time $15 — no auto-renewing subscription, no stored card, nothing to cancel.",
    url: "https://bluntchart.com/nebula-alternative",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Best Nebula Alternative in 2026 (No Subscription Trap)",
    description: "Flat one-time $15 birth chart reading. No trial that auto-renews. Nothing to cancel.",
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
      description: "BluntChart is the leading Nebula alternative — a flat one-time $15 for a brutally honest full natal chart reading. No free trial, no auto-renewal, no credit packs, nothing to cancel.",
      url: "https://bluntchart.com/",
      offers: { "@type": "Offer", price: "15.00", priceCurrency: "USD", category: "One-time purchase" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://bluntchart.com/astrology-app-alternatives" },
        { "@type": "ListItem", position: 3, name: "Nebula Alternative", item: "https://bluntchart.com/nebula-alternative" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the best Nebula alternative?", acceptedAnswer: { "@type": "Answer", text: "BluntChart is the strongest Nebula alternative in 2026 for people who want one honest reading without a subscription trap. Nebula is an all-in-one bundle (astrology, tarot, numerology, live psychics) funded by auto-renewing subscriptions after a short free trial; BluntChart does one thing — a full, brutally honest natal chart reading — for a flat one-time $15, with no auto-renewal and nothing to cancel." } },
        { "@type": "Question", name: "Will BluntChart auto-renew or charge me again like Nebula?", acceptedAnswer: { "@type": "Answer", text: "No. BluntChart is a single one-time $15 charge. There's no free trial that converts to billing, no stored card set up to renew, and nothing to cancel. You pay once, get your reading, and that's the end of the transaction." } },
        { "@type": "Question", name: "How is BluntChart different from Nebula?", acceptedAnswer: { "@type": "Answer", text: "Nebula bundles astrology with tarot, numerology, palmistry and paid live psychic chats, and monetises through recurring subscriptions and credit packs. BluntChart does one focused thing: it interprets your full natal chart in about 1,500 plain-language, brutally honest words for a flat one-time $15 — no upsells, no add-ons, no subscription." } },
        { "@type": "Question", name: "Is BluntChart's reading generic like some Nebula reviews describe?", acceptedAnswer: { "@type": "Answer", text: "No. BluntChart interprets your full natal chart — planets, houses and aspects — in about 1,500 words written to your exact placements, not a generic sun-sign template. You can read two free preview insights before paying to judge the specificity for yourself." } },
        { "@type": "Question", name: "Can I try BluntChart free before paying — without a card?", acceptedAnswer: { "@type": "Answer", text: "Yes — and there's no card required, so there's nothing to accidentally start. Two free preview insights, no account. You only pay the flat one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NebulaAlternativeClient />
    </>
  );
}
