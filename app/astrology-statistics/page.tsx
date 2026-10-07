import type { Metadata } from "next";
import Link from "next/link";

// ─── SEO METADATA ──────────────────────────────────────────────────────────────

const PAGE_URL = "https://bluntchart.com/astrology-statistics";
const UPDATED_ISO = "2026-09-29";
const UPDATED_LABEL = "September 29, 2026";

export const metadata: Metadata = {
  title: "Astrology Statistics 2026: 50+ Facts, Trends & Market Data | BluntChart",
  description:
    "50+ sourced astrology statistics for 2026: belief rates (Pew, YouGov), market size, the most common zodiac signs from 62M US births, astrology app data, and Reddit growth. Every stat cited.",
  keywords: [
    "astrology statistics",
    "astrology statistics 2026",
    "astrology facts",
    "how many people believe in astrology",
    "astrology market size",
    "astrology app market",
    "most common zodiac sign",
    "astrology belief by age",
    "astrology demographics",
    "percentage of americans who believe in astrology",
    "astrology industry statistics",
    "horoscope statistics",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Astrology Statistics 2026: 50+ Facts, Trends & Market Data",
    description:
      "Belief rates, market size, most common zodiac signs, and astrology app data — every number sourced from Pew, YouGov, Ipsos, NSF, SSA birth records and more.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology Statistics 2026: 50+ Sourced Facts",
    description:
      "27% of US adults believe in astrology. 43% of women 18–49 do. Cancer is the most common US zodiac sign. All the data, all the sources.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ─── SOURCES ───────────────────────────────────────────────────────────────────
// Every stat on the page references one of these by key.

type SourceKey = keyof typeof SOURCES;

const SOURCES = {
  pew2025: {
    name: "Pew Research Center, “3 in 10 Americans consult astrology, tarot cards or fortune tellers” (May 21, 2025). Survey of 9,593 US adults, Oct 21–27, 2024.",
    short: "Pew Research Center, 2025",
    url: "https://www.pewresearch.org/religion/2025/05/21/3-in-10-americans-consult-astrology-tarot-cards-or-fortune-tellers/",
  },
  pewGlobal: {
    name: "Pew Research Center, “Spells, curses and ways to see the future: Beliefs & practices in 35 countries” (May 6, 2025).",
    short: "Pew Research Center, 35-country survey, 2025",
    url: "https://www.pewresearch.org/religion/2025/05/06/spells-curses-and-ways-to-see-the-future/",
  },
  yougov2022: {
    name: "YouGov, “One in four Americans say they believe in astrology” (April 2022). Survey of 3,472 US adults, April 21–22, 2022.",
    short: "YouGov, 2022",
    url: "https://yougov.com/en-us/articles/42292-one-four-americans-say-they-believe-astrology",
  },
  ipsos2019: {
    name: "Ipsos, “Divides among public opinion on astrology and horoscopes” (2019). Survey of 1,005 US adults, Nov 26–27, 2019.",
    short: "Ipsos, 2019",
    url: "https://www.ipsos.com/en-us/news-polls/astrology-horoscopes",
  },
  nsf2018: {
    name: "National Science Board, Science & Engineering Indicators 2018, Ch. 7: Public Knowledge About S&T (General Social Survey data, 2016).",
    short: "NSF Science & Engineering Indicators, 2018",
    url: "https://ncses.nsf.gov/statistics/2018/nsb20181/report/sections/science-and-technology-public-attitudes-and-understanding/public-knowledge-about-s-t",
  },
  mrfr: {
    name: "Market Research Future, “Astrology Market Size, Share, Growth and Trends Forecast 2035.”",
    short: "Market Research Future",
    url: "https://www.marketresearchfuture.com/reports/astrology-market-22040",
  },
  tbrc: {
    name: "The Business Research Company via Research and Markets, “Astrology App Market Report 2026” (Feb 2026).",
    short: "The Business Research Company, 2026",
    url: "https://www.researchandmarkets.com/reports/6090017/astrology-app-market-report",
  },
  markntel: {
    name: "MarkNtel Advisors, “Astrology App Market: Size, Share, and Growth Report.”",
    short: "MarkNtel Advisors",
    url: "https://www.marknteladvisors.com/research-library/astrology-app-market.html",
  },
  ibis: {
    name: "IBISWorld, “Psychic Services in the US – Market Size Statistics” (2025).",
    short: "IBISWorld, 2025",
    url: "https://www.ibisworld.com/united-states/market-size/psychic-services/4413/",
  },
  astrotalk: {
    name: "BW Disrupt, “Astrotalk revenue jumps 85% to Rs 1,214 Cr” (FY25 results).",
    short: "BW Disrupt, 2025",
    url: "https://www.bwdisrupt.com/article/astrotalk-revenue-jumps-85-to-rs-1-214-cr-591016",
  },
  ssa: {
    name: "US Social Security Administration daily birth counts 2000–2014 (62,187,024 births), published by FiveThirtyEight. Zodiac aggregation by BluntChart using standard tropical sign dates.",
    short: "SSA births 2000–2014 via FiveThirtyEight; BluntChart analysis",
    url: "https://github.com/fivethirtyeight/data/tree/master/births",
  },
  appstore: {
    name: "Apple App Store (US) public listings for Co–Star, CHANI, Nebula and The Pattern, accessed September 2026.",
    short: "Apple App Store, Sept 2026",
    url: "https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561",
  },
  techcrunch2019: {
    name: "TechCrunch, “Co-Star raises $5 million to bring its astrology app to Android” (April 17, 2019).",
    short: "TechCrunch, 2019",
    url: "https://techcrunch.com/2019/04/17/co-star-astrology-app-seed-round/",
  },
  axios2021: {
    name: "Axios, “Astrology app Co-Star raises $15 million in new funding” (April 14, 2021).",
    short: "Axios, 2021",
    url: "https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding",
  },
  statista2026: {
    name: "Statista (data: AppMagic), “Leading horoscope and astrology apps in the United States as of 1st quarter 2026, by revenue” (June 2026).",
    short: "Statista / AppMagic, 2026",
    url: "https://www.statista.com/statistics/1451664/top-horoscope-apps-us-market-revenue/",
  },
  redditlist: {
    name: "RedditList, r/astrology subscriber statistics (September 2026).",
    short: "RedditList, Sept 2026",
    url: "https://redditli.st/subreddit/astrology",
  },
} as const;

// ─── DATA ──────────────────────────────────────────────────────────────────────

type Stat = { value: string; label: string; source: SourceKey };

const KEY_STATS: Stat[] = [
  { value: "27%", label: "of US adults say they believe in astrology", source: "pew2025" },
  { value: "30%", label: "consult astrology, tarot or a fortune teller at least once a year", source: "pew2025" },
  { value: "88%", label: "of Americans know their zodiac sign", source: "ipsos2019" },
  { value: "$15.16B", label: "estimated global astrology market size in 2025", source: "mrfr" },
  { value: "9.00%", label: "of US births fall under Cancer — the most common sign", source: "ssa" },
  { value: "2.1M", label: "members in Reddit’s r/astrology community", source: "redditlist" },
];

const BELIEF_STATS: Stat[] = [
  { value: "27%", label: "of US adults say they believe in astrology (Oct 2024 survey)", source: "pew2025" },
  { value: "29%", label: "said the same when Pew asked an identical question in 2017 — no significant change", source: "pew2025" },
  { value: "28%", label: "consult astrology or a horoscope at least once or twice a year", source: "pew2025" },
  { value: "~1 in 10", label: "Americans consult tarot cards at least annually", source: "pew2025" },
  { value: "6%", label: "consult a fortune teller at least once or twice a year", source: "pew2025" },
  { value: "20%", label: "engage in astrology, tarot or fortune telling mostly “just for fun”", source: "pew2025" },
  { value: "1%", label: "rely “a lot” on these practices when making major life decisions", source: "pew2025" },
  { value: "27% / 51% / 22%", label: "believe / don’t believe / unsure about astrology (YouGov)", source: "yougov2022" },
];

const DEMO_ROWS: { group: string; value: string; metric: string; source: SourceKey }[] = [
  { group: "Women, all ages", value: "37%", metric: "consult astrology/horoscope at least yearly", source: "pew2025" },
  { group: "Women, ages 18–49", value: "46%", metric: "consult astrology/horoscope at least yearly", source: "pew2025" },
  { group: "Women, ages 18–49", value: "43%", metric: "believe in astrology", source: "pew2025" },
  { group: "LGBT adults", value: "54%", metric: "consult astrology/horoscope at least yearly", source: "pew2025" },
  { group: "Adults under 30", value: "37%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Adults 65+", value: "16%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Women", value: "30%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Men", value: "25%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Hispanic Americans", value: "32%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Black Americans", value: "31%", metric: "believe in astrology", source: "yougov2022" },
  { group: "White Americans", value: "25%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Catholics", value: "31%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Protestants", value: "22%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Atheists", value: "10%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Adults under 30", value: "14%", metric: "consult a fortune teller (vs 2% of 65+)", source: "pew2025" },
];

// Computed from SSA daily births 2000–2014 using standard tropical sign dates.
const ZODIAC_BIRTHS = [
  { sign: "Cancer", symbol: "♋", dates: "Jun 21 – Jul 22", births: 5595033, share: 9.0, perDay: 11656 },
  { sign: "Virgo", symbol: "♍", dates: "Aug 23 – Sep 22", births: 5574916, share: 8.96, perDay: 11989 },
  { sign: "Leo", symbol: "♌", dates: "Jul 23 – Aug 22", births: 5521329, share: 8.88, perDay: 11874 },
  { sign: "Gemini", symbol: "♊", dates: "May 21 – Jun 20", births: 5267980, share: 8.47, perDay: 11329 },
  { sign: "Libra", symbol: "♎", dates: "Sep 23 – Oct 22", births: 5228627, share: 8.41, perDay: 11619 },
  { sign: "Taurus", symbol: "♉", dates: "Apr 20 – May 20", births: 5161756, share: 8.3, perDay: 11101 },
  { sign: "Scorpio", symbol: "♏", dates: "Oct 23 – Nov 21", births: 5114444, share: 8.22, perDay: 11365 },
  { sign: "Pisces", symbol: "♓", dates: "Feb 19 – Mar 20", births: 5051808, share: 8.12, perDay: 11127 },
  { sign: "Sagittarius", symbol: "♐", dates: "Nov 22 – Dec 21", births: 5023366, share: 8.08, perDay: 11163 },
  { sign: "Aquarius", symbol: "♒", dates: "Jan 20 – Feb 18", births: 5001409, share: 8.04, perDay: 11114 },
  { sign: "Aries", symbol: "♈", dates: "Mar 21 – Apr 19", births: 4983157, share: 8.01, perDay: 11074 },
  { sign: "Capricorn", symbol: "♑", dates: "Dec 22 – Jan 19", births: 4663199, share: 7.5, perDay: 10720 },
];
const MAX_SHARE = 9.0;

const MARKET_STATS: Stat[] = [
  { value: "$14.3B", label: "estimated global astrology market size in 2024", source: "mrfr" },
  { value: "$27.15B", label: "projected global astrology market by 2035 (6.0% CAGR, 2025–2035)", source: "mrfr" },
  { value: "~45%", label: "of global astrology market share held by North America", source: "mrfr" },
  { value: "$8.58B", label: "online astrology services segment in 2024 — the largest mode", source: "mrfr" },
  { value: "$4.73B → $5.69B", label: "astrology app market, 2025 to 2026 (20.2% growth)", source: "tbrc" },
  { value: "$11.71B", label: "projected astrology app market by 2030 (19.8% CAGR)", source: "tbrc" },
  { value: "$7.11B", label: "alternative 2025 astrology app market estimate, projected to $13.48B by 2032", source: "markntel" },
  { value: "$2.3B", label: "US psychic services industry revenue in 2025 (includes astrology, tarot, mediumship)", source: "ibis" },
  { value: "5.5%", label: "annual growth rate of US psychic services, 2020–2025", source: "ibis" },
  { value: "₹1,214 Cr", label: "Astrotalk (India) FY25 revenue, up 85% year over year", source: "astrotalk" },
];

const APPS = [
  { app: "Co–Star", rating: "4.8", ratings: "206K", price: "Pro-Star $8.99/mo", note: "Founded 2017; $5.2M seed (2019), $15M Series A (2021)" },
  { app: "CHANI", rating: "4.9", ratings: "59K", price: "$11.99/mo · $107.99/yr", note: "Editors’ Choice; not VC-funded" },
  { app: "Nebula", rating: "4.6", ratings: "171K", price: "$2.99–$49.99/mo tiers", note: "Includes paid live chat with advisors" },
  { app: "The Pattern", rating: "4.0", ratings: "15K", price: "$14.99/mo · $83.99/yr", note: "Relationship & timing focus" },
];

const APP_STATS: Stat[] = [
  { value: "20M+", label: "Co–Star downloads as of April 2021", source: "axios2021" },
  { value: "1 in 4", label: "US women ages 18–25 had downloaded Co–Star by April 2021, per the company", source: "axios2021" },
  { value: "$5.2M", label: "Co–Star seed round (2019), after $750K pre-seed", source: "techcrunch2019" },
  { value: "$15M", label: "Co–Star Series A led by Spark Capital (2021)", source: "axios2021" },
  { value: "Top 2", label: "CHANI and Co–Star named as leading US astrology apps by revenue, Q1 2026", source: "statista2026" },
  { value: "$3.5M+", label: "donated by CHANI to survivors of gender-based violence (5% of revenue)", source: "appstore" },
];

const SOCIAL_STATS: Stat[] = [
  { value: "2,102,160", label: "r/astrology subscribers as of September 2026", source: "redditlist" },
  { value: "Feb 2025", label: "month r/astrology passed 2 million subscribers", source: "redditlist" },
  { value: "+75,159", label: "r/astrology’s biggest single month of growth (January 2025)", source: "redditlist" },
  { value: "~147/day", label: "average new r/astrology subscribers over the last 30 days", source: "redditlist" },
];

const SCIENCE_STATS: Stat[] = [
  { value: "60%", label: "of Americans said astrology is “not at all scientific” in 2016", source: "nsf2018" },
  { value: "29% + 8%", label: "called astrology “sort of” or “very” scientific (2016)", source: "nsf2018" },
  { value: "50% – 66%", label: "historical range of “not at all scientific” answers, 1979–2004", source: "nsf2018" },
  { value: "54%", label: "of 18–24-year-olds rejected astrology as unscientific — lowest of any age group", source: "nsf2018" },
  { value: "76% vs 57%", label: "bachelor’s degree holders vs high-school graduates calling astrology unscientific", source: "nsf2018" },
];

const HOROSCOPE_STATS: Stat[] = [
  { value: "53%", label: "of people who know their sign say they identify with it", source: "ipsos2019" },
  { value: "5%", label: "of Americans check their horoscope often (about 1 in 20)", source: "ipsos2019" },
  { value: "31%", label: "of 18–34-year-olds turn to horoscopes to understand their life (vs 11% of 55+)", source: "ipsos2019" },
  { value: "32%", label: "of horoscope users use them to evaluate relationship compatibility", source: "ipsos2019" },
  { value: "90%", label: "of Americans could name their astrological sign when asked", source: "yougov2022" },
];

const GLOBAL_STATS: Stat[] = [
  { value: "47%", label: "of adults in South Africa consult a fortune teller or horoscope to see the future — highest of 35 countries", source: "pewGlobal" },
  { value: "45%", label: "of adults in India do the same", source: "pewGlobal" },
  { value: "4%", label: "in Greece — the lowest of the 35 countries surveyed", source: "pewGlobal" },
  { value: "~9%", label: "of US adults on the same cross-national question", source: "pewGlobal" },
];

const FAQS = [
  {
    q: "What percentage of Americans believe in astrology?",
    a: "27% of US adults say they believe in astrology, according to a Pew Research Center survey of 9,593 adults conducted in October 2024 and published in May 2025. That is statistically unchanged from 29% in 2017. A separate 2022 YouGov poll also found 27%, with 51% saying they don’t believe and 22% unsure.",
  },
  {
    q: "Who is most likely to believe in astrology?",
    a: "Younger women and LGBT adults. Pew found 43% of women ages 18–49 believe in astrology, and 54% of LGBT adults consult astrology or a horoscope at least once a year. YouGov found belief falls from 37% among adults under 30 to 16% among adults 65 and older.",
  },
  {
    q: "How big is the astrology market?",
    a: "Market Research Future estimates the global astrology market at $15.16 billion in 2025, growing to $27.15 billion by 2035 (6.0% CAGR). The Business Research Company sizes the astrology app segment alone at $5.69 billion in 2026, projected to reach $11.71 billion by 2030. Estimates vary widely between firms because they define the market differently.",
  },
  {
    q: "What is the most common zodiac sign?",
    a: "Cancer. In a BluntChart analysis of 62.2 million US births from 2000–2014 (Social Security Administration data published by FiveThirtyEight), 9.00% of births fell under Cancer, followed by Virgo (8.96%) and Leo (8.88%). Capricorn was the least common at 7.50%. Adjusted for the number of days in each sign, Virgo has the highest births per day.",
  },
  {
    q: "What is the rarest zodiac sign?",
    a: "Capricorn, at 7.50% of US births in 2000–2014 SSA data. Capricorn season includes Christmas and New Year’s, which are among the least common birthdays in the US, largely because fewer scheduled deliveries happen on holidays.",
  },
  {
    q: "Do people make decisions based on astrology?",
    a: "Rarely. Pew found only 1% of US adults rely a lot on astrology, tarot or fortune tellers when making major life decisions. 20% say they engage in these practices mostly just for fun.",
  },
  {
    q: "How many people use astrology apps?",
    a: "Co–Star reported more than 20 million downloads by April 2021 and said a quarter of US women ages 18–25 had downloaded it (Axios). On the US App Store in September 2026, Co–Star had 206K ratings, Nebula 171K, CHANI 59K and The Pattern 15K.",
  },
  {
    q: "Do Americans think astrology is a science?",
    a: "Most don’t. In 2016, 60% of Americans said astrology is “not at all scientific,” 29% said “sort of scientific,” and 8% said “very scientific” (NSF Science & Engineering Indicators 2018). Adults aged 18–24 were the least likely to reject it (54%).",
  },
];

// ─── JSON-LD STRUCTURED DATA ───────────────────────────────────────────────────

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Astrology Statistics 2026: 50+ Facts, Trends & Market Data",
  description:
    "Sourced astrology statistics covering belief rates, demographics, market size, zodiac sign birth frequencies, astrology apps and online communities.",
  author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
  publisher: {
    "@type": "Organization",
    name: "BluntChart",
    url: "https://bluntchart.com",
    logo: { "@type": "ImageObject", url: "https://bluntchart.com/mascot.png" },
  },
  datePublished: `${UPDATED_ISO}T00:00:00+00:00`,
  dateModified: `${UPDATED_ISO}T00:00:00+00:00`,
  mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
  citation: Object.values(SOURCES).map((s) => s.url),
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Astrology Statistics", item: PAGE_URL },
  ],
};

