import type { Metadata } from "next";
import FightCardClient from "./FightCardClient";

export const metadata: Metadata = {
  title: "The Fight Card — A Wallet Card Built From Your Actual Fight | BluntChart",
  description:
    "Not a generic conversation deck. A two-sided wallet card built from your real synastry — what to say, what not to say, mid-argument. Free with every Compatibility Reading.",
  openGraph: {
    title: "The Fight Card | BluntChart",
    description:
      "A two-sided wallet card built from your actual synastry — the exact line that de-escalates your specific pattern.",
    url: "https://bluntchart.com/fight-card",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fight Card | BluntChart",
    description:
      "Break glass in case of the 2AM fight. A wallet card built from your real synastry, not a generic conversation deck.",
  },
  alternates: { canonical: "https://bluntchart.com/fight-card" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "The Fight Card",
      description:
        "A two-sided wallet card generated from your Compatibility Reading, built on Gottman repair-attempt research. Ships as a printable PDF, fridge version, and matching lock-screen wallpapers.",
      brand: { "@type": "Brand", name: "BluntChart" },
      offers: {
        "@type": "Offer",
        price: "24",
        priceCurrency: "USD",
        url: "https://bluntchart.com/fight-card",
        availability: "https://schema.org/PreOrder",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Can I buy just the Fight Card, without the full reading?", acceptedAnswer: { "@type": "Answer", text: "No — it's generated from data your Compatibility Reading already produces, so it ships as part of that $24 reading rather than as a separate purchase. Think of it as a bonus format of content you're already paying for, not an upsell on top of it." } },
        { "@type": "Question", name: "Is this a substitute for couples therapy?", acceptedAnswer: { "@type": "Answer", text: "No. It's built to defuse one specific argument in the moment, using real repair-attempt research — not to replace a therapist, especially if the same fight is causing ongoing harm. If that's where you are, a card isn't the right tool, and we'd say so directly." } },
        { "@type": "Question", name: "What if we don't want a personalized card, just a generic one?", acceptedAnswer: { "@type": "Answer", text: "Then a $15–$40 conversation deck from Amazon or the Gottman Institute's own shop is a genuinely good option, and we mean that. The Fight Card exists for people who want the specific line for their specific person, not a general framework." } },
        { "@type": "Question", name: "Does the quiz above use my real data?", acceptedAnswer: { "@type": "Answer", text: "No — it's a three-question self-assessment for fun, not a calculation from your chart. Your actual pattern, computed from real synastry, is what the Compatibility Reading delivers." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "The Fight Card", item: "https://bluntchart.com/fight-card" },
      ],
    },
  ],
};

export default function FightCardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FightCardClient />
    </>
  );
}
