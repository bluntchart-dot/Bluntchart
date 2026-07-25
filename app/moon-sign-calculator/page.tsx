import type { Metadata } from "next";
import MoonSignClient from "./MoonSignClient";

export const metadata: Metadata = {
  title: "Moon Sign Calculator: What Is My Moon Sign? | BluntChart",
  description:
    "Find your Moon sign free in seconds. Your Moon sign reveals your emotional core, what you need and what sets you off. Instant result, no signup needed.",
  openGraph: {
    title: "Free Moon Sign Calculator | BluntChart",
    description: "Find your Moon sign free. Your Moon sign reveals your emotional nature — what you need, how you feel, what triggers you. Instant result.",
    url: "https://bluntchart.com/moon-sign-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Your Moon Sign? Free Calculator | BluntChart",
    description: "Your Sun sign is who you are. Your Moon sign is how you feel. Find yours free — no signup needed.",
  },
  alternates: { canonical: "https://bluntchart.com/moon-sign-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Moon Sign Calculator",
      url: "https://bluntchart.com/moon-sign-calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Free Moon sign calculator using high-precision astronomical ephemeris. Find your lunar zodiac sign based on your birth date, time, and place.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What is a Moon sign?", acceptedAnswer: { "@type": "Answer", text: "Your Moon sign is the zodiac sign the Moon was in at the exact moment of your birth. It represents your emotional core — how you process feelings, what you need to feel secure, and the parts of yourself that only emerge in private or under stress. It's one of the three most important placements in your chart, alongside Sun and Rising." } },
        { "@type": "Question", name: "Why is my Moon sign different on different websites?", acceptedAnswer: { "@type": "Answer", text: "One of four things happened: your birth time crossed a lunar ingress; the site handled your historical time zone incorrectly; one site defaulted to noon without telling you; or they use the sidereal zodiac instead of tropical. Only one of those is actually an error." } },
        { "@type": "Question", name: "Can I find my Moon sign without a birth time?", acceptedAnswer: { "@type": "Answer", text: "Usually yes. The Moon spends about 2 days 5 hours in each sign, so on roughly two thirds of birthdays it was in a single sign all day. If your date lands near a boundary, run the calculator at 00:01 and 23:59 — if both return the same sign, you're safe." } },
        { "@type": "Question", name: "Does Moon sign compatibility matter more than Sun sign compatibility?", acceptedAnswer: { "@type": "Answer", text: "Yes, for whether you can actually live with someone. Sun sign compatibility predicts whether you admire each other. Moon sign compatibility predicts whether your instinctive stress reactions wound or soothe each other. The single strongest indicator in synastry is one person's Moon conjunct the other's Sun." } },
        { "@type": "Question", name: "What Moon phase was I born under?", acceptedAnswer: { "@type": "Answer", text: "Your natal lunar phase is the angular relationship between the Moon and Sun at birth — a separate layer from your Moon sign. The eight phases are New Moon, Crescent, First Quarter, Gibbous, Full Moon, Disseminating, Last Quarter, and Balsamic." } },
        { "@type": "Question", name: "Which Moon sign is the rarest?", acceptedAnswer: { "@type": "Answer", text: "None of them, meaningfully. The Moon spends roughly equal time in each sign over any long period. Small variations exist from orbital speed and birth-rate seasonality, but nothing makes any Moon sign genuinely rare." } },
        { "@type": "Question", name: "Which Moon sign is the luckiest?", acceptedAnswer: { "@type": "Answer", text: "There isn't one. Traditional astrology considers the Moon exalted in Taurus, in domicile in Cancer, in fall in Scorpio, and in detriment in Capricorn. That's about ease of expression, not fortune." } },
        { "@type": "Question", name: "How accurate is this Moon sign calculator?", acceptedAnswer: { "@type": "Answer", text: "The calculator computes the Moon's geocentric ecliptic longitude at your exact moment of birth from a high-precision astronomical ephemeris, in the tropical zodiac, using the historical time zone offset for your location. Accurate to arc-second precision, matching professional ephemeris tools." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Moon Sign Calculator", item: "https://bluntchart.com/moon-sign-calculator" },
      ],
    },
  ],
};

export default function MoonSignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MoonSignClient />
    </>
  );
}