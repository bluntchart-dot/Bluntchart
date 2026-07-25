import type { Metadata } from "next";
import SelfSabotageClient from "./SelfSabotageClient";

export const metadata: Metadata = {
  title: "Why Do I Self-Sabotage? What Your Chart Says | BluntChart",
  description:
    "Self-sabotage isn't laziness or fear of failure. It's usually protection running badly. The mechanism, the origin, and the placements that describe yours.",
  alternates: { canonical: "https://bluntchart.com/why-do-i-self-sabotage" },
  openGraph: {
    title: "Why Do I Self-Sabotage? What Your Chart Says | BluntChart",
    description: "Self-sabotage isn't laziness. It's usually protection running badly. The mechanism, the origin, and the placements that describe yours.",
    url: "https://bluntchart.com/why-do-i-self-sabotage",
    siteName: "BluntChart",
    type: "article",
    publishedTime: "2026-07-25T00:00:00+00:00",
    authors: ["https://bluntchart.com/founder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Do I Self-Sabotage? What Your Chart Says | BluntChart",
    description: "Protection, not laziness. The mechanism, the origin, and the placements that describe yours.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Why Do I Self-Sabotage?",
      description: "Self-sabotage isn't laziness or fear of failure. It's usually protection running badly. The mechanism, the origin, and the placements that describe yours.",
      author: { "@type": "Person", name: "Ishika", url: "https://bluntchart.com/founder" },
      publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
      datePublished: "2026-07-25T00:00:00+00:00",
      dateModified: "2026-07-25T00:00:00+00:00",
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/why-do-i-self-sabotage" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Patterns", item: "https://bluntchart.com/#patterns" },
        { "@type": "ListItem", position: 3, name: "Why Do I Self-Sabotage", item: "https://bluntchart.com/why-do-i-self-sabotage" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Why do I self-sabotage when things are going well?", acceptedAnswer: { "@type": "Answer", text: "Because 'going well' is the trigger. Progress raises the stakes — it makes the outcome matter, makes failure meaningful, and makes retreat costly. If the underlying pattern is protection against a failure that would say something about you, then the moment success becomes plausible is the moment protection activates." } },
        { "@type": "Question", name: "Is self-sabotage the same as fear of failure?", acceptedAnswer: { "@type": "Answer", text: "Related, but the simple version is often wrong. Plenty of self-sabotage is fear of success — of visibility, of raised expectations, of outgrowing the people you came from. Both produce identical behaviour and need opposite responses, which is why generic advice on this usually misses." } },
        { "@type": "Question", name: "Does my birth chart mean I'm going to keep doing this?", acceptedAnswer: { "@type": "Answer", text: "No. Saturn placements describe difficulty and slow development, not a fixed outcome. Saturn is the planet astrologers most consistently associate with things that genuinely improve with age — it describes what's hard early and competent later. That's the opposite of a life sentence." } },
        { "@type": "Question", name: "Why do I procrastinate on the things I care about most and not the trivial things?", acceptedAnswer: { "@type": "Answer", text: "Because the trivial things carry no risk to your sense of self. Nothing about your identity is at stake in answering an email. The things you care about are the only things where failing would mean something — so they're the only things worth defending against." } },
        { "@type": "Question", name: "How do I tell self-sabotage apart from just not wanting it?", acceptedAnswer: { "@type": "Answer", text: "Self-sabotage is cyclical: you approach, retreat, and approach again, and the wanting returns. Genuinely not wanting something is flat and stable — there's no pull back toward it, just relief when it's dropped. If you keep returning, it's a pattern. If you never do, it wasn't yours." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SelfSabotageClient />
    </>
  );
}
