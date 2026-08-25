import type { Metadata } from "next";
import MoonPhaseMatchClient from "./MoonPhaseMatchClient";

export const metadata: Metadata = {
  title: "Moon Phase Soulmate Calculator: Free & Instant | BluntChart",
  description:
    "Enter two birthdays. We calculate both real moon phases and hand you one merged, shareable card. No screenshots. No CapCut. No thirteen steps.",
  openGraph: {
    title: "Moon Phase Soulmate Calculator | BluntChart",
    description:
      "The moon phase match trend, minus the thirteen steps. Real moon phases, one merged card, instantly shareable.",
    url: "https://bluntchart.com/moon-phase-soulmate-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Phase Soulmate Calculator | BluntChart",
    description:
      "Enter two birthdays. Get one merged, shareable moon phase card — real ephemeris, not a filter.",
  },
  alternates: { canonical: "https://bluntchart.com/moon-phase-soulmate-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Moon Phase Soulmate Calculator",
      url: "https://bluntchart.com/moon-phase-soulmate-calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "Free moon phase match calculator. Enter two birthdays and get a real, calculated moon phase card — no screenshots or editing apps required.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Is this actually accurate, or just a filter?", acceptedAnswer: { "@type": "Answer", text: "The moon phase itself is a real calculation from your birth date, not an illustration or a filter. The illumination percentage and phase name shown are computed the same way an ephemeris would derive them — this isn't the CapCut template redrawn, it's the actual math behind it." } },
        { "@type": "Question", name: "What if our moons don't form a full moon — are we doomed?", acceptedAnswer: { "@type": "Answer", text: "No. By TikTok law, a low score is \"not soulmates.\" By actual astrology, moon phase alignment was never a real compatibility signal — it's a fun coincidence, not a placement. The thing that actually matters is your moon signs, which is what the full Compatibility Reading is built on." } },
        { "@type": "Question", name: "Do I need my exact birth time?", acceptedAnswer: { "@type": "Answer", text: "Not for this. Moon phase only depends on the date — it's the same for everyone born that day anywhere on Earth. Birth time only matters once you move to moon sign, part of the full reading." } },
        { "@type": "Question", name: "Can I do this for a friend, not a partner?", acceptedAnswer: { "@type": "Answer", text: "Yes — the original trend started with couples but spread to best friends and even pets. The card works exactly the same either way; just enter both birthdays." } },
        { "@type": "Question", name: "Is my birth data stored or sold?", acceptedAnswer: { "@type": "Answer", text: "It's used solely to calculate your card. We don't sell it, share it with third parties, or use it for advertising. Full details in our Privacy Policy." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Moon Phase Match", item: "https://bluntchart.com/moon-phase-soulmate-calculator" },
      ],
    },
  ],
};

export default function MoonPhaseSoulmatePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MoonPhaseMatchClient />
    </>
  );
}
