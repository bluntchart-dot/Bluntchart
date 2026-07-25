"use client";

import { AlternativePageShell, type AlternativePageData } from "@/components/AlternativePageShell";

const data: AlternativePageData = {
  competitor: "The Pattern",
  competitorSlug: "the-pattern",
  competitorImage: "/The pattern.png",
  competitorImageAlt: "The Pattern astrology app logo — the The Pattern alternative comparison on BluntChart",
  breadcrumb: "The Pattern Alternative",
  h1: <>The Pattern alternative that <em>shows you the placement</em> behind the pattern.</>,
  subtitle: "The Pattern hides the astrology on purpose. You feel the pattern but never see where it comes from. BluntChart shows the chart, names the placement, and explains the fear it's protecting — in plain language, one-time $15, no subscription.",
  trustRow: [
    "<b>$15</b> one-time",
    "<b>No</b> subscription",
    "<b>Shows</b> your chart",
    "Free preview, no card",
  ],
  answerBox: (
    <p>
      If you want the actual astrology behind the psychology, BluntChart is the strongest <strong>The Pattern alternative</strong> in 2026.
      The Pattern gives you personality patterns with no chart and no jargon. BluntChart reads your <strong>full natal chart</strong> and names the exact placement driving each pattern —
      &ldquo;this is your Saturn in the 4th, here&apos;s the fear it&apos;s protecting&rdquo; — in plain language, for a <strong>one-time $15</strong> with no subscription.
    </p>
  ),
  creditPros: [
    "Genuinely elegant psychological framing — the archetype-based patterns feel real and personal.",
    "The Bond feature for compatibility is a genuinely clever piece of product design.",
    "Accessible to complete beginners who'd bounce off traditional astrology vocabulary.",
    "Content is thoughtful and clearly written by people who understand relationships.",
  ],
  creditCons: [
    "Hides the astrology on purpose — you feel the pattern but never get to see the source.",
    "Core features moved behind a recurring subscription, which frustrated many long-term users.",
    "Bite-size, drip-fed sections rather than one long, integrated reading you can sit with.",
    "You can't learn anything about your chart, because the chart itself is intentionally invisible.",
  ],
  comparisonLede: "One shows you the vibe. The other shows you the placement, the reason, and the receipt — once.",
  comparison: [
    { feature: "Pricing model", bluntchart: { text: "One-time $15, yours forever" }, competitor: { text: "Recurring subscription" } },
    { feature: "Shows your actual birth chart", bluntchart: { text: "wheel + placements", kind: "yes" }, competitor: { text: "hidden by design", kind: "no" } },
    { feature: "Names the placement behind each pattern", bluntchart: { text: "Venus, Saturn, Moon, houses", kind: "yes" }, competitor: { text: "no astrology shown", kind: "no" } },
    { feature: "Reading depth", bluntchart: { text: "~1,500 words, one sitting", kind: "yes" }, competitor: { text: "Bite-size sections, drip-fed" } },
    { feature: "Brutally honest tone", bluntchart: { text: "", kind: "yes" }, competitor: { text: "Gentle / psychological", kind: "lim" } },
    { feature: "Something you keep & re-read", bluntchart: { text: "emailed + share card", kind: "yes" }, competitor: { text: "lives in the app", kind: "no" } },
    { feature: "You can learn the astrology", bluntchart: { text: "explained in plain terms", kind: "yes" }, competitor: { text: "jargon removed entirely", kind: "no" } },
    { feature: "Relationship / compatibility depth", bluntchart: { text: "In-reading now · dedicated soon", kind: "lim" }, competitor: { text: "its strength", kind: "yes" } },
    { feature: "Free preview before paying", bluntchart: { text: "2 insights, no card", kind: "yes" }, competitor: { text: "Free trial → paywall", kind: "lim" } },
  ],
  comparisonFootnote: "App pricing and paywalls in this category change often; comparison reflects publicly reported features and pricing at time of writing.",
  differenceH2: <>The pattern, and the <em>placement</em> underneath it.</>,
  differenceLede: "The Pattern says you have a \"wall.\" BluntChart says: it's your Saturn in the 4th, here's the fear it's protecting, and here's why it fires when it does.",
  sampleH2: <>The Pattern would call this &ldquo;a wall.&rdquo; Here&apos;s what BluntChart <em>actually says.</em></>,
  sampleLede: "Same kind of insight — but with the placement shown and the honesty turned all the way up. This is what a reading sounds like when the astrology isn't hidden from you. A genuine sample; your reading is written to your exact placements.",
  sampleExcerpts: [
    { placement: "On your Saturn in the 4th house", text: "The Pattern would tell you that you have \"a wall.\" Here's the wall: home never felt fully safe, so you learned to be your own foundation early. It made you dependable and a little unreachable. You don't let people take care of you, because some part of you decided a long time ago that it wasn't coming anyway." },
    { placement: "On your North Node in Libra", text: "You keep attracting people who need saving because being needed feels safer than being chosen. It isn't romance — it's a role. What your chart is pointing at isn't finding a better person. It's learning to tolerate being wanted for nothing you have to earn." },
  ],
  sampleLocked: "On your Mercury–Pluto square — why you say the calm, reasonable thing out loud and the devastating thing in your head, and who first taught you it wasn't safe to say both…",
  stayTitle: "Honestly? Some people should stay on The Pattern.",
  stayBody: (
    <>
      If you specifically want <b>zero astrology language</b> — pure psychological archetypes, bond analysis, and relationship timing, with none of the planets-and-houses vocabulary — The Pattern is built exactly for that, and it does it well.
      Switch to BluntChart when you&apos;re tired of feeling the pattern without ever seeing the source, and you want <em>one</em> honest reading that shows you the chart, names the placement, and is yours to keep for $15.
    </>
  ),
  faqs: [
    { q: "What is the best alternative to The Pattern?", a: "BluntChart is the strongest The Pattern alternative in 2026 for people who want the actual astrology behind the psychology. The Pattern gives you personality patterns with no chart and no jargon; BluntChart reads your full natal chart and names the exact placement driving each pattern, in plain language, for a one-time $15 with no subscription." },
    { q: "Is BluntChart a subscription like The Pattern?", a: "No. BluntChart is a one-time $15 purchase, yours forever. The Pattern moved core features behind a recurring subscription, which frustrated many longtime users. BluntChart never charges monthly." },
    { q: "Does BluntChart show my actual birth chart?", a: "Yes. Unlike The Pattern, which deliberately hides the chart and avoids astrological terms, BluntChart uses and shows your real natal chart — planets, houses and aspects — and explains what each means in plain language, plus a natal chart wheel in your delivery." },
    { q: "Is BluntChart good for relationships like The Pattern?", a: "Your reading covers attraction patterns and why you repeat them, using your Venus placement, 7th house and nodal axis. A dedicated Compatibility reading for two people is launching soon. The Pattern stays strong specifically for its bond and relationship-timing features." },
    { q: "Can I try it free before paying the $15?", a: "Yes. Two free preview insights, no account, no card. You only pay the one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." },
    { q: "Is this AI-generated? Will it feel robotic?", a: "It's generated with AI, but built specifically to interpret your exact chart like a brutally honest friend, not a horoscope app. The goal: you read it and think, \"how did it know that.\"" },
  ],
  founderBubbles: [
    <>Real talk: I think The Pattern is genuinely clever, and I&apos;m not here to trash it. The thing that always bugged me is that it hides the chart from you <b>on purpose</b>. You feel the pattern, but you never get to see where it actually comes from.</>,
    <>A pattern with no source is just a horoscope with better marketing. So BluntChart shows you the placement — &ldquo;this is your Saturn, here&apos;s the fear it&apos;s guarding&rdquo; — in plain language, once, for $15. No monthly anything.</>,
    <>You don&apos;t have to cancel a thing or take my word for it. Two insights are free, no card. Read them and decide for yourself.</>,
  ],
  trustBadges: [
    { icon: "🔒", title: "Never sold", note: "Your birth data stays yours" },
    { icon: "🚫", title: "No subscription", note: "One-time $15, that's it" },
    { icon: "✍️", title: "Your exact chart", note: "Shown, not hidden" },
    { icon: "🎁", title: "Free preview", note: "No account, no card" },
  ],
  ctaBandH2: <>Stop feeling the pattern. <em>See it.</em></>,
  ctaBandBody: "Two free insights, no account, no card. The full reading — chart, placements, and the honest why — is $15, once.",
};

export default function ThePatternAlternativeClient() {
  return <AlternativePageShell data={data} />;
}
