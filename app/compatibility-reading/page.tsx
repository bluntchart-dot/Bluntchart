import type { Metadata } from "next";
import CompatibilityClient from "./CompatibilityClient";
import { COMPAT_PRICE, COMPAT_FAQ } from "./content";

const URL = "https://bluntchart.com/compatibility-reading";

export const metadata: Metadata = {
  title: "Compatibility Reading for Couples | Synastry from Both Birth Charts | BluntChart",
  description: `A blunt, personalized compatibility reading built from both of your birth charts. The pull, the fight you keep having, how you love differently, and what this connection is asking of you. 7 chapters, ready in minutes. $${COMPAT_PRICE}.`,
  keywords: [
    "compatibility reading",
    "astrology compatibility reading",
    "birth chart compatibility",
    "synastry reading",
    "synastry report",
    "couples astrology reading",
    "relationship astrology reading",
    "love compatibility reading",
    "zodiac compatibility report",
    "natal chart compatibility",
  ],
  openGraph: {
    title: "What's actually going on between you two? | Compatibility Reading",
    description:
      "A blunt synastry reading from both of your birth charts. The magnetism, the recurring fight, and what this connection is asking of both of you. Ready in minutes.",
    url: URL,
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BluntChart Compatibility Reading" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "What's actually going on between you two? | BluntChart",
    description:
      "A blunt synastry reading from both of your birth charts. 7 chapters, ready in minutes.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: URL },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Compatibility Reading",
  description:
    "Personalized astrology compatibility (synastry) reading built from two full birth charts: 7 written chapters covering attraction, love styles, recurring conflict, communication, emotional triggers, and long-term potential. Delivered online in minutes.",
  brand: { "@type": "Brand", name: "BluntChart" },
  category: "Astrology Reading",
  offers: {
    "@type": "Offer",
    price: COMPAT_PRICE,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: URL,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COMPAT_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function CompatibilityReadingPage() {
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
      <CompatibilityClient />
    </>
  );
}
