"use client";

import { AlternativePageShell, type AlternativePageData } from "@/components/AlternativePageShell";

const data: AlternativePageData = {
  competitor: "Co-Star",
  competitorSlug: "co-star",
  competitorImage: "/co-star.png",
  competitorImageAlt: "Co-Star astrology app logo — the Co-Star alternative comparison on BluntChart",
  breadcrumb: "Co-Star Alternative",
  h1: <>The Co-Star alternative that actually explains <em>why you&apos;re like this.</em></>,
  subtitle: "Co-Star gives you a daily notification. BluntChart gives you the whole chart — read out loud, in plain language, with none of the parts other apps won't touch. One reading. One time. Fifteen dollars.",
  trustRow: [
    "<b>$15</b> one-time",
    "<b>No</b> subscription",
    "<b>~1,500 words</b> specific to your chart",
    "Free preview, no card",
  ],
  answerBox: (
    <p>
      If you want <strong>depth instead of a daily push notification</strong>, BluntChart is the strongest Co-Star alternative in 2026.
      It reads your <strong>full natal chart</strong> — planets, houses and aspects — and delivers ~1,500 words in plain language for a
      <strong> one-time $15</strong>, no subscription. Co-Star is still great for free daily horoscopes and comparing charts with friends.
      BluntChart is for the one honest, in-depth conversation with your chart that Co-Star was never built to give.
    </p>
  ),
  creditPros: [
    "Beautiful, minimalist design that made astrology feel aesthetic instead of cluttered.",
    "Real astronomical data (NASA-grade ephemeris) — the planet positions are accurate.",
    "Social features. Adding friends and comparing charts was the original viral hook.",
    "A genuinely capable free tier and that dry, screenshot-worthy notification voice.",
  ],
  creditCons: [
    "Surface-level readings. Even practicing astrologers note the daily text leans on Sun, Moon and Rising and rarely engages your whole chart.",
    "The paywall shift. A recurring Co-Star Plus subscription (reported around $15/month) now gates deeper readings and social depth that longtime users remember being free.",
    "Vague and sometimes gutting. Cryptic one-liners can read as ominous without ever explaining why — not ideal if you're anxious.",
    "Nothing you keep. It's a feed. There's no single deep reading you can save, re-read, and send to a friend.",
  ],
  comparisonLede: "Same accurate sky. Completely different job. One is a daily habit; the other is one honest reading you actually finish.",
  comparison: [
    { feature: "Pricing model", bluntchart: { text: "One-time $15, yours forever" }, competitor: { text: "Free tier + recurring subscription (Co-Star Plus)" } },
    { feature: "Reading depth", bluntchart: { text: "~1,500 words on your full chart", kind: "yes" }, competitor: { text: "Short daily lines, mostly Sun/Moon/Rising", kind: "lim" } },
    { feature: "Uses your whole natal chart", bluntchart: { text: "planets, houses & aspects", kind: "yes" }, competitor: { text: "Limited", kind: "lim" } },
    { feature: "Plain-language, no jargon", bluntchart: { text: "", kind: "yes" }, competitor: { text: "Cryptic by design", kind: "lim" } },
    { feature: "Explains why", bluntchart: { text: "", kind: "yes" }, competitor: { text: "Blunt, but rarely explains", kind: "lim" } },
    { feature: "Something you keep & re-read", bluntchart: { text: "emailed, plus share card", kind: "yes" }, competitor: { text: "it's a feed", kind: "no" } },
    { feature: "High-precision ephemeris", bluntchart: { text: "Astronomy Engine", kind: "yes" }, competitor: { text: "NASA data", kind: "yes" } },
    { feature: "Free preview before you pay", bluntchart: { text: "2 insights, no card", kind: "yes" }, competitor: { text: "free tier", kind: "yes" } },
    { feature: "Daily horoscope & friend charts", bluntchart: { text: "Not the point", kind: "lim" }, competitor: { text: "its strength", kind: "yes" } },
  ],
  comparisonFootnote: "App pricing and paywalls in this category change often; figures reflect widely reported pricing at time of writing. Check the App Store for Co-Star's current subscription price.",
  differenceH2: <>The parts other apps <em>won&apos;t touch.</em></>,
  differenceLede: "Generic readings tell you you're creative and sensitive. BluntChart tells you why you text back immediately and then resent yourself for it.",
  sampleH2: <>You&apos;ve read a thousand Co-Star notifications. Here&apos;s what a <em>whole reading</em> sounds like.</>,
  sampleLede: "Not a cryptic one-liner you screenshot and puzzle over. Real sentences, written to real placements, that sound like someone who actually knows you and isn't being polite about it. A genuine sample; your reading is written to your exact chart.",
  sampleExcerpts: [
    { placement: "On your Venus in Capricorn", text: "You don't fall fast — you audit. You've told yourself that's just standards. Half the time it's a security system. You'd rather stay in control than be the one who cares more, so you pick people you can manage, then quietly resent them for being manageable. The wall you built to stay safe is the reason you're lonely." },
    { placement: "On your Moon in Aquarius", text: "You process feelings by explaining them, which looks like maturity and is often just distance. You'll hand a friend three paragraphs of insight and give yourself none. You don't need more perspective. You need to feel the thing before you file it away." },
  ],
  sampleLocked: "On your Mars in the 10th house — the reason your ambition and your anger run on the same wire, and why the thing you keep avoiding at work isn't really about work at all…",
  stayTitle: "Honestly? Some people should stay on Co-Star.",
  stayBody: (
    <>
      If what you love is the <b>daily ritual</b> — the little notification, the widget, comparing charts with friends, a free feed you check with your morning coffee — Co-Star does that better than anyone,
      and BluntChart isn&apos;t trying to replace it. Switch to BluntChart when you&apos;re done with vague and you want <em>one</em> reading that actually explains the pattern you keep living out.
      Plenty of people keep both: Co-Star for the habit, BluntChart for the reckoning.
    </>
  ),
  faqs: [
    { q: "What is the best Co-Star alternative?", a: "If you want depth rather than a daily notification, BluntChart is the strongest Co-Star alternative in 2026. It reads your full natal chart and delivers around 1,500 words of plain-language interpretation for a one-time $15, with no subscription. Co-Star stays best for free daily horoscopes and comparing charts with friends." },
    { q: "Is BluntChart a subscription like Co-Star Plus?", a: "No. BluntChart is a one-time $15 purchase. You pay once, your reading is emailed to you, and it's yours forever. No recurring charge, no Plus tier, no trap." },
    { q: "Is BluntChart more accurate than Co-Star?", a: "Both use high-precision astronomical data for planet positions, so the raw chart is equally accurate. The difference is interpretation. Co-Star's daily readings focus mainly on Sun, Moon and Rising in short bursts; BluntChart interprets your whole chart — planets, houses and aspects — in one long, specific reading." },
    { q: "Do I need my exact birth time?", a: "Your exact birth time sets your Rising sign and all 12 houses, which is what makes a reading feel personal instead of generic. It's usually on your birth certificate. If you genuinely can't find it, you can still get a reading — we'll note where it may be less precise." },
    { q: "Can I try it free before paying the $15?", a: "Yes. You get two free preview insights with no account and no card. You only pay the one-time $15 if you want the full reading with all the deeper insights, your natal chart wheel and a shareable card." },
    { q: "Is this AI-generated? Will it feel robotic?", a: "It's generated with AI, but the system was built specifically to interpret your exact chart in a way that sounds like a brutally honest friend, not a horoscope app. The goal is simple: you read it and think, \"how did it know that.\"" },
  ],
  founderBubbles: [
    <>I&apos;ll be straight with you — feels on-brand. I used Co-Star for years and genuinely loved the design. But I got tired of a notification telling me something ominous at 9am and then just… leaving. No <b>why</b>. Nothing to actually do with it.</>,
    <>So BluntChart is the opposite of a notification. One long, honest reading that <b>explains</b> the pattern instead of hinting at it — and it&apos;s $15 once, because I was done paying every month to feel vaguely unsettled.</>,
    <>If it doesn&apos;t read you, keep your money. The preview&apos;s free, there&apos;s no card, and I&apos;m not going to email you into oblivion. That&apos;s the whole pitch.</>,
  ],
  trustBadges: [
    { icon: "🔒", title: "Never sold", note: "Your birth data stays yours" },
    { icon: "⚡", title: "Instant", note: "Emailed the moment you pay" },
    { icon: "✍️", title: "Your exact chart", note: "Not a sun-sign template" },
    { icon: "🎁", title: "Free preview", note: "No account, no card" },
  ],
  ctaBandH2: <>Your chart already knows. <em>Time you did too.</em></>,
  ctaBandBody: "Two free insights, no account, no card. If it reads you the way beta testers said it did, the full thing is $15 — once.",
};

export default function CoStarAlternativeClient() {
  return <AlternativePageShell data={data} />;
}
