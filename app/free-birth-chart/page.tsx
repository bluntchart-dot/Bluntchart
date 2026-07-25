import type { Metadata } from "next";
import FreeBirthChartClient from "./FreeBirthChartClient";

/* ── SEO Metadata ────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Free Birth Chart Calculator: Instant Natal Chart | BluntChart",
  description:
    "Get your free birth chart in seconds. Exact Sun, Moon, Rising, all planets, houses and aspects from a precision ephemeris. No signup, no subscription.",
  openGraph: {
    title: "Free Birth Chart Calculator | BluntChart",
    description:
      "Get your free natal chart in seconds. Exact Sun, Moon, Rising, all planets, houses and aspects. No signup.",
    url: "https://bluntchart.com/free-birth-chart",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Birth Chart Calculator | BluntChart",
    description:
      "Your exact natal chart — Sun, Moon, Rising, all planets, houses and aspects. Free, instant, no signup.",
  },
  alternates: {
    canonical: "https://bluntchart.com/free-birth-chart",
  },
};

/* ── JSON-LD Schema ──────────────────────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Free Birth Chart Calculator",
      url: "https://bluntchart.com/free-birth-chart",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Free natal chart calculator using high-precision astronomical ephemeris. Get your exact Sun, Moon, Rising sign, planetary placements, house positions, and aspects instantly.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is a birth chart?", acceptedAnswer: { "@type": "Answer", text: "A birth chart (natal chart) is a map of exactly where every planet was at the moment you were born, calculated from your birth date, exact birth time and birth location. It shows the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto across the 12 zodiac signs and 12 houses." } },
        { "@type": "Question", name: "Can I get a birth chart without my birth time?", acceptedAnswer: { "@type": "Answer", text: "Yes, partially. Your Sun, Mercury, Venus, Mars, Jupiter, Saturn and outer planet signs will be accurate. What you lose is your Rising sign, all twelve house placements, the Midheaven, and — if the Moon changed signs that day — your Moon sign. Run the chart at noon to get everything else." } },
        { "@type": "Question", name: "What house system does this calculator use?", acceptedAnswer: { "@type": "Answer", text: "BluntChart uses Equal House from the Ascendant. Planet positions, the Ascendant degree and all aspects match professional tools to arc-second precision. Only house cusps differ from a Placidus chart, which usually means one or two planets landing in an adjacent house." } },
        { "@type": "Question", name: "Is a birth chart the same as a natal chart?", acceptedAnswer: { "@type": "Answer", text: "Yes — birth chart and natal chart are two names for the same thing. 'Natal' is the technical term; 'birth chart' is more common. There is no difference in calculation, accuracy or meaning." } },
        { "@type": "Question", name: "How accurate is this birth chart calculator?", acceptedAnswer: { "@type": "Answer", text: "The calculator uses astronomy-engine, a high-precision astronomical library. Planetary longitudes are accurate to arc-second and match the Swiss Ephemeris used by professional astrologers. The only variable between sites is house system." } },
        { "@type": "Question", name: "What is a chart ruler?", acceptedAnswer: { "@type": "Answer", text: "Your chart ruler is the planet that rules your Rising sign — Aries Rising is ruled by Mars, Taurus and Libra Rising by Venus, and so on. Wherever that planet sits in your chart describes the overall direction and flavour of your life." } },
        { "@type": "Question", name: "What is a stellium?", acceptedAnswer: { "@type": "Answer", text: "A stellium is three or more planets in the same sign or the same house. When you have one, that area of your chart dominates you. Stelliums are also why some people don't relate to their Sun sign — the stellium is louder." } },
        { "@type": "Question", name: "Can AI read my birth chart?", acceptedAnswer: { "@type": "Answer", text: "Yes, but the calculation must come from a real ephemeris rather than the language model. A well-built AI reading works from the whole chart at once and synthesizes how placements interact — which is what template reports have never managed. Ask a general chatbot to compute a chart and it will often invent placements." } },
        { "@type": "Question", name: "What is the difference between a birth chart and a horoscope?", acceptedAnswer: { "@type": "Answer", text: "A birth chart is a permanent, one-time calculation unique to your exact moment of birth. A daily horoscope is a general forecast based only on your Sun sign, shared with roughly one twelfth of the population." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "BluntChart",
          item: "https://bluntchart.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Birth Chart Calculator",
          item: "https://bluntchart.com/free-birth-chart",
        },
      ],
    },
  ],
};

export default function FreeBirthChartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FreeBirthChartClient />
    </>
  );
}