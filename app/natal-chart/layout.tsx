import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Natal Chart Explained: How to Read Yours | BluntChart",
  description:
    "What a natal chart is, what every planet, house and aspect means, and how to read yours step by step. Plus a free chart calculator. Beginner-friendly.",
  openGraph: {
    title: "Natal Chart Explained: How to Read Yours | BluntChart",
    description: "What a natal chart is, what every planet, house and aspect means, and how to read yours step by step.",
    url: "https://bluntchart.com/natal-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natal Chart Explained: How to Read Yours | BluntChart",
    description: "The pillar guide to reading a natal chart — plus a free calculator. Beginner-friendly, no signup.",
  },
  alternates: { canonical: "https://bluntchart.com/natal-chart" },
};

export default function NatalChartLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "BluntChart Free Natal Chart",
        url: "https://bluntchart.com/natal-chart",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: "Free natal chart generator with planetary positions, house placements, and aspect analysis.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "How do you read a natal chart step by step?", acceptedAnswer: { "@type": "Answer", text: "Start with the Big Three (Sun, Moon, Ascendant), find your chart ruler (the planet that rules your Rising sign), scan for stelliums and element balance, read the personal planets by sign and house, then the social and outer planets, and only then read aspects. This order stops the chart from being overwhelming." } },
          { "@type": "Question", name: "What does each house mean in astrology?", acceptedAnswer: { "@type": "Answer", text: "The 1st house is self and identity, 2nd is money and self-worth, 3rd is communication and siblings, 4th is home and family, 5th is creativity and romance, 6th is work and health, 7th is partnership, 8th is transformation and shared resources, 9th is philosophy and belief, 10th is career, 11th is community, 12th is the subconscious." } },
          { "@type": "Question", name: "What are angular, succedent, and cadent houses?", acceptedAnswer: { "@type": "Answer", text: "Angular houses (1, 4, 7, 10) sit on the four angles and hold planets that act and are visible in your life. Succedent houses (2, 5, 8, 11) consolidate and sustain. Cadent houses (3, 6, 9, 12) process, adapt, learn and release — planets here are more internal." } },
          { "@type": "Question", name: "What are natal chart aspects?", acceptedAnswer: { "@type": "Answer", text: "An aspect is the angular distance between two planets. The five majors are conjunction (0°, fused), sextile (60°, opportunity), square (90°, friction), trine (120°, ease), and opposition (180°, push-pull). Tighter orbs are stronger. Squares are often the most productive aspects — tension is what makes people build things." } },
          { "@type": "Question", name: "What is a stellium in a natal chart?", acceptedAnswer: { "@type": "Answer", text: "A stellium is three or more planets in one sign or one house. When you have one, that area dominates your chart — a Capricorn stellium makes ambition and structure the water you swim in; a 5th house stellium makes creativity and romance your organising principle." } },
          { "@type": "Question", name: "Are natal charts accurate?", acceptedAnswer: { "@type": "Answer", text: "Split the question. The astronomy is exact and independently verifiable — BluntChart computes planetary positions from a high-precision ephemeris matching the Swiss Ephemeris. The interpretation is a framework, not a measurement; controlled studies have not demonstrated predictive validity. A natal chart reliably provides a specific, structured vocabulary for personality and pattern." } },
          { "@type": "Question", name: "What is the tropical zodiac?", acceptedAnswer: { "@type": "Answer", text: "The tropical zodiac is the reference frame used in Western astrology, anchored to the seasons — 0° Aries is defined as the moment of the spring equinox. This is what BluntChart and every Western astrology site uses. A small number of calculators use the sidereal zodiac instead, which is why two sites sometimes give different signs." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Free Natal Chart", item: "https://bluntchart.com/natal-chart" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}