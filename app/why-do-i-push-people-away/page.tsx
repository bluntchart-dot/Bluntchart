import type { Metadata } from "next";
import PushPeopleAwayClient from "./PushPeopleAwayClient";

export const metadata: Metadata = {
  title: "Why Do I Push People Away When I Get Close? | BluntChart",
  description:
    "The withdrawal isn't a decision — it's a reflex, and it has a mechanism. What drives it, where it starts, and the placements in your chart that describe it.",
  alternates: { canonical: "https://bluntchart.com/why-do-i-push-people-away" },
  openGraph: {
    title: "Why Do I Push People Away When I Get Close? | BluntChart",
    description: "The withdrawal isn't a decision — it's a reflex. Where it starts, and the chart placements that describe it.",
    url: "https://bluntchart.com/why-do-i-push-people-away",
    siteName: "BluntChart",
    type: "article",
    publishedTime: "2026-07-25T00:00:00+00:00",
    authors: ["https://bluntchart.com/founder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Do I Push People Away When I Get Close? | BluntChart",
    description: "It's a reflex, not a decision. Psychology first, then what your chart says about your version of it.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Why Do I Push People Away When I Get Close?",
      description: "The withdrawal isn't a decision — it's a reflex, and it has a mechanism. What drives it, where it starts, and the placements in your chart that describe it.",
      author: { "@type": "Person", name: "Ishika", url: "https://bluntchart.com/founder" },
      publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
      datePublished: "2026-07-25T00:00:00+00:00",
      dateModified: "2026-07-25T00:00:00+00:00",
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/why-do-i-push-people-away" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Patterns", item: "https://bluntchart.com/#patterns" },
        { "@type": "ListItem", position: 3, name: "Why Do I Push People Away", item: "https://bluntchart.com/why-do-i-push-people-away" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Why do I sabotage relationships when they're going well?", acceptedAnswer: { "@type": "Answer", text: "Because 'going well' is the trigger, not the safety. If closeness has historically preceded loss, then the moment things get good is the moment your system flags maximum exposure. The sabotage isn't aimed at the relationship. It's aimed at the vulnerability." } },
        { "@type": "Question", name: "Is pushing people away the same as being avoidant?", acceptedAnswer: { "@type": "Answer", text: "It overlaps heavily with what attachment researchers describe as avoidant attachment, which is a well-evidenced framework and worth reading about properly. Your chart doesn't compete with that — it describes the particular shape yours takes." } },
        { "@type": "Question", name: "Why do I want closeness and reject it at the same time?", acceptedAnswer: { "@type": "Answer", text: "Because the wanting and the fear are produced by different systems running at different speeds. The want is conscious and slow. The fear is automatic and fast, and it acts first. Both are real. Neither is the 'true' one." } },
        { "@type": "Question", name: "Does a Moon–Saturn aspect mean I'll always be like this?", acceptedAnswer: { "@type": "Answer", text: "No. It describes a starting configuration, not an outcome. What tends to happen with Moon–Saturn is that it softens with age and deliberate attention — this is one of the placements astrologers most consistently describe as getting easier rather than harder over a lifetime." } },
        { "@type": "Question", name: "How do I explain this to my partner without making it their problem?", acceptedAnswer: { "@type": "Answer", text: "Describe the mechanism, not the history, and give it a timeframe. 'I withdraw when I feel close, it's automatic, it isn't about you, and I come back' is complete, honest, and doesn't require them to manage anything." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PushPeopleAwayClient />
    </>
  );
}
