import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancer Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
  description:
    "Everything you need to know about Cancer (June 21 – July 22). Personality traits, strengths, weaknesses, love compatibility, career, friendships, and what it really means to be ruled by Moon. Brutally honest astrology — no fluff.",
  keywords: [
    "cancer", "cancer zodiac sign", "cancer personality", "cancer traits",
    "cancer dates", "cancer compatibility", "cancer personality traits",
    "cancer sign", "cancer horoscope", "cancer strengths and weaknesses",
    "cancer in love", "cancer man", "cancer woman", "cancer rising",
    "cancer moon", "cancer zodiac", "cancer element water",
    "cancer moon ruled", "cancer characteristics",
  ],
  openGraph: {
    title: "Cancer Zodiac Sign: Personality Traits, Dates & Compatibility | BluntChart",
    description: "Cancer (June 21 – July 22): personality traits, strengths, weaknesses, love compatibility, and what Moon actually does to your chart.",
    url: "https://bluntchart.com/zodiac-signs/cancer",
    siteName: "BluntChart",
    type: "article",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs/cancer" },
};

export default function CancerLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Cancer Zodiac Sign: Personality Traits, Dates, Compatibility & Meaning",
        url: "https://bluntchart.com/zodiac-signs/cancer",
        author: { "@type": "Organization", name: "BluntChart" },
        publisher: { "@type": "Organization", name: "BluntChart" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the Cancer dates?", acceptedAnswer: { "@type": "Answer", text: "June 21 to July 22. The exact start shifts with the summer solstice." } },
          { "@type": "Question", name: "What planet rules Cancer?", acceptedAnswer: { "@type": "Answer", text: "The Moon, governing emotions, instincts, and memory. It gives Cancer their emotional depth and intuitive abilities." } },
          { "@type": "Question", name: "What element is Cancer?", acceptedAnswer: { "@type": "Answer", text: "Water, along with Scorpio and Pisces. Cancer is Cardinal Water — initiating through emotional connection." } },
          { "@type": "Question", name: "What signs are most compatible with Cancer?", acceptedAnswer: { "@type": "Answer", text: "Taurus (physical security), Scorpio (emotional intensity), and Pisces (intuitive connection)." } },
          { "@type": "Question", name: "Why are Cancers so moody?", acceptedAnswer: { "@type": "Answer", text: "The Moon changes signs every 2.5 days. Cancer's emotional landscape shifts similarly — responding to undercurrents others can't perceive." } },
          { "@type": "Question", name: "What is Cancer Rising?", acceptedAnswer: { "@type": "Answer", text: "Your outward personality radiates warmth and emotional safety. People trust you immediately and share things they normally wouldn't." } },
          { "@type": "Question", name: "What is Cancer Moon?", acceptedAnswer: { "@type": "Answer", text: "The most powerful lunar placement. Oceanic emotional depth, absolute loyalty, and extreme vulnerability to emotional hurt." } },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
          { "@type": "ListItem", position: 3, name: "Cancer", item: "https://bluntchart.com/zodiac-signs/cancer" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}