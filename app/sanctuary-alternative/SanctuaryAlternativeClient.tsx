"use client";

import { AlternativePageShell, type AlternativePageData } from "@/components/AlternativePageShell";

const data: AlternativePageData = {
  competitor: "Sanctuary",
  competitorSlug: "sanctuary",
  competitorImage: "/Sanctuary.png",
  competitorImageAlt: "Sanctuary astrology app logo — the Sanctuary alternative comparison on BluntChart",
  breadcrumb: "Sanctuary Alternative",
  h1: <>The Sanctuary alternative that <em>doesn&apos;t bill you by the minute.</em></>,
  subtitle: "Sanctuary connects you to live human readers on a per-minute meter. BluntChart is the depth of a real reading — in writing, at a flat one-time $15, yours forever. All the depth. None of the clock.",
  trustRow: [
    "<b>Flat $15</b>",
    "<b>No</b> per-minute",
    "<b>~1,500 words</b> you keep",
    "Free preview, no card",
  ],
  answerBox: (
    <p>
      If you want the <strong>depth of a real reading without a per-minute meter</strong>, BluntChart is the strongest Sanctuary alternative in 2026.
      Sanctuary bills live human readers by the minute — an in-depth session climbs quickly. BluntChart delivers a full ~1,500-word natal chart reading
      for a <strong>flat one-time $15</strong>, in writing, that you keep forever. Sanctuary is best when you specifically want a live human on the other end of the line.
    </p>
  ),
  creditPros: [
    "Real, vetted human astrologers and psychics — the depth a live conversation offers is genuinely different.",
    "Great for specific, urgent questions where back-and-forth matters more than a written reading.",
    "You can ask follow-ups in real time and change direction mid-session.",
    "$4.99 five-minute intro removes the barrier to trying a live reader for the first time.",
  ],
  creditCons: [
    "Per-minute pricing means the meter is always in your peripheral vision — hard to relax into the reading.",
    "Total cost is unknowable up front. A 45-minute session can climb into three figures fast.",
    "Nothing lasting — the chat ends and the insight goes with it. No document to re-read next week.",
    "Reader quality varies. The tone and depth you get depends heavily on who's online when you book.",
  ],
  comparisonLede: "One is a live conversation billed by the minute. The other is one deep written reading at a price you know before you start.",
  comparison: [
    { feature: "Pricing model", bluntchart: { text: "Flat $15, known up front" }, competitor: { text: "~$4.99 intro, then per-minute" } },
    { feature: "Total cost predictable", bluntchart: { text: "fixed before you start", kind: "yes" }, competitor: { text: "the clock decides", kind: "no" } },
    { feature: "Depth", bluntchart: { text: "~1,500 words on your full chart", kind: "yes" }, competitor: { text: "As deep as you can afford by the minute" } },
    { feature: "Something you keep & re-read", bluntchart: { text: "emailed + share card", kind: "yes" }, competitor: { text: "chat ends, reading ends", kind: "no" } },
    { feature: "Instant, no scheduling", bluntchart: { text: "right now", kind: "yes" }, competitor: { text: "Needs a reader online", kind: "lim" } },
    { feature: "Brutally honest tone", bluntchart: { text: "zero filter", kind: "yes" }, competitor: { text: "Varies by reader", kind: "lim" } },
    { feature: "Full natal chart interpreted", bluntchart: { text: "planets, houses, aspects", kind: "yes" }, competitor: { text: "Depends on time bought", kind: "lim" } },
    { feature: "Live human, ask-anything", bluntchart: { text: "it's a written reading", kind: "no" }, competitor: { text: "its whole point", kind: "yes" } },
    { feature: "Free preview before paying", bluntchart: { text: "2 insights, no card", kind: "yes" }, competitor: { text: "Paid intro", kind: "lim" } },
  ],
  comparisonFootnote: "Per-minute rates and intro offers vary by reader and change over time; comparison reflects publicly reported pricing at time of writing.",
  differenceH2: <>Everything a good reading would surface — <em>without watching the clock.</em></>,
  differenceLede: "No meter, no small talk to burn minutes, no \"our time's almost up.\" Just the whole chart, read honestly, for one flat price.",
  sampleH2: <>A live reader would bill you by the minute for this. Here it&apos;s just… <em>here.</em></>,
  sampleLede: "Take your time with it. Re-read it at 1am. No counter ticking, no \"our session's almost up.\" This is the depth of a real reading, in writing, at a price you already know. A genuine sample; your reading is written to your exact chart.",
  sampleExcerpts: [
    { placement: "On your Mars in Pisces", text: "Your energy doesn't move in straight lines — it leaks. You avoid direct conflict until it comes out sideways: the passive comment, the sudden silence, the thing you swore you were \"fine\" about. You're not non-confrontational. You're conflict-avoidant, and the difference is quietly costing you." },
    { placement: "On your Moon in Scorpio", text: "You feel everything at full volume and show almost none of it. You test people by going quiet and waiting to see who notices — and when they don't, you take it as proof. But you never told them the test was running. That's the part your chart wants you to sit with." },
  ],
  sampleLocked: "On your Sun–Saturn opposition — why success never quite feels like enough to you, and whose voice you're actually still trying to satisfy when you overwork…",
  stayTitle: "Honestly? Sometimes you want the human.",
  stayBody: (
    <>
      If what you need is to <b>talk</b> — a live person, a specific question about a specific situation, the back-and-forth of a real conversation — Sanctuary&apos;s reader network is built for exactly that,
      and BluntChart isn&apos;t trying to replace it. Choose BluntChart when you want the full picture read honestly, delivered in writing, for a price you know before you start — and something you can still open
      a year from now. A lot of people do both: BluntChart for the deep baseline, a live reading when a real question comes up.
    </>
  ),
  faqs: [
    { q: "What is the best Sanctuary alternative?", a: "If you want the depth of a real reading without a per-minute meter, BluntChart is the strongest Sanctuary alternative in 2026. Sanctuary connects you to live human readers billed by the minute; BluntChart delivers a full ~1,500-word natal chart reading for a flat one-time $15 that you keep forever. Sanctuary is best when you specifically want to talk to a real person live." },
    { q: "How much does BluntChart cost compared to Sanctuary?", a: "BluntChart is a flat one-time $15, with no per-minute charges and no subscription. Sanctuary starts around a $4.99 five-minute intro and then bills per minute, so an in-depth session can climb quickly. With BluntChart the price is fixed before you start." },
    { q: "Is BluntChart a real reading or just an app horoscope?", a: "It interprets your full natal chart — planets, houses and aspects — in about 1,500 words specific to you, not a generic sun-sign horoscope. It's delivered instantly and in writing so you can re-read it. Sanctuary offers live human readers; BluntChart offers a deep written reading with no clock running." },
    { q: "Do I get to keep my reading?", a: "Yes. Your reading is emailed to you the moment payment goes through and is yours forever, along with your natal chart wheel and a shareable card. A live Sanctuary chat ends when the session ends; a BluntChart reading you can revisit any time." },
    { q: "Can I try it free before paying the $15?", a: "Yes. Two free preview insights, no account, no card. You only pay the flat one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." },
    { q: "Is this AI-generated? Will it feel robotic?", a: "It's generated with AI, but built specifically to interpret your exact chart like a brutally honest friend, not a horoscope app. The goal: you read it and think, \"how did it know that.\"" },
  ],
  founderBubbles: [
    <>Honest note: I&apos;ve paid for live readings, and some were genuinely incredible. But I spent half of each one watching the <b>per-minute counter</b> instead of actually listening to the person in front of me.</>,
    <>I wanted the depth of a real reading without the clock — something I could sit with, re-read at 1am, and not dread the bill for afterward. So BluntChart is a flat $15, in writing, yours forever.</>,
    <>And if what you really want is a human to talk to — honestly, go book one. This isn&apos;t that. This is for when you want the whole picture, no meter, no pressure. Two insights are free if you want to feel it first.</>,
  ],
  trustBadges: [
    { icon: "🔒", title: "Never sold", note: "Your birth data stays yours" },
    { icon: "💵", title: "Flat $15", note: "No meter, no surprises" },
    { icon: "♾️", title: "Yours forever", note: "Re-read it any time" },
    { icon: "🎁", title: "Free preview", note: "No account, no card" },
  ],
  ctaBandH2: <>Skip the meter. <em>Keep the reading.</em></>,
  ctaBandBody: "Two free insights, no account, no card. The full reading is a flat $15 — no per-minute surprises, yours forever.",
};

export default function SanctuaryAlternativeClient() {
  return <AlternativePageShell data={data} />;
}
