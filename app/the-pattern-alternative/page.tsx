import type { Metadata } from "next";
import ThePatternAlternativeClient from "./ThePatternAlternativeClient";

export const metadata: Metadata = {
  title: "The Best The Pattern Alternative in 2026 (No Subscription) | BluntChart",
  description:
    "Looking for a The Pattern alternative? BluntChart names the actual placement behind your pattern — full birth chart, plain language, brutally honest. One-time $15, no monthly subscription.",
  alternates: { canonical: "https://bluntchart.com/the-pattern-alternative" },
  openGraph: {
    title: "The Best The Pattern Alternative in 2026 (No Subscription)",
    description: "BluntChart shows the placement behind each pattern. Full birth chart, plain language, brutally honest. One-time $15.",
    url: "https://bluntchart.com/the-pattern-alternative",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Best The Pattern Alternative in 2026 (No Subscription)",
    description: "Stop feeling the pattern. See it. Full birth chart, one-time $15, no subscription.",
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
      description: "BluntChart is the leading The Pattern alternative — a full natal chart reading that names the placement behind every pattern in plain language, one-time $15, no subscription.",
      url: "https://bluntchart.com/",
      offers: { "@type": "Offer", price: "15.00", priceCurrency: "USD", category: "One-time purchase" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Alternatives", item: "https://bluntchart.com/astrology-app-alternatives" },
        { "@type": "ListItem", position: 3, name: "The Pattern Alternative", item: "https://bluntchart.com/the-pattern-alternative" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is the best alternative to The Pattern?", acceptedAnswer: { "@type": "Answer", text: "BluntChart is the strongest The Pattern alternative in 2026 for people who want the actual astrology behind the psychology. The Pattern gives you personality patterns with no chart and no jargon; BluntChart reads your full natal chart and names the exact placement driving each pattern, in plain language, for a one-time $15 with no subscription." } },
        { "@type": "Question", name: "Is BluntChart a subscription like The Pattern?", acceptedAnswer: { "@type": "Answer", text: "No. BluntChart is a one-time $15 purchase, yours forever. The Pattern moved core features behind a recurring subscription, which frustrated many longtime users. BluntChart never charges monthly." } },
        { "@type": "Question", name: "Does BluntChart show my actual birth chart?", acceptedAnswer: { "@type": "Answer", text: "Yes. Unlike The Pattern, which deliberately hides the chart and avoids astrological terms, BluntChart uses and shows your real natal chart — planets, houses and aspects — and explains what each means in plain language, plus a natal chart wheel in your delivery." } },
        { "@type": "Question", name: "Is BluntChart good for relationships like The Pattern?", acceptedAnswer: { "@type": "Answer", text: "Your reading covers attraction patterns and why you repeat them, using your Venus placement, 7th house and nodal axis. A dedicated Compatibility reading for two people is launching soon. The Pattern stays strong specifically for its bond and relationship-timing features." } },
        { "@type": "Question", name: "Can I try BluntChart free before paying?", acceptedAnswer: { "@type": "Answer", text: "Yes. Two free preview insights, no account, no card. You only pay the one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ThePatternAlternativeClient />
    </>
  );
}
