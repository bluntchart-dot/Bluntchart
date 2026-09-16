import type { Metadata } from "next";
import MoonPhaseMatchClient from "./MoonPhaseMatchClient";

export const metadata: Metadata = {
  title: "Moon Phase Soulmate Calculator — Free Birth Moon Compatibility Card | BluntChart",
  description:
    "Free moon phase soulmate calculator using real ephemeris data. Enter two birthdays, see both birth moon phases, and get one merged compatibility card — shareable in seconds. No CapCut, no screenshots.",
  openGraph: {
    title: "Moon Phase Soulmate Calculator | Real Birth Moon Compatibility — BluntChart",
    description:
      "The moon phase compatibility trend done right. Real ephemeris — not a CapCut filter. Enter two birthdays, get a merged shareable card in seconds.",
    url: "https://bluntchart.com/moon-phase-soulmate-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moon Phase Soulmate Calculator | Real Birth Moon Match — BluntChart",
    description:
      "Free birth moon phase compatibility calculator. Real ephemeris — not a filter. Two birthdays → one merged shareable card.",
  },
  keywords: [
    "moon phase soulmate calculator",
    "moon phase compatibility",
    "moon phase compatibility calculator",
    "birth moon phase match",
    "moon phase couple chart",
    "birth chart compatibility",
    "moon phase calculator by date of birth",
  ],
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
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free watermarked moon phase compatibility card. $3 to remove watermark.",
      },
      description:
        "Free moon phase soulmate calculator. Enter two birthdays — BluntChart calculates both birth moon phases using real ephemeris data and generates one merged, shareable compatibility card. No CapCut or screenshot editing required.",
      featureList:
        "Real ephemeris moon phase calculation, Merged birth moon compatibility card, Moon phase compatibility score, Birth moon phase name and illumination percentage, Shareable image generation",
      keywords:
        "moon phase soulmate calculator, moon phase compatibility, birth moon phase match, moon phase couple chart, moon phase compatibility calculator",
    },
    {
      "@type": "HowTo",
      name: "How to Check Your Moon Phase Compatibility",
      description:
        "Calculate your birth moon phase compatibility with a partner or friend using real ephemeris data — no CapCut or screenshots required.",
      totalTime: "PT1M",
      tool: [{ "@type": "HowToTool", name: "BluntChart Moon Phase Soulmate Calculator" }],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Enter both first names",
          text: "Type both people's first names in the form.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Enter both birthdays",
          text: "Enter each person's date of birth. No exact birth time is needed — moon phase is the same for everyone born on the same day.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Reveal your moon phase match",
          text: "Click 'Reveal our match'. BluntChart calculates both real birth moon phases using ephemeris data and shows your compatibility score.",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Share or download your card",
          text: "Share the free watermarked card directly, or pay $3 to download the HD version with the watermark removed.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the moon phase soulmate trend?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The moon phase soulmate trend started on TikTok, where couples overlay their individual birth moon phases to see if they combine into a full moon — interpreted as a sign of being soulmates. It generated over 147 million views. The original process required 13 steps across two apps (moon phase site + CapCut). BluntChart replaces that with a single form: enter two birthdays, get one merged card calculated from real ephemeris data.",
          },
        },
        {
          "@type": "Question",
          name: "Is the moon phase calculation accurate, or just a filter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The moon phase shown is a real calculation from your birth date — not an illustration or a CapCut filter. The illumination percentage and phase name are computed from the same synodic cycle math a professional ephemeris uses. Everyone born on the same day anywhere on Earth shares the same moon phase, which is why no birth time is required.",
          },
        },
        {
          "@type": "Question",
          name: "What if our moon phases don't add up to a full moon — are we doomed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. By TikTok law, a low score means 'not soulmates.' By actual astrology, moon phase alignment was never a real compatibility signal — it is a visual coincidence, not a placement. The placement that actually governs emotional compatibility is your moon sign, which is what the full BluntChart Compatibility Reading covers.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need an exact birth time for the moon phase calculator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Moon phase depends only on the date of birth — it is the same for everyone born that day anywhere on Earth. Birth time only matters for moon sign, which requires a full natal chart.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use the moon phase compatibility calculator for friends, not just couples?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The moon phase soulmate trend started with romantic partners but spread to best friends and even pets. The card and compatibility score work exactly the same — just enter both birthdays.",
          },
        },
        {
          "@type": "Question",
          name: "What does the moon phase compatibility percentage mean?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The percentage shows how closely the two birth moon illuminations combine toward a full moon (100%). A score of 100% means both moons together equal a perfectly full circle. The score is a visual metric from the TikTok trend — by actual astrology, moon sign placement is the compatibility signal that matters.",
          },
        },
        {
          "@type": "Question",
          name: "Is my birth data stored or sold?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Birthdays entered are used solely to calculate your moon phase card. BluntChart does not sell or share this data with third parties or use it for advertising. Full details are in the Privacy Policy.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Moon Phase Soulmate Calculator",
          item: "https://bluntchart.com/moon-phase-soulmate-calculator",
        },
      ],
    },
  ],
};

export default function MoonPhaseSoulmatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MoonPhaseMatchClient />
    </>
  );
}