const jsonLdDataset = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "US births by zodiac sign, 2000–2014",
  description:
    "Share of 62,187,024 US births (Social Security Administration, 2000–2014) falling under each tropical zodiac sign, aggregated by BluntChart.",
  url: `${PAGE_URL}#zodiac-births`,
  creator: { "@type": "Organization", name: "BluntChart" },
  isBasedOn: SOURCES.ssa.url,
  temporalCoverage: "2000/2014",
  spatialCoverage: "United States",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function Cite({ source }: { source: SourceKey }) {
  const s = SOURCES[source];
  return (
    <a className="cite" href={s.url} target="_blank" rel="noopener noreferrer">
      {s.short}
    </a>
  );
}

function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div className="stat" key={s.value + s.label}>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
          <div className="stat-src">
            Source: <Cite source={s.source} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function AstrologyStatisticsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#12121e;
          --border:rgba(255,255,255,0.08);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1100px;margin:0 auto;padding:0 32px}

        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nav-i{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nav-links{display:flex;align-items:center;gap:20px}
        .nav-links a{font-size:.82rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nav-links a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}

        .breadcrumb{padding:88px 0 0;font-size:.82rem;color:var(--dim)}
        .breadcrumb a{color:var(--dim);text-decoration:none}
        .breadcrumb a:hover{color:var(--gold)}

        .hero{padding:28px 0 40px;position:relative}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,.06)}
        .hero h1{font-family:var(--font-display);font-size:clamp(2.1rem,5vw,3.5rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;margin-bottom:18px}
        .hero h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:1.05rem;color:var(--dim);max-width:760px;line-height:1.72;margin-bottom:24px}
        .updated{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:.85rem;color:var(--white);background:rgba(93,202,165,.07);border:1px solid rgba(93,202,165,.25);border-radius:10px;padding:10px 16px}
        .updated strong{color:var(--teal)}

        .toc{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:22px 24px;margin:8px 0 48px}
        .toc-title{font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
        .toc ol{columns:2;column-gap:32px;padding-left:18px;font-size:.9rem}
        .toc li{margin-bottom:6px;color:var(--dim)}
        .toc a{color:var(--dim);text-decoration:none}
        .toc a:hover{color:var(--white)}

        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82;max-width:860px}
        .prose p{margin-bottom:20px}
        .prose strong{color:var(--white);font-weight:600}
        .prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3)}
        .prose a.bp{color:#fff;text-decoration:none}
        h2.sec{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-.01em;margin:64px 0 16px;color:var(--white);scroll-margin-top:90px}
        h2.sec em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        h3.sub{font-family:var(--font-display);font-size:1.15rem;font-weight:700;margin:32px 0 12px;color:var(--white)}

        .stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin:24px 0 32px}
        .stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px 18px;display:flex;flex-direction:column;gap:8px;position:relative;overflow:hidden}
        .stat::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--purple),var(--rose));opacity:.6}
        .stat-value{font-family:var(--font-display);font-size:1.9rem;font-weight:900;line-height:1.1;color:var(--gold)}
        .stat-label{font-size:.9rem;color:var(--white);line-height:1.5;flex:1}
        .stat-src{font-size:.74rem;color:var(--dim)}
        .cite{color:var(--dim);text-decoration:underline;text-decoration-color:rgba(232,228,240,.25)}
        .cite:hover{color:var(--gold)}

        .key-box{background:linear-gradient(165deg,rgba(12,10,22,0.95),rgba(18,12,32,0.88));border:1px solid rgba(107,47,212,.25);border-radius:18px;padding:28px;margin-bottom:24px}
        .key-box h2{font-family:var(--font-display);font-size:1.2rem;color:var(--gold);margin-bottom:4px}
        .key-box .stat-grid{margin-bottom:0}

        .tbl-wrap{overflow-x:auto;margin:20px 0 12px;-webkit-overflow-scrolling:touch}
        table.tbl{width:100%;border-collapse:collapse;min-width:560px}
        .tbl th{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);padding:12px;text-align:left;border-bottom:1px solid var(--border);white-space:nowrap}
        .tbl td{padding:12px;font-size:.88rem;color:rgba(232,228,240,0.75);border-bottom:0.5px solid rgba(255,255,255,.05);vertical-align:middle}
        .tbl td.strong{color:var(--white);font-weight:600}
        .tbl td.num{font-family:var(--font-display);font-weight:700;color:var(--gold);white-space:nowrap}
        .bar{height:8px;border-radius:4px;background:linear-gradient(90deg,var(--purple),var(--rose));min-width:4px}
        .tbl-note{font-size:.8rem;color:var(--dim);margin-bottom:28px;line-height:1.6}

        .pending{border:1px dashed rgba(240,184,74,.35);border-radius:14px;padding:18px 20px;margin:20px 0 28px;font-size:.9rem;color:var(--dim);line-height:1.7}
        .pending strong{color:var(--gold)}

        .cta-section{background:linear-gradient(165deg,rgba(107,47,212,.06),rgba(212,83,126,.04));border:1px solid rgba(107,47,212,.2);border-radius:20px;padding:40px 32px;text-align:center;margin:56px 0}
        .cta-section h2{font-family:var(--font-display);font-size:clamp(1.4rem,3vw,1.9rem);font-weight:800;margin-bottom:12px;color:var(--white)}
        .cta-section p{font-size:1rem;color:var(--dim);max-width:620px;margin:0 auto 24px;line-height:1.72}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border-radius:10px;transition:opacity .2s}
        .bp:hover{opacity:.88}

        .faq{margin:20px 0 32px}
        .faq details{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 20px;margin-bottom:10px}
        .faq summary{cursor:pointer;font-weight:600;color:var(--white);font-size:.98rem;list-style:none}
        .faq summary::-webkit-details-marker{display:none}
        .faq summary::before{content:'+';color:var(--gold);margin-right:10px;font-weight:700}
        .faq details[open] summary::before{content:'–'}
        .faq details p{margin-top:12px;font-size:.92rem;color:rgba(232,228,240,0.72);line-height:1.75}

        .sources ol{padding-left:22px;font-size:.86rem;color:var(--dim);line-height:1.7}
        .sources li{margin-bottom:10px}
        .sources a{color:var(--gold);word-break:break-word}
        .cite-box{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:12px;padding:16px 18px;font-size:.85rem;color:var(--dim);margin:16px 0 28px;line-height:1.6}
        .cite-box code{color:var(--white);font-family:ui-monospace,Consolas,monospace;font-size:.82rem}

        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin:24px 0 40px}
        .related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}
        .related-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}
        .related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}
        .last-updated{font-size:.78rem;color:rgba(232,228,240,.3);margin:48px 0 64px;text-align:center}

        @media(max-width:768px){
          .nav-links{display:none}
          .c{padding:0 16px}
          .toc ol{columns:1}
          .key-box{padding:20px 16px}
          .cta-section{padding:32px 18px}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="c nav-i">
          <Link className="logo" href="/">
            <img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="nav-links">
            <Link href="/#try-it">Get Reading</Link>
            <a href="/free-birth-chart">Free Chart</a>
            <Link className="ncta" href="/#try-it">Full Reading $15</Link>
          </div>
        </div>
      </nav>

      <div className="c">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">BluntChart</Link> <span style={{ margin: "0 8px", opacity: 0.4 }}>/</span>{" "}
          <span style={{ color: "var(--white)" }}>Astrology Statistics</span>
        </nav>
      </div>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="c">
          <div className="eyebrow">📊 Data hub · Updated for 2026</div>
          <h1>
            Astrology Statistics 2026:
            <br />
            <em>50+ Facts, Trends &amp; Market Data</em>
          </h1>
          <p className="hero-sub">
            How many people believe in astrology, who they are, how much money the industry makes,
            and which zodiac sign is actually the most common. Every number below links to its
            original source — survey firms, government data, market researchers and public app store
            listings. No invented figures. Where good data doesn&apos;t exist yet, we say so.
          </p>
          <div className="updated">
            <strong>Last updated:</strong>
            <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{Object.keys(SOURCES).length} primary sources</span>
          </div>
        </div>
      </header>

      <main>
        <div className="c">
          {/* ── KEY STATS ── */}
          <section className="key-box" aria-labelledby="key-stats">
            <h2 id="key-stats">Key astrology statistics at a glance</h2>
            <StatGrid stats={KEY_STATS} />
          </section>

          {/* ── TOC ── */}
          <nav className="toc" aria-label="Contents">
            <div className="toc-title">On this page</div>
            <ol>
              <li><a href="#belief">How many people believe in astrology</a></li>
              <li><a href="#demographics">Astrology belief by demographic</a></li>
              <li><a href="#zodiac-births">Most common zodiac signs (US births)</a></li>
              <li><a href="#market">Astrology market size &amp; growth</a></li>
              <li><a href="#apps">Astrology app statistics</a></li>
              <li><a href="#horoscopes">Zodiac sign &amp; horoscope habits</a></li>
              <li><a href="#social">Social media &amp; online communities</a></li>
              <li><a href="#search">Search trends</a></li>
              <li><a href="#science">Is astrology seen as scientific?</a></li>
              <li><a href="#global">Astrology around the world</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#sources">Methodology &amp; sources</a></li>
            </ol>
          </nav>

          {/* ── BELIEF ── */}
          <section className="prose">
            <h2 className="sec" id="belief">
              How many people <em>believe in astrology?</em>
            </h2>
            <p>
              The most rigorous recent measure comes from Pew Research Center, which surveyed 9,593 US
              adults in October 2024 through its American Trends Panel.{" "}
              <strong>27% of Americans say they believe in astrology</strong> — statistically unchanged
              from 29% in 2017. Despite the explosion of astrology apps and TikTok content since then,
              the share of believers has held steady. What has changed is how visible that group is.
            </p>
            <p>
              Belief and use aren&apos;t the same thing. Slightly more people (28%) consult astrology or a
              horoscope at least once a year than say they believe in it, and most of that engagement is
              casual: only 1% of US adults say they rely &ldquo;a lot&rdquo; on astrology, tarot or
              fortune tellers when making major decisions (<Cite source="pew2025" />).
            </p>
          </section>
          <StatGrid stats={BELIEF_STATS} />

          {/* ── DEMOGRAPHICS ── */}
          <section className="prose">
            <h2 className="sec" id="demographics">
              Astrology belief <em>by demographic</em>
            </h2>
            <p>
              The single biggest predictor of astrology engagement is gender, followed closely by age.
              Pew found that <strong>43% of women ages 18–49 believe in astrology</strong>, and 46% of
              that group consult astrology or a horoscope at least once a year. LGBT adults are the most
              engaged group Pew measured: 54% consult astrology annually (<Cite source="pew2025" />).
            </p>
            <p>
              YouGov&apos;s 2022 poll shows the same age gradient: belief more than halves between adults
              under 30 (37%) and adults 65+ (16%). Religion matters less than you might expect — Catholics
              (31%) were more likely to believe than the general population, while atheists (10%) were
              the least likely of any group (<Cite source="yougov2022" />).
            </p>
          </section>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Share</th>
                  <th>Measure</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ROWS.map((r) => (
                  <tr key={r.group + r.metric + r.source}>
                    <td className="strong">{r.group}</td>
                    <td className="num">{r.value}</td>
                    <td>{r.metric}</td>
                    <td><Cite source={r.source} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Pew and YouGov use different question wording and sample designs; compare figures within a
            source rather than across sources.
          </p>

          {/* ── ZODIAC BIRTHS ── */}
          <section className="prose">
            <h2 className="sec" id="zodiac-births">
              What is the most common zodiac sign? <em>62 million US births, analysed</em>
            </h2>
            <p>
              Most &ldquo;most common zodiac sign&rdquo; lists online are guesses. We calculated it
              directly from the Social Security Administration&apos;s daily birth counts for 2000–2014
              — <strong>62,187,024 US births</strong> — as published by FiveThirtyEight, assigning each
              day to its standard tropical sun sign (<Cite source="ssa" />).
            </p>
            <p>
              <strong>Cancer is the most common sun sign in the US at 9.00% of births</strong>, followed
              closely by Virgo (8.96%) and Leo (8.88%). That tracks the well-known late-summer birth peak:
              August (8.91%), July (8.76%) and September (8.68%) were the three busiest birth months in
              the same data. <strong>Capricorn is the rarest sign at 7.50%</strong>, partly because its
              season contains Christmas Day and New Year&apos;s Day, the two least common birthdays of the
              year.
            </p>
            <p>
              Sign lengths differ by a day or two, so we also report average births per day. On that
              measure, <strong>Virgo is the most common</strong> (11,989 births per day), and the single
              most common birthdays in the dataset — September 12, 19 and 20 — all fall in Virgo season.
              Want to know which sign <em>you</em> actually are across all your placements? Try the{" "}
              <a href="/big-three-calculator">Big Three calculator</a>.
            </p>
          </section>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sign</th>
                  <th>Dates</th>
                  <th>US births</th>
                  <th>Share</th>
                  <th style={{ width: "22%" }}></th>
                  <th>Births/day</th>
                </tr>
              </thead>
              <tbody>
                {ZODIAC_BIRTHS.map((z, i) => (
                  <tr key={z.sign}>
                    <td>{i + 1}</td>
                    <td className="strong">
                      <span style={{ opacity: 0.6, marginRight: 6 }}>{z.symbol}</span>
                      <a href={`/sun-in-${z.sign.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {z.sign}
                      </a>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{z.dates}</td>
                    <td>{z.births.toLocaleString("en-US")}</td>
                    <td className="num">{z.share.toFixed(2)}%</td>
                    <td>
                      <div className="bar" style={{ width: `${((z.share - 7) / (MAX_SHARE - 7)) * 100}%` }} />
                    </td>
                    <td>{z.perDay.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Source: SSA daily births 2000–2014 via FiveThirtyEight; zodiac aggregation by BluntChart.
            Bar scale starts at 7% to make differences visible. Sign boundaries use conventional dates;
            actual cusp dates shift by up to a day year to year. Using the Sun&apos;s exact ingress times
            instead, Leo, Virgo and Cancer are nearly tied, with Leo slightly ahead; see our{" "}
            <a href="/birth-chart-statistics#sun" style={{ color: "var(--gold)" }}>birth chart statistics</a>.
            Free to cite with a link to this page.
          </p>

          {/* ── MARKET ── */}
          <section className="prose">
            <h2 className="sec" id="market">
              Astrology market size <em>&amp; growth</em>
            </h2>
            <p>
              Market-size estimates for astrology vary a lot, mostly because research firms draw the
              boundary differently: some count only apps, some include live readings, some include
              psychic services broadly. Treat any single number as an estimate and cite the firm that
              produced it.
            </p>
            <p>
              Market Research Future puts the <strong>global astrology market at $15.16 billion in 2025</strong>,
              growing at 6.0% a year to $27.15 billion by 2035, with North America holding about 45% of
              global share (<Cite source="mrfr" />). The app segment is growing much faster: The Business
              Research Company estimates astrology apps at $5.69 billion in 2026, roughly doubling to
              $11.71 billion by 2030 (<Cite source="tbrc" />). In the US, IBISWorld sizes the broader
              psychic services industry — astrology, tarot, mediumship and palmistry — at $2.3 billion in
              2025 (<Cite source="ibis" />).
            </p>
            <p>
              The fastest-growing single company in the space is in India: Astrotalk, a live astrologer
              consultation marketplace, reported FY25 revenue of ₹1,214 crore, up 85% year over year
              (<Cite source="astrotalk" />).
            </p>
          </section>
          <StatGrid stats={MARKET_STATS} />

          {/* ── APPS ── */}
          <section className="prose">
            <h2 className="sec" id="apps">
              Astrology app <em>statistics</em>
            </h2>
            <p>
              Apps are where most people under 35 meet astrology. Co–Star, launched in 2017, reported{" "}
              <strong>more than 20 million downloads by April 2021</strong> and said a quarter of all
              US women ages 18–25 had downloaded it (<Cite source="axios2021" />). In Q1 2026, CHANI and
              Co–Star were named as the leading US astrology apps by revenue in AppMagic data published by
              Statista (<Cite source="statista2026" />).
            </p>
            <p>
              Here&apos;s how the major apps compare on the US App Store today. Rating counts are a rough
              proxy for engaged user base, since only a fraction of users leave ratings. For a deeper
              feature comparison, see our <a href="/astrology-app-alternatives">astrology app alternatives</a>{" "}
              guide.
            </p>
          </section>

          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>App</th>
                  <th>Rating</th>
                  <th># Ratings</th>
                  <th>Subscription</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {APPS.map((a) => (
                  <tr key={a.app}>
                    <td className="strong">{a.app}</td>
                    <td className="num">{a.rating}★</td>
                    <td>{a.ratings}</td>
                    <td>{a.price}</td>
                    <td>{a.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Source: <Cite source="appstore" />; funding from <Cite source="techcrunch2019" /> and{" "}
            <Cite source="axios2021" />.
          </p>
          <StatGrid stats={APP_STATS} />

          <div className="cta-section">
            <h2>You&apos;re one of the 88% who know their sign.</h2>
            <p>
              Your sun sign is one placement out of dozens. A full birth chart reading covers your Moon,
              Rising, houses and aspects — calculated from your exact birth time and place.
            </p>
            <a className="bp" href="/free-birth-chart">Get My Free Birth Chart</a>
          </div>

          {/* ── HOROSCOPES ── */}
          <section className="prose">
            <h2 className="sec" id="horoscopes">
              Zodiac sign <em>&amp; horoscope habits</em>
            </h2>
            <p>
              Knowing your sign is close to universal in the US: 88% of Americans know their zodiac sign
              (<Cite source="ipsos2019" />) and 90% could name it when YouGov asked (<Cite source="yougov2022" />).
              Identifying with it is another matter — only about half of those who know their sign say
              it describes them.
            </p>
            <p>
              Among people who do use horoscopes, the most common reasons are seeing the future (37%),
              understanding moods or other people&apos;s behavior (34%), and checking relationship
              compatibility (32%) (<Cite source="ipsos2019" />). That last one explains why tools like
              the <a href="/moon-sign-calculator">moon sign calculator</a> and{" "}
              <a href="/rising-sign-calculator">rising sign calculator</a> get so much traffic: people
              want to go beyond the sun sign.
            </p>
          </section>
          <StatGrid stats={HOROSCOPE_STATS} />

          {/* ── SOCIAL ── */}
          <section className="prose">
            <h2 className="sec" id="social">
              Astrology on social media <em>&amp; online communities</em>
            </h2>
            <p>
              Reddit&apos;s r/astrology, created in May 2008, is one of the largest astrology discussion
              communities online. It passed 2 million subscribers in February 2025 and had{" "}
              <strong>2,102,160 subscribers as of September 2026</strong> (<Cite source="redditlist" />).
            </p>
          </section>
          <StatGrid stats={SOCIAL_STATS} />
          <div className="pending">
            <strong>Data pending — TikTok &amp; Instagram.</strong> Hashtag view and post counts for
            #astrology are widely quoted, but TikTok no longer displays them consistently and we
            couldn&apos;t verify a current figure from a primary source. We&apos;ll add them once we can.
          </div>

          {/* ── SEARCH ── */}
          <section className="prose">
            <h2 className="sec" id="search">
              Astrology <em>search trends</em>
            </h2>
            <p>
              The survey data above suggests where search demand comes from: younger adults and women
              are both the most likely to believe and the most likely to consult astrology. Search
              behavior around birth charts specifically — rather than daily horoscopes — reflects the
              shift toward personalized placements that apps like Co–Star popularized.
            </p>
          </section>
          <div className="pending">
            <strong>Data pending — absolute search volumes.</strong> We&apos;re not publishing monthly
            Google search volumes for terms like &ldquo;birth chart&rdquo; or &ldquo;horoscope&rdquo;
            until we can pull them from a verifiable keyword dataset. Google Trends reports only relative
            interest (0–100), which can&apos;t be compared across separate queries. This section will be
            expanded in the next update.
          </div>

          {/* ── SCIENCE ── */}
          <section className="prose">
            <h2 className="sec" id="science">
              Do people think astrology <em>is scientific?</em>
            </h2>
            <p>
              The National Science Foundation has asked Americans whether astrology is scientific since
              1979 as part of its Science &amp; Engineering Indicators. In the 2016 General Social Survey
              data, <strong>60% said astrology is &ldquo;not at all scientific&rdquo;</strong> — down from 65% in
              2014 — while 29% said &ldquo;sort of scientific&rdquo; and 8% &ldquo;very scientific&rdquo;
              (<Cite source="nsf2018" />).
            </p>
            <p>
              Younger adults were the least likely to reject astrology, and education made a large
              difference: 76% of bachelor&apos;s degree holders called it unscientific, versus 57% of
              people whose highest education was high school.
            </p>
          </section>
          <StatGrid stats={SCIENCE_STATS} />

          {/* ── GLOBAL ── */}
          <section className="prose">
            <h2 className="sec" id="global">
              Astrology <em>around the world</em>
            </h2>
            <p>
              Pew&apos;s 35-country survey asked whether people consult a fortune teller, horoscope or
              other way to see the future. In most countries fewer than a quarter of adults do. South
              Africa (47%) and India (45%) were the highest; Greece (4%) the lowest. Hindus were among the
              most likely to consult horoscopes, including 51% in India and 56% in Sri Lanka
              (<Cite source="pewGlobal" />). Note that this question differs from Pew&apos;s US-only
              survey, which is why the US figure here (about 9%) is lower than the 28% above.
            </p>
          </section>
          <StatGrid stats={GLOBAL_STATS} />

          {/* ── FAQ ── */}
          <section className="prose">
            <h2 className="sec" id="faq">
              Frequently asked <em>questions</em>
            </h2>
          </section>
          <div className="faq">
            {FAQS.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          {/* ── SOURCES ── */}
          <section className="prose sources">
            <h2 className="sec" id="sources">
              Methodology <em>&amp; sources</em>
            </h2>
            <p>
              Every statistic on this page is taken from the source listed next to it. We prioritize
              primary sources — survey organizations, government data, company announcements and public
              app store listings — over secondary roundups. Market-size figures come from commercial
              research firms whose full methodologies sit behind paywalls; we quote their published
              headline numbers and name the firm so you can judge them yourself.
            </p>
            <p>
              <strong>Zodiac birth analysis:</strong> we summed SSA daily birth counts for January 1,
              2000 through December 31, 2014 (62,187,024 births) into the twelve tropical sun signs using
              conventional start dates (Aquarius Jan 20, Pisces Feb 19, Aries Mar 21, Taurus Apr 20,
              Gemini May 21, Cancer Jun 21, Leo Jul 23, Virgo Aug 23, Libra Sep 23, Scorpio Oct 23,
              Sagittarius Nov 22, Capricorn Dec 22). Births per day divides each sign&apos;s total by the
              number of calendar days it covered in the dataset.
            </p>
            <p>
              <strong>App data</strong> reflects US App Store listings viewed in September 2026 and will
              change over time. Where we couldn&apos;t verify a number from a primary source, we mark it
              &ldquo;Data pending&rdquo; instead of repeating it.
            </p>
            <div className="cite-box">
              <strong style={{ color: "var(--white)" }}>How to cite this page:</strong>
              <br />
              <code>BluntChart. &ldquo;Astrology Statistics 2026: 50+ Facts, Trends &amp; Market Data.&rdquo; Updated {UPDATED_LABEL}. {PAGE_URL}</code>
            </div>
            <ol>
              {Object.values(SOURCES).map((s) => (
                <li key={s.url + s.short}>
                  {s.name}{" "}
                  <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
                </li>
              ))}
            </ol>
          </section>

          {/* ── RELATED ── */}
          <section className="prose">
            <h2 className="sec">
              Explore <em>BluntChart tools</em>
            </h2>
          </section>
          <div className="related-grid">
            <a className="related-card" href="/free-birth-chart">
              <div className="related-card-title">Free Birth Chart</div>
              <div className="related-card-desc">Every planet, house and aspect from your exact birth data.</div>
            </a>
            <a className="related-card" href="/big-three-calculator">
              <div className="related-card-title">Big Three Calculator</div>
              <div className="related-card-desc">Sun, Moon and Rising — the placements beyond your sign.</div>
            </a>
            <a className="related-card" href="/saturn-return-calculator">
              <div className="related-card-title">Saturn Return Calculator</div>
              <div className="related-card-desc">Find the exact dates of your late-20s reckoning.</div>
            </a>
            <a className="related-card" href="/astrology-app-alternatives">
              <div className="related-card-title">Astrology App Alternatives</div>
              <div className="related-card-desc">How Co–Star, CHANI, The Pattern and Nebula compare.</div>
            </a>
            <a className="related-card" href="/zodiac-signs">
              <div className="related-card-title">Zodiac Signs Guide</div>
              <div className="related-card-desc">Deep dives into all 12 signs.</div>
            </a>
            <a className="related-card" href="/in-depth-birth-chart">
              <div className="related-card-title">In-Depth Birth Chart Reading</div>
              <div className="related-card-desc">The blunt, full-length version of your chart.</div>
            </a>
          </div>

          <div className="last-updated">
            <time dateTime={UPDATED_ISO}>Last updated: {UPDATED_LABEL}</time> · Statistics are provided
            for research and reference; astrology content on BluntChart is for entertainment purposes.
          </div>
        </div>
      </main>
    </>
  );
}
