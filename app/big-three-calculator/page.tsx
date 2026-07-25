import type { Metadata } from "next";
import BigThreeClient from "./BigThreeClient";

export const metadata: Metadata = {
  title: "Big Three Calculator: Sun, Moon & Rising Signs | BluntChart",
  description:
    "Find your Big 3 free — Sun, Moon and Rising signs from your exact birth time. See what each one actually means for you. Instant result, no signup.",
  openGraph: {
    title: "Free Big Three Calculator — Sun, Moon & Rising | BluntChart",
    description: "Find your Big Three astrology signs free. Sun = who you are. Moon = how you feel. Rising = how the world sees you.",
    url: "https://bluntchart.com/big-three-calculator",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Your Big Three? Free Sun Moon Rising Calculator | BluntChart",
    description: "Sun, Moon, Rising — your three most important astrology placements. Find yours free, instantly.",
  },
  alternates: { canonical: "https://bluntchart.com/big-three-calculator" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BluntChart Big Three Calculator",
      url: "https://bluntchart.com/big-three-calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Free Sun, Moon, and Rising sign calculator using high-precision astronomical ephemeris. Find your Big Three astrology placements instantly.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What are the Big Three in astrology?", acceptedAnswer: { "@type": "Answer", text: "The Big Three refers to your Sun sign, Moon sign, and Rising sign — the three most important placements in your birth chart. Sun is core identity, Moon is emotional nature, Rising is social interface. Your Sun is the film, your Moon is the audience reaction, your Rising is the poster." } },
        { "@type": "Question", name: "Which of the Big Three is most important?", acceptedAnswer: { "@type": "Answer", text: "There isn't a single answer — anyone who gives one is picking a tradition without telling you. Modern Western astrology treats the Sun as primary; traditional astrology treats the Ascendant as primary; psychological astrology tends to weight the Moon most heavily. Read the Rising for first impressions, the Moon for intimacy, the Sun for long-term direction." } },
        { "@type": "Question", name: "Can I find my Big Three without a birth time?", acceptedAnswer: { "@type": "Answer", text: "Partially. Sun is always available from your birth date. Moon is usually available, though roughly one birthday in three falls near an ingress and needs a time. Rising is genuinely not available — the Ascendant moves through all twelve signs in 24 hours." } },
        { "@type": "Question", name: "Why don't I relate to my Sun sign?", acceptedAnswer: { "@type": "Answer", text: "Usually because your Rising and Moon are doing more visible work. The Rising governs day-to-day behaviour and often feels more 'you' than the Sun. If you have a stellium in another sign, that sign dominates — a Gemini Sun with four planets in Cancer is functionally a Cancer with a Gemini job title." } },
        { "@type": "Question", name: "What if my Sun and Rising are the same sign?", acceptedAnswer: { "@type": "Answer", text: "You were born near sunrise. What you see is what you get — very little gap between internal identity and external presentation. The trade-off is a lack of range. If all three match, that's a stellium: enormous consistency and almost no built-in counterweight to that sign's shadow." } },
        { "@type": "Question", name: "Which Big Three combinations are rarest?", acceptedAnswer: { "@type": "Answer", text: "There are 1,728 possible combinations, and Rising sign distribution is uneven — it depends on your latitude. In the northern hemisphere at mid-latitudes, Pisces and Aries Rising are genuinely uncommon; Libra or Scorpio Rising are over-represented. The effect reverses in the southern hemisphere." } },
        { "@type": "Question", name: "Does Big Three compatibility predict relationships?", acceptedAnswer: { "@type": "Answer", text: "Each placement predicts something different. Sun–Sun predicts whether you admire each other. Moon–Moon predicts whether you feel safe — the most predictive for long-term relationships. Rising–Rising predicts initial attraction. For romantic compatibility specifically, Venus and Mars matter more than any of the Big Three." } },
        { "@type": "Question", name: "What is the Big Six?", acceptedAnswer: { "@type": "Answer", text: "The Big Six is your Big Three plus Mercury (how you think), Venus (what you love) and Mars (what drives you). It covers all five personal planets plus the Ascendant — the complete set of fast-moving, individual placements in a chart." } },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Big Three Calculator", item: "https://bluntchart.com/big-three-calculator" },
      ],
    },
  ],
};

export default function BigThreePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BigThreeClient />
    </>
  );
}