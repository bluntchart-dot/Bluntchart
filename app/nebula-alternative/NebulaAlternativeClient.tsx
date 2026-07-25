"use client";

import { AlternativePageShell, type AlternativePageData } from "@/components/AlternativePageShell";

const data: AlternativePageData = {
  competitor: "Nebula",
  competitorSlug: "nebula",
  competitorImage: "/Nebula.png",
  competitorImageAlt: "Nebula astrology app logo — the Nebula alternative comparison on BluntChart",
  breadcrumb: "Nebula Alternative",
  h1: <>The Nebula alternative with <em>no subscription trap.</em></>,
  subtitle: "Nebula bundles astrology with tarot, palmistry and live psychics — funded by a free trial that quietly converts to auto-renewing billing. BluntChart does one thing: your full natal chart, read honestly, for a flat one-time $15. No trial, no stored card, nothing to cancel.",
  trustRow: [
    "<b>Flat $15</b>",
    "<b>No</b> free trial",
    "<b>No</b> auto-renewal",
    "Nothing to cancel",
  ],
  answerBox: (
    <p>
      If you&apos;re looking for the best <strong>Nebula alternative</strong> in 2026 — one that doesn&apos;t rely on a free trial that auto-renews —
      BluntChart is it. Nebula is an all-in-one spiritual bundle funded by recurring subscriptions and credit packs. BluntChart does one focused thing:
      <strong> your full natal chart, read in ~1,500 plain-language words, for a flat one-time $15</strong>. No trial. No stored card. Nothing renews. Nothing to cancel.
    </p>
  ),
  creditPros: [
    "Genuinely polished all-in-one spiritual app — astrology, tarot, numerology, palmistry, live advisors in one place.",
    "Reader network is real. Live psychic chat is a distinct product BluntChart doesn't offer.",
    "Beginner-friendly UX makes tarot and compatibility features easy to try.",
    "Free trial gives you something to poke at before deciding.",
  ],
  creditCons: [
    "The free trial converts to auto-renewing subscription billing — this is the #1 complaint in App Store reviews.",
    "Credit packs on top of the subscription can add up fast if you use the live advisor features.",
    "Multiple reviewers describe the astrology reading itself as generic or template-feeling.",
    "Cancellation runs through the App Store — deleting the app won't stop the recurring charge.",
  ],
  comparisonLede: "One is a paid bundle that quietly bills you every month. The other is one focused reading at a price you can see, that will never charge you again.",
  comparison: [
    { feature: "Pricing model", bluntchart: { text: "One-time $15, flat" }, competitor: { text: "Auto-renewing subscription + credit packs" } },
    { feature: "Free trial that converts to billing", bluntchart: { text: "none — no card taken", kind: "yes" }, competitor: { text: "Yes, then recurring", kind: "no" } },
    { feature: "Auto-renewal / stored card", bluntchart: { text: "none", kind: "yes" }, competitor: { text: "Yes", kind: "no" } },
    { feature: "Anything to cancel", bluntchart: { text: "Nothing", kind: "yes" }, competitor: { text: "Cancel via App Store", kind: "no" } },
    { feature: "Focus", bluntchart: { text: "One deep, honest reading", kind: "yes" }, competitor: { text: "Everything bundle" } },
    { feature: "Reading specificity", bluntchart: { text: "~1,500 words to your exact chart", kind: "yes" }, competitor: { text: "Often described as generic", kind: "lim" } },
    { feature: "Upsell to paid live readings", bluntchart: { text: "none", kind: "yes" }, competitor: { text: "Yes (credit packs)", kind: "no" } },
    { feature: "Something you keep & re-read", bluntchart: { text: "emailed + share card", kind: "yes" }, competitor: { text: "Lives in the app", kind: "lim" } },
    { feature: "Free preview before paying", bluntchart: { text: "2 insights, no card", kind: "yes" }, competitor: { text: "Trial (card required)", kind: "lim" } },
  ],
  comparisonFootnote: "Subscription prices and trial terms vary by platform, region and promotion and change over time; comparison reflects publicly reported terms and user complaints at time of writing. Always check current App Store terms before subscribing to any app.",
  differenceH2: <>One thing, done honestly — <em>instead of twelve, gated.</em></>,
  differenceLede: "No tarot upsell, no palmistry tab, no \"unlock this insight.\" Just your whole chart, read straight, for one flat price.",
  sampleH2: <>&ldquo;Generic&rdquo; is the top Nebula complaint. Here&apos;s what <em>specific</em> reads like.</>,
  sampleLede: "No horoscope-for-everyone hedging. Sentences that only fit your placements, in a voice that isn't being polite. A genuine sample; your reading is written to your exact chart.",
  sampleExcerpts: [
    { placement: "On your Mercury in Scorpio", text: "You don't ask questions — you investigate. Half the time you already know the answer; you just want to watch whether they'll lie to your face. It makes you unnervingly perceptive and a little exhausting to be close to. The trust issue isn't that people are dishonest. It's that you'd rather catch them than believe them." },
    { placement: "On your Moon in Capricorn", text: "You learned early that being useful was safer than being needy, so you got impressively self-sufficient and quietly starving for someone to just insist on taking care of you — without you having to ask, because asking feels like losing. Your chart isn't telling you to need less. It's telling you no one can show up for a door you keep locked." },
  ],
  sampleLocked: "On your Venus–Neptune aspect — why you keep falling for someone's potential instead of the actual person in front of you, and how long you'll date an idea before you notice…",
  stayTitle: "Honestly? Some people will prefer Nebula.",
  stayBody: (
    <>
      If you actually want an <b>all-in-one daily spiritual hub</b> — tarot pulls, numerology, compatibility, a palmistry tab, and a live advisor a tap away — and
      you&apos;ll genuinely use it enough to justify a subscription, Nebula bundles all of that in one polished app. BluntChart isn&apos;t that; it&apos;s deliberately one thing.
      Choose BluntChart when you want a single deep, honest reading, at a price you can see, with zero chance of a surprise charge next month. If you go with Nebula,
      just set a reminder before any trial ends and cancel through your App Store settings, not by deleting the app.
    </>
  ),
  faqs: [
    { q: "What is the best Nebula alternative?", a: "BluntChart is the strongest Nebula alternative in 2026 for people who want one honest reading without a subscription trap. Nebula is an all-in-one bundle (astrology, tarot, numerology, live psychics) funded by auto-renewing subscriptions after a short free trial; BluntChart does one thing — a full, brutally honest natal chart reading — for a flat one-time $15, with no auto-renewal and nothing to cancel." },
    { q: "Will BluntChart auto-renew or charge me again like Nebula?", a: "No. BluntChart is a single one-time $15 charge. There's no free trial that converts to billing, no stored card set up to renew, and nothing to cancel. You pay once, get your reading, and that's the end of the transaction." },
    { q: "How is BluntChart different from Nebula?", a: "Nebula bundles astrology with tarot, numerology, palmistry and paid live psychic chats, and monetises through recurring subscriptions and credit packs. BluntChart does one focused thing: it interprets your full natal chart in about 1,500 plain-language, brutally honest words for a flat one-time $15 — no upsells, no add-ons, no subscription." },
    { q: "Is BluntChart's reading generic like some Nebula reviews describe?", a: "No. BluntChart interprets your full natal chart — planets, houses and aspects — in about 1,500 words written to your exact placements, not a generic sun-sign template. You can read two free preview insights before paying to judge the specificity for yourself." },
    { q: "Can I try it free before paying — without a card?", a: "Yes — and there's no card required, so there's nothing to accidentally start. Two free preview insights, no account. You only pay the flat one-time $15 for the full reading with all the deeper insights, your natal chart wheel and a shareable card." },
    { q: "Is this AI-generated? Will it feel robotic?", a: "It's generated with AI, but built specifically to interpret your exact chart like a brutally honest friend, not a horoscope app. The goal: you read it and think, \"how did it know that.\"" },
  ],
  founderBubbles: [
    <>I&apos;ll say the quiet part out loud: I built BluntChart partly because I got burned by apps like this. A three-day trial, a charge I didn&apos;t clock, and a cancel button I had to <b>hunt for</b>. Never again.</>,
    <>So there&apos;s no subscription here. No trial that flips to weekly billing, no card quietly stored to renew, nothing to cancel. You pay $15 once, you get your reading, we&apos;re done. That&apos;s the entire deal.</>,
    <>It also does one thing instead of twelve — no tarot tab, no palmistry, no upsell to a live psychic. Just your chart, read honestly. Two insights are free if you want to check the voice first.</>,
  ],
  trustBadges: [
    { icon: "🚫", title: "No auto-renewal", note: "Nothing renews, ever" },
    { icon: "💳", title: "No stored card", note: "We can't charge you twice" },
    { icon: "🔒", title: "Never sold", note: "Your birth data stays yours" },
    { icon: "🎁", title: "Free preview", note: "No account, no card" },
  ],
  ctaBandH2: <>Pay once. <em>Never think about it again.</em></>,
  ctaBandBody: "Two free insights, no card. The full reading is a flat $15 — no trial, no renewal, no surprise charge next month.",
};

export default function NebulaAlternativeClient() {
  return <AlternativePageShell data={data} />;
}
