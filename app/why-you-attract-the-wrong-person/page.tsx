import type { Metadata } from "next";
import AttractWrongPersonClient from "./AttractWrongPersonClient";

export const metadata: Metadata = {
  title: "Why Do I Attract Emotionally Unavailable People? | BluntChart",
  description:
    "The pattern isn't bad luck and it isn't your fault. What actually drives it, where it starts, and the placements in your chart that name it precisely.",
  alternates: { canonical: "https://bluntchart.com/why-you-attract-the-wrong-person" },
  openGraph: {
    title: "Why Do I Attract Emotionally Unavailable People? | BluntChart",
    description:
      "The pattern isn't bad luck. What actually drives it, where it starts, and the placements in your chart that name it precisely.",
    url: "https://bluntchart.com/why-you-attract-the-wrong-person",
    siteName: "BluntChart",
    type: "article",
    publishedTime: "2026-07-25T00:00:00+00:00",
    authors: ["https://bluntchart.com/founder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Do I Attract Emotionally Unavailable People? | BluntChart",
    description: "Psychology first. Your chart, second. Written to name the pattern, not diagnose you.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: "Why Do I Attract Emotionally Unavailable People?",
      description:
        "The pattern isn't bad luck and it isn't your fault. What actually drives it, where it starts, and the placements in your chart that name it precisely.",
      author: { "@type": "Person", name: "Ishika", url: "https://bluntchart.com/founder" },
      publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
      datePublished: "2026-07-25T00:00:00+00:00",
      dateModified: "2026-07-25T00:00:00+00:00",
      mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/why-you-attract-the-wrong-person" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
        { "@type": "ListItem", position: 2, name: "Patterns", item: "https://bluntchart.com/#patterns" },
        { "@type": "ListItem", position: 3, name: "Why You Attract the Wrong Person", item: "https://bluntchart.com/why-you-attract-the-wrong-person" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Why am I only attracted to people who don't want me?", acceptedAnswer: { "@type": "Answer", text: "Because unpredictable reward is more compelling than reliable reward — this is a well-established finding in behavioural psychology, not a quirk of yours. Someone who wants you consistently removes the uncertainty, and if uncertainty is what your system learned to read as significance, their steadiness registers as absence of feeling. It isn't. It's just quiet." } },
        { "@type": "Question", name: "Does my birth chart mean I'm destined to keep repeating this?", acceptedAnswer: { "@type": "Answer", text: "No. Placements describe patterns, not outcomes. A Venus–Saturn aspect describes a difficulty in receiving love easily; it says nothing about whether you'll resolve it. People with the same aspect end up in very different places, and the difference is awareness, not astrology." } },
        { "@type": "Question", name: "Is this the same as an anxious attachment style?", acceptedAnswer: { "@type": "Answer", text: "There's substantial overlap, and attachment theory is the better-evidenced framework of the two. Astrology isn't a competing explanation — it's a more granular description. Attachment theory gives you a category. Your chart gives you the specifics of your version of it." } },
        { "@type": "Question", name: "Why do I keep attracting narcissists?", acceptedAnswer: { "@type": "Answer", text: "Worth being careful with this word — it's a clinical diagnosis and it's applied very loosely online. What's usually happening is a match between someone who over-gives and someone who over-takes. If you learned that being useful was how you earned closeness, you'll be unusually tolerant of people who take a lot, and unusually attractive to them. That's a dynamic, not a diagnosis of them." } },
        { "@type": "Question", name: "Can I change my type?", acceptedAnswer: { "@type": "Answer", text: "Your instinctive pull is slow to change. What changes faster is what you do about it — the gap between noticing an attraction and acting on it. Most people find the pull softens gradually once the pattern is conscious, rather than switching off." } },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AttractWrongPersonClient />
    </>
  );
}
