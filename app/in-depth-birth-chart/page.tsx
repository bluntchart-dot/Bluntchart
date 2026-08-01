import type { Metadata } from "next";
import BirthChartBookClient from "./BirthChartBookClient";

export const metadata: Metadata = {
  title:
    "In-Depth Birth Chart Reading | 49-Page Personalized Natal Chart Analysis | BluntChart",
  description:
    "The most detailed birth chart reading you'll find. 49 pages written from every planet in your chart. Ready in under 10 minutes. Not your sign, not a template. $24 launch price.",
  keywords: [
    "in-depth birth chart reading",
    "detailed birth chart reading",
    "personalized natal chart reading",
    "natal chart analysis",
    "birth chart report PDF",
    "in depth natal chart reading",
  ],
  openGraph: {
    title:
      "In-Depth Birth Chart Reading — Finally, one that's actually about you",
    description:
      "49 pages built from every planet in your chart. The reading that names the thing you couldn't say about yourself. $24, delivered in minutes.",
    url: "https://bluntchart.com/in-depth-birth-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "In-Depth Birth Chart Reading | 49 Pages | BluntChart",
    description:
      "49 pages built from every planet in your chart. Ready in under 10 minutes. $24 launch price.",
  },
  alternates: {
    canonical: "https://bluntchart.com/in-depth-birth-chart",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "In-Depth Birth Chart Reading — Your Story",
  description:
    "49-page personalized birth chart reading covering 14 chapters across your entire natal chart. Generated from real ephemeris data.",
  brand: { "@type": "Brand", name: "BluntChart" },
  offers: {
    "@type": "Offer",
    price: "24",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://bluntchart.com/in-depth-birth-chart",
  },
};

export default function BirthChartBookPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BirthChartBookClient />
    </>
  );
}
