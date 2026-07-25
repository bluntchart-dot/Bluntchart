"use client";

import { AlternativePageShell, type AlternativePageData } from "@/components/AlternativePageShell";

const data: AlternativePageData = {
  competitor: "CHANI",
  competitorSlug: "chani",
  competitorImage: "/chani.png",
  competitorImageAlt: "CHANI astrology app logo — the CHANI app alternative comparison on BluntChart",
  breadcrumb: "CHANI Alternative",
  h1: <>The CHANI app alternative for people done being told to <em>breathe through it.</em></>,
  subtitle: "CHANI wraps astrology in mindfulness, affirmations and weekly rituals. BluntChart takes the wrapper off. One brutally honest, full birth chart reading — one-time $15, no subscription, no gentle framing.",
  trustRow: [
    "<b>$15</b> one-time",
    "<b>No</b> subscription",
    "<b>No</b> affirmations",
    "Free preview, no card",
  ],
  answerBox: (
    <p>
      If you want the depth of good astrology <strong>without the gentle framing</strong>, BluntChart is the strongest CHANI app alternative in 2026.
      CHANI is a beautiful, human-written, subscription wellness app for affirming, weekly guidance. BluntChart is one deep, unvarnished reading of your
      <strong> full natal chart</strong> — ~1,500 words in plain language, a <strong>one-time $15</strong>, no recurring anything. CHANI is a hug. BluntChart is a mirror.
    </p>
  ),
  creditPros: [
    "Written by real human astrologers (Chani Nicholas and team), no AI — that's a genuine strength.",
    "Beautiful design and a values-driven, activist-adjacent brand voice unlike anything else on the App Store.",
    "Meditations, rituals and guided reflection are actually useful for the hard weeks.",
    "One of the most trusted names in modern wellness astrology.",
  ],
  creditCons: [
    "The affirming voice can start feeling like avoidance when what you needed was to hear the hard part.",
    "Recurring subscription (reported around $11.99/month) — the cost adds up if you only occasionally want depth.",
    "Weekly drip-feed rather than one long, integrated reading of your whole chart in one sitting.",
    "Nothing you can save and re-read as one piece — it lives in the app, week by week.",
  ],
  comparisonLede: "One is a gentle weekly wellness ritual. The other is one honest reading that names what's happening in your chart, in plain language, once.",
  comparison: [
    { feature: "Pricing model", bluntchart: { text: "One-time $15, yours forever" }, competitor: { text: "Recurring subscription (~$11.99/mo)" } },
    { feature: "Tone", bluntchart: { text: "Brutally honest, zero filter", kind: "yes" }, competitor: { text: "Affirming, gentle, wellness" } },
    { feature: "Format", bluntchart: { text: "One deep reading, ~1,500 words" }, competitor: { text: "Weekly content, drip-fed over time" } },
    { feature: "Written by human astrologers", bluntchart: { text: "No — AI, tuned to your exact chart", kind: "lim" }, competitor: { text: "Chani & team, no AI", kind: "yes" } },
    { feature: "Something you keep & re-read", bluntchart: { text: "emailed + share card", kind: "yes" }, competitor: { text: "Lives in the app, weekly", kind: "lim" } },
    { feature: "Meditations, rituals, mindfulness", bluntchart: { text: "not the point", kind: "no" }, competitor: { text: "its strength", kind: "yes" } },
    { feature: "Full natal chart interpreted at once", bluntchart: { text: "planets, houses, aspects", kind: "yes" }, competitor: { text: "Unfolds gradually", kind: "lim" } },
    { feature: "Free preview before paying", bluntchart: { text: "2 insights, no card", kind: "yes" }, competitor: { text: "Limited free tier", kind: "lim" } },
  ],
  comparisonFootnote: "App pricing varies by platform and region and changes over time; comparison reflects publicly reported features and pricing at time of writing.",
  differenceH2: <>The parts a gentle app <em>won&apos;t say out loud.</em></>,
  differenceLede: "Affirmations tell you you're doing your best. BluntChart tells you why you text back immediately and then resent yourself for it.",
  sampleH2: <>CHANI would frame this gently. Here&apos;s what BluntChart <em>actually says.</em></>,
  sampleLede: "No affirmation, no cushioning, no \"honor where you are.\" Just the pattern, named — the way a friend who loves you but is done being polite would say it. A genuine sample; your reading is written to your exact placements.",
  sampleExcerpts: [
    { placement: "On your Sun in Leo", text: "You perform confidence so well that nobody thinks to check whether you actually have it. You give everyone else the encouraging speech and privately wonder if you'd still be loved if you stopped being impressive. You don't need another affirmation. You need one person to see you on a boring day and stay." },
    { placement: "On your Venus in Virgo", text: "You show love by fixing things — noticing what's wrong, quietly handling it, improving people who didn't ask. Then you feel unloved when nobody does it back. You call it caring. Sometimes it's control with better PR. The people who love you wish you'd let them see the version of you that isn't useful." },
  ],
  sampleLocked: "On your Chiron in the 1st house — why every room still feels a little like an audition, and the old wound sitting underneath the way you introduce yourself…",
  stayTitle: "Honestly? Plenty of people should stay on CHANI.",
  stayBody: (
    <>
      If what you want from astrology is to feel <b>held</b> — gentle weekly guidance, meditations for the hard weeks, a values-driven brand written by real human astrologers — CHANI does that as
      well as anyone alive, and BluntChart isn&apos;t trying to compete with it on that. Choose BluntChart when the gentle version has stopped landing and you want the unvarnished one: one honest reading, no affirmations,
      no subscription, $15 and done. Some people keep both — CHANI for the soft weeks, BluntChart for the reckoning.
    </>
  ),
  faqs: [
    { q: "What is the best CHANI app alternative?", a: "BluntChart is the strongest CHANI app alternative in 2026 for people who want honesty over affirmation. CHANI offers gentle, human-written weekly astrology, meditations and rituals on a subscription; BluntChart delivers one brutally honest, full natal chart reading for a one-time $15 with no subscription. CHANI is best if you want a soothing wellness companion; BluntChart is best if you want a mirror." },
    { q: "Is BluntChart written by a human like CHANI?", a: "No, and we're upfront about it. CHANI's content is written by astrologer Chani Nicholas and her team, with no AI — that's a genuine strength. BluntChart is generated by AI built specifically to interpret your exact natal chart in plain, brutally honest language. Different approaches: CHANI is a curated human voice; BluntChart is your whole chart read back to you without the filter." },
    { q: "Is BluntChart a subscription like CHANI?", a: "No. BluntChart is a one-time $15 purchase, yours forever. CHANI requires a recurring subscription (reported around $11.99/month) for full access. BluntChart never charges monthly." },
    { q: "Is BluntChart affirming and gentle like CHANI?", a: "No. CHANI leans into affirmation, mindfulness and radical self-acceptance. BluntChart is deliberately blunt — it names the pattern your friends are too polite to. If affirmations land for you, CHANI is the better fit. If they've started to feel hollow, BluntChart is the un-gentle version." },
    { q: "Can I try it free before paying the $15?", a: "Yes. Two free preview insights, no account, no card. You only pay the one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." },
    { q: "Is this AI-generated? Will it feel robotic?", a: "It's generated with AI, but built specifically to interpret your exact chart like a brutally honest friend, not a horoscope app. The goal: you read it and think, \"how did it know that.\"" },
  ],
  founderBubbles: [
    <>Let me be fair first: CHANI is genuinely beautiful, it&apos;s human-written, and Chani Nicholas is the real deal. If you want astrology that <b>holds you gently</b>, that&apos;s a great app and I&apos;m not going to pretend otherwise.</>,
    <>BluntChart is just a different mood. I didn&apos;t want to be affirmed — I wanted to be told the thing my friends were too kind to say. So this is one reading, no soft framing, no monthly anything. A mirror, not a hug.</>,
    <>If affirmations land for you, honestly, stay where you are. If they&apos;ve started to feel hollow, two insights here are free — no card — and they don&apos;t sugarcoat.</>,
  ],
  trustBadges: [
    { icon: "🔒", title: "Never sold", note: "Your birth data stays yours" },
    { icon: "🚫", title: "No subscription", note: "One-time $15, that's it" },
    { icon: "🪞", title: "Blunt, not gentle", note: "The unvarnished version" },
    { icon: "🎁", title: "Free preview", note: "No account, no card" },
  ],
  ctaBandH2: <>Done being told to <em>breathe through it?</em></>,
  ctaBandBody: "Two free insights, no account, no card. The full, unfiltered reading is $15 — once. No gentle framing included.",
};

export default function ChaniAlternativeClient() {
  return <AlternativePageShell data={data} />;
}
