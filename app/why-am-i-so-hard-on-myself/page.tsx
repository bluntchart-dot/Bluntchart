import type { Metadata } from "next";
import HardOnMyselfClient from "./HardOnMyselfClient";

export const metadata: Metadata = {
  title: "Why Am I So Hard on Myself? What Your Chart Says | BluntChart",
  description:
    "The inner critic isn't your standards and it isn't motivation. Where the voice comes from, why it stays, and the placements in your chart that describe it.",
  alternates: { canonical: "https://bluntchart.com/why-am-i-so-hard-on-myself" },
  openGraph: {
    title: "Why Am I So Hard on Myself? What Your Chart Says | BluntChart",
    description: "The inner critic isn't your standards. Where the voice comes from, why it stays, and the placements that describe it.",
    url: "https://bluntchart.com/why-am-i-so-hard-on-myself",
    siteName: "BluntChart",
    type: "article",
    publishedTime: "2026-07-25T00:00:00+00:00",
    authors: ["https://bluntchart.com/founder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Am I So Hard on Myself? | BluntChart",
    description: "The inner critic was installed, not invented. Where it comes from, and the chart placements that describe yours.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Why Am I So Hard on Myself?",
      description: "The inner critic isn't your standards and it isn't motivation. Where the voice comes from, why it stays, and the placements in your chart that describe it.",
      author: { "@type": "Person", name: "Ishika", url: "https://bluntchart.com/founder" },
      publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
      datePublished: "2026-07-25T00:00:00+00:00",
      dateModified: "2026-07-25T00:00:00+00:00",
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/why-am-i-so-hard-on-myself" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Patterns", item: "https://bluntchart.com/#patterns" },
        { "@type": "ListItem", position: 3, name: "Why Am I So Hard on Myself", item: "https://bluntchart.com/why-am-i-so-hard-on-myself" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Why can't I accept a compliment?", acceptedAnswer: { "@type": "Answer", text: "Because praise contradicts the model you're running. If your working assumption is that you're falling short, positive feedback is data that doesn't fit the system, so it gets deflected rather than absorbed. It isn't modesty and it isn't fishing — the compliment genuinely has nowhere to land." } },
        { "@type": "Question", name: "Is being hard on myself why I'm successful?", acceptedAnswer: { "@type": "Answer", text: "This is the belief that keeps the pattern in place, and the evidence is against it. Research on self-criticism generally associates it with more avoidance and worse recovery from setbacks, while self-compassion is associated with more persistence. You've likely succeeded alongside the critic rather than because of it." } },
        { "@type": "Question", name: "Does Saturn in my chart mean I'll always feel this way?", acceptedAnswer: { "@type": "Answer", text: "No, and Saturn is the specific placement astrologers most consistently describe as improving over a lifetime. It describes something that's hard early and becomes competence later. Most people report the harshness easing considerably after their first Saturn return, around age 29." } },
        { "@type": "Question", name: "Why do I feel like I'm never doing enough even when I'm doing a lot?", acceptedAnswer: { "@type": "Answer", text: "Because the measurement isn't against your output — it's against a standard that adjusts upward as you meet it. That's characteristic of Saturn and of Capricorn placements in particular. The goalpost isn't moving to be cruel; it was never fixed to begin with." } },
        { "@type": "Question", name: "What's the difference between high standards and self-criticism?", acceptedAnswer: { "@type": "Answer", text: "High standards evaluate the work. Self-criticism evaluates you. The same sentence — 'this isn't good enough' — means something entirely different depending on which one is the subject." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HardOnMyselfClient />
    </>
  );
}
