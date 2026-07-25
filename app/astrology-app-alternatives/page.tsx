import type { Metadata } from "next";
import AlternativesHubClient from "./AlternativesHubClient";

export const metadata: Metadata = {
  title: "Best Astrology App Alternatives in 2026 — No Subscription | BluntChart",
  description:
    "The best Co-Star, CHANI, The Pattern, Nebula and Sanctuary alternative — one honest natal chart reading, ~1,500 words, one-time $15, no subscription trap.",
  alternates: { canonical: "https://bluntchart.com/astrology-app-alternatives" },
  openGraph: {
    title: "Best Astrology App Alternatives in 2026 — No Subscription | BluntChart",
    description:
      "A brutally honest natal chart reading for a flat $15. The alternative to every astrology app that hides depth behind a subscription.",
    url: "https://bluntchart.com/astrology-app-alternatives",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Astrology App Alternatives in 2026 | BluntChart",
    description: "One honest reading. One-time $15. No subscription. The alternative to Co-Star, CHANI, The Pattern, Nebula and Sanctuary.",
  },
};

const COMPETITORS = [
  { name: "Co-Star", slug: "co-star", url: "https://bluntchart.com/co-star-alternative" },
  { name: "The Pattern", slug: "the-pattern", url: "https://bluntchart.com/the-pattern-alternative" },
  { name: "CHANI", slug: "chani", url: "https://bluntchart.com/chani-alternative" },
  { name: "Sanctuary", slug: "sanctuary", url: "https://bluntchart.com/sanctuary-alternative" },
  { name: "Nebula", slug: "nebula", url: "https://bluntchart.com/nebula-alternative" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Best Astrology App Alternatives in 2026",
      url: "https://bluntchart.com/astrology-app-alternatives",
      description: "Comparison hub for the best Co-Star, CHANI, The Pattern, Nebula and Sanctuary alternatives.",
    },
    {
      "@type": "ItemList",
      name: "Astrology app alternatives",
      itemListElement: COMPETITORS.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${c.name} alternative`,
        url: c.url,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://bluntchart.com/astrology-app-alternatives" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the best astrology app alternative in 2026?", acceptedAnswer: { "@type": "Answer", text: "It depends what you're leaving. For depth over daily notifications, BluntChart is the strongest Co-Star and The Pattern alternative. For an honest reading with no subscription trap, it's the leading Nebula and CHANI alternative. For the depth of a real reading without a per-minute meter, it's the top Sanctuary alternative. One full ~1,500-word natal chart reading, flat one-time $15, no subscription." } },
        { "@type": "Question", name: "Is BluntChart really no subscription?", acceptedAnswer: { "@type": "Answer", text: "Yes. BluntChart is a single one-time $15 charge. No free trial that converts to billing, no stored card, no auto-renewal, and nothing to cancel. You pay once, receive your full natal chart reading by email, and it's yours forever." } },
        { "@type": "Question", name: "How is BluntChart different from Co-Star, CHANI, The Pattern, Nebula and Sanctuary?", acceptedAnswer: { "@type": "Answer", text: "Co-Star is a daily notification; BluntChart is one deep reading. CHANI is affirming and gentle; BluntChart is brutally honest. The Pattern hides the astrology; BluntChart shows the placement behind each pattern. Nebula bundles tarot, palmistry and psychic chats on a subscription; BluntChart does one thing — your full natal chart, read straight, for a flat $15. Sanctuary bills live readers by the minute; BluntChart is a written reading at a fixed price you know before you start." } },
        { "@type": "Question", name: "Which astrology app has no auto-renewal or free-trial trap?", acceptedAnswer: { "@type": "Answer", text: "BluntChart doesn't take a card for the free preview and never auto-renews. It's a flat one-time $15 with nothing to cancel — the honest alternative to any astrology app with a subscription that quietly renews after a free trial." } },
        { "@type": "Question", name: "Can I try any of these alternatives free before paying?", acceptedAnswer: { "@type": "Answer", text: "Yes — BluntChart gives you two free preview insights with no account and no card. You only pay the flat one-time $15 for the full reading with all deeper insights, your natal chart wheel and a shareable card." } },
        { "@type": "Question", name: "Is BluntChart AI-generated?", acceptedAnswer: { "@type": "Answer", text: "Yes. The chart itself is calculated from a high-precision astronomical ephemeris (same data class as professional astrologers use), then interpreted by AI built specifically to read your exact placements in plain, brutally honest language — not template horoscope text." } },
        { "@type": "Question", name: "Which astrology app is most accurate?", acceptedAnswer: { "@type": "Answer", text: "For raw planet positions, most reputable apps use high-precision astronomical data, so the numbers are close. The real difference is interpretation. BluntChart reads your whole chart — planets, houses and aspects — in ~1,500 words specific to you, rather than short daily fragments." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AlternativesHubClient />
    </>
  );
}
