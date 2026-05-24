import type { Metadata } from "next";
import MoonSignClient from "./MoonSignClient";

export const metadata: Metadata = {
  title: "Moon Sign Calculator — Find Your Lunar Sign Free | BluntChart",
  description:
    "Find your Moon sign free with our lunar sign calculator. Your Moon sign reveals your emotional nature, hidden needs, and inner world. Enter your birth date, time, and place. High-precision ephemeris, instant result, no signup.",
  keywords: [
    "moon sign calculator",
    "what is my moon sign",
    "lunar sign calculator",
    "moon sign",
    "find my moon sign",
    "whats my moon sign",
    "moon sign astrology",
    "calculate moon sign",
    "moon zodiac sign",
    "free moon sign calculator",
    "moon sign by birth date",
    "moon sign meaning",
    "emotional zodiac sign",
    "moon sign compatibility",
  ],
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
        { "@type": "Question", name: "What is a Moon sign?", acceptedAnswer: { "@type": "Answer", text: "Your Moon sign is the zodiac sign the Moon was in at the exact moment of your birth. It represents your emotional nature, inner world, subconscious patterns, and what you need to feel safe and secure. While your Sun sign is your conscious identity, your Moon sign reveals the private, emotional self that only close people get to see." } },
        { "@type": "Question", name: "How do I find my Moon sign?", acceptedAnswer: { "@type": "Answer", text: "Enter your birth date, birth time, and birth city into a Moon sign calculator. The Moon changes zodiac signs every 2 to 2.5 days, so your birth date alone may be enough — but if you were born on a day when the Moon changed signs, you'll need your birth time for accuracy." } },
        { "@type": "Question", name: "Do I need my birth time for my Moon sign?", acceptedAnswer: { "@type": "Answer", text: "Not always, but it helps. The Moon stays in each sign for about 2.5 days. If you were born in the middle of a Moon sign transit, your birth date alone is sufficient. But if you were born near a sign change (which happens roughly every 2.5 days), your birth time determines which sign the Moon was actually in at your moment of birth." } },
        { "@type": "Question", name: "What is the difference between Sun sign and Moon sign?", acceptedAnswer: { "@type": "Answer", text: "Your Sun sign represents your conscious identity, ego, and life purpose — it's the 'you' that you project to the world. Your Moon sign represents your emotional core, instincts, and subconscious needs — it's the 'you' that comes out in private, under stress, or with people you deeply trust. Many people feel their Moon sign describes them more accurately than their Sun sign." } },
        { "@type": "Question", name: "Why is the Moon sign important?", acceptedAnswer: { "@type": "Answer", text: "The Moon sign is important because it governs your emotional reactions, comfort needs, relationship patterns, and the instinctive behaviors you fall back on under stress. It also reveals what kind of emotional environment you need to thrive, how you nurture others, and what triggers your deepest insecurities. In relationship astrology, Moon sign compatibility is often considered more important than Sun sign compatibility." } },
        { "@type": "Question", name: "Does my Moon sign affect my relationships?", acceptedAnswer: { "@type": "Answer", text: "Yes, significantly. Your Moon sign determines your emotional needs in relationships — what makes you feel loved, safe, and understood. Moon sign compatibility between two people often predicts emotional harmony better than Sun sign compatibility. For example, two people with compatible Moon signs may feel emotionally 'at home' with each other even if their Sun signs clash." } },
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