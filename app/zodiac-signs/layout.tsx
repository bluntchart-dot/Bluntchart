import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 12 Zodiac Signs: Dates, Traits & Meaning | BluntChart",
  description:
    "All 12 zodiac signs with dates, elements, ruling planets, strengths and flaws — written honestly. Find your sign and what it really says about you.",
  openGraph: {
    title: "The 12 Zodiac Signs: Dates, Traits & Meaning | BluntChart",
    description: "All 12 zodiac signs — dates, elements, ruling planets, strengths and flaws. Star signs, honestly.",
    url: "https://bluntchart.com/zodiac-signs",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 12 Zodiac Signs: Dates, Traits & Meaning | BluntChart",
    description: "All 12 zodiac signs — dates, elements, ruling planets, strengths and flaws. Star signs, honestly.",
  },
  alternates: { canonical: "https://bluntchart.com/zodiac-signs" },
};

export default function ZodiacSignsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "12 Zodiac Signs",
        url: "https://bluntchart.com/zodiac-signs",
        description: "Complete guide to all 12 zodiac signs with dates, personality traits, compatibility, and meanings.",
        hasPart: [
          { "@type": "Article", name: "Aries", url: "https://bluntchart.com/zodiac-signs/aries" },
          { "@type": "Article", name: "Taurus", url: "https://bluntchart.com/zodiac-signs/taurus" },
          { "@type": "Article", name: "Gemini", url: "https://bluntchart.com/zodiac-signs/gemini" },
          { "@type": "Article", name: "Cancer", url: "https://bluntchart.com/zodiac-signs/cancer" },
          { "@type": "Article", name: "Leo", url: "https://bluntchart.com/zodiac-signs/leo" },
          { "@type": "Article", name: "Virgo", url: "https://bluntchart.com/zodiac-signs/virgo" },
          { "@type": "Article", name: "Libra", url: "https://bluntchart.com/zodiac-signs/libra" },
          { "@type": "Article", name: "Scorpio", url: "https://bluntchart.com/zodiac-signs/scorpio" },
          { "@type": "Article", name: "Sagittarius", url: "https://bluntchart.com/zodiac-signs/sagittarius" },
          { "@type": "Article", name: "Capricorn", url: "https://bluntchart.com/zodiac-signs/capricorn" },
          { "@type": "Article", name: "Aquarius", url: "https://bluntchart.com/zodiac-signs/aquarius" },
          { "@type": "Article", name: "Pisces", url: "https://bluntchart.com/zodiac-signs/pisces" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Zodiac Signs", item: "https://bluntchart.com/zodiac-signs" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "What are the 12 zodiac signs in order?", acceptedAnswer: { "@type": "Answer", text: "Aries (Mar 21–Apr 19), Taurus (Apr 20–May 20), Gemini (May 21–Jun 20), Cancer (Jun 21–Jul 22), Leo (Jul 23–Aug 22), Virgo (Aug 23–Sep 22), Libra (Sep 23–Oct 22), Scorpio (Oct 23–Nov 21), Sagittarius (Nov 22–Dec 21), Capricorn (Dec 22–Jan 19), Aquarius (Jan 20–Feb 18), Pisces (Feb 19–Mar 20). Dates shift by up to a day between years." } },
          { "@type": "Question", name: "What are the zodiac modalities?", acceptedAnswer: { "@type": "Answer", text: "Every sign combines an element with a modality. Cardinal signs (Aries, Cancer, Libra, Capricorn) initiate. Fixed signs (Taurus, Leo, Scorpio, Aquarius) sustain. Mutable signs (Gemini, Virgo, Sagittarius, Pisces) adapt. Modality often explains behaviour better than element." } },
          { "@type": "Question", name: "What are the ruling planets of each zodiac sign?", acceptedAnswer: { "@type": "Answer", text: "Aries: Mars. Taurus: Venus. Gemini and Virgo: Mercury. Cancer: Moon. Leo: Sun. Libra: Venus. Scorpio: Pluto (Mars traditionally). Sagittarius: Jupiter. Capricorn: Saturn. Aquarius: Uranus (Saturn traditionally). Pisces: Neptune (Jupiter traditionally)." } },
          { "@type": "Question", name: "Am I born 'on the cusp' of two signs?", acceptedAnswer: { "@type": "Answer", text: "No. The Sun is in one sign or the other at any given instant, and it doesn't blend. People born in the first or last couple of degrees of a sign often have several other planets in the neighbouring sign, which produces a genuinely mixed chart — but that's not cusp magic." } },
          { "@type": "Question", name: "Which zodiac signs are most compatible?", acceptedAnswer: { "@type": "Answer", text: "Same element = harmony, complementary element = attraction, square or opposite = friction. This is a very crude instrument — Sun sign compatibility compares one placement out of dozens. Moon sign compatibility is more predictive of long-term relationships; Venus and Mars matter more for romantic chemistry." } },
          { "@type": "Question", name: "Which zodiac sign gets angry easily?", acceptedAnswer: { "@type": "Answer", text: "Aries gets angry fastest — arrives at full volume, gone in twenty minutes. Scorpio and Taurus stay angry the longest — Scorpio's goes underground and waits; Taurus's takes weeks to arrive and never leaves. Cancer's anger comes out sideways as hurt rather than forward as rage." } },
          { "@type": "Question", name: "Which zodiac sign is the luckiest?", acceptedAnswer: { "@type": "Answer", text: "Sagittarius, by tradition — ruled by Jupiter, the classical greater benefic associated with expansion and fortune. Take it with scepticism: luck isn't distributed by birth month." } },
          { "@type": "Question", name: "Did NASA change the zodiac signs? Is there a 13th sign?", acceptedAnswer: { "@type": "Answer", text: "No. Ophiuchus is a real constellation the Sun does pass in front of, but constellations are irregular star patterns while zodiac signs are twelve equal 30-degree divisions of a circle. Astrology has used the twelve equal divisions for 2,500 years and was never anchored to which constellation the Sun is visually in front of." } },
          { "@type": "Question", name: "Why don't I relate to my zodiac sign?", acceptedAnswer: { "@type": "Answer", text: "Your Sun sign is one of dozens of placements in your chart. A Libra Sun with an Aries Moon and Scorpio Rising will act nothing like a typical Libra description. If you have a stellium in another sign, that sign dominates." } },
          { "@type": "Question", name: "What is the difference between Sun sign and star sign?", acceptedAnswer: { "@type": "Answer", text: "They're the same thing. 'Sun sign' is the astrological term; 'star sign' is the popular term, dominant in the UK, Ireland and Australia. Both refer to the sign determined by your birth date." } },
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