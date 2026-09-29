import type { Metadata } from "next";
import Link from "next/link";

// ─── SEO METADATA ──────────────────────────────────────────────────────────────

const PAGE_URL = "https://bluntchart.com/birth-chart-statistics";
const UPDATED_ISO = "2026-09-29";
const UPDATED_LABEL = "September 29, 2026";

export const metadata: Metadata = {
  title: "Birth Chart Statistics: Data on Readings, Popularity & Trends | BluntChart",
  description:
    "Original birth chart data from 62M US births: the most common Sun, Moon and Rising signs, the most and least common Big Three combinations, Mercury retrograde births, plus research and interest trends. Every stat sourced.",
  keywords: [
    "birth chart statistics",
    "most common rising sign",
    "rarest rising sign",
    "most common big three",
    "rarest big three combination",
    "most common moon sign",
    "sun moon rising statistics",
    "most common sun and moon combination",
    "birth chart facts",
    "natal chart statistics",
    "how rare is my big three",
    "born during mercury retrograde percentage",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Birth Chart Statistics: Data on Readings, Popularity & Trends",
    description:
      "Leo Rising is twice as common as Pisces Rising. 1 in 5 Americans was born during Mercury retrograde. Original Sun/Moon/Rising data from 62 million US births.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birth Chart Statistics: Sun, Moon & Rising Data From 62M Births",
    description:
      "The most common Big Three, the rarest Rising sign, and how many people were born under Mercury retrograde. All sourced.",
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
  bc: {
    name: "BluntChart analysis of 62,187,024 US births, 2000–2014 (SSA daily counts via FiveThirtyEight), weighted by CDC/NCHS hour-of-birth distribution, with planetary positions computed by the astronomy-engine library. See Methodology.",
    short: "BluntChart analysis of SSA + CDC data",
    url: "https://bluntchart.com/birth-chart-statistics#sources",
  },
  ssa: {
    name: "US Social Security Administration daily birth counts 2000–2014 (62,187,024 births), published by FiveThirtyEight.",
    short: "SSA births 2000–2014 via FiveThirtyEight",
    url: "https://github.com/fivethirtyeight/data/tree/master/births",
  },
  cdc: {
    name: "Martin JA, Hamilton BE, Osterman MJK. “When Are Babies Born: Morning, Noon, or Night? Birth Certificate Data for 2013.” NCHS Data Brief No. 200 (May 2015). Data tables.",
    short: "CDC/NCHS Data Brief 200, 2015",
    url: "https://www.cdc.gov/nchs/products/databriefs/db200.htm",
  },
  census: {
    name: "US Census Bureau, “Center of Population” (2020 Census): Hartville, Missouri, 37.4°N, 92.4°W.",
    short: "US Census Bureau, 2020",
    url: "https://www.census.gov/geographies/reference-files/time-series/geo/centers-population.html",
  },
  astronomy: {
    name: "Don Cross, astronomy-engine (open-source astronomy calculation library, validated against NASA JPL Horizons and NOVAS).",
    short: "astronomy-engine",
    url: "https://github.com/cosinekitty/astronomy",
  },
  pew2025: {
    name: "Pew Research Center, “3 in 10 Americans consult astrology, tarot cards or fortune tellers” (May 21, 2025). Survey of 9,593 US adults, Oct 21–27, 2024.",
    short: "Pew Research Center, 2025",
    url: "https://www.pewresearch.org/religion/2025/05/21/3-in-10-americans-consult-astrology-tarot-cards-or-fortune-tellers/",
  },
  ipsos2019: {
    name: "Ipsos, “Divides among public opinion on astrology and horoscopes” (2019). Survey of 1,005 US adults, Nov 26–27, 2019.",
    short: "Ipsos, 2019",
    url: "https://www.ipsos.com/en-us/news-polls/astrology-horoscopes",
  },
  wiki: {
    name: "Wikimedia Foundation Pageviews API, English Wikipedia, user traffic (all access), Sept 2024–Aug 2026. Articles: Ascendant, Horoscope, Astrological sign, Astrology, Saturn return.",
    short: "Wikimedia Pageviews API",
    url: "https://wikimedia.org/api/rest_v1/",
  },
  carlson: {
    name: "Carlson S. “A double-blind test of astrology.” Nature 318, 419–425 (1985).",
    short: "Carlson, Nature, 1985",
    url: "https://www.nature.com/articles/318419a0",
  },
  deankelly: {
    name: "Dean G, Kelly IW. “Is Astrology Relevant to Consciousness and Psi?” Journal of Consciousness Studies 10(6–7), 175–198 (2003).",
    short: "Dean & Kelly, JCS, 2003",
    url: "https://philpapers.org/rec/DEAIAR",
  },
  wymanvyse: {
    name: "Wyman AJ, Vyse S. “Science Versus the Stars: A Double-Blind Test of the Validity of the NEO Five-Factor Inventory and Computer-Generated Astrological Natal Charts.” Journal of General Psychology 135(3), 287–300 (2008).",
    short: "Wyman & Vyse, J. Gen. Psych., 2008",
    url: "https://www.tandfonline.com/doi/abs/10.3200/GENP.135.3.287-300",
  },
  appstore: {
    name: "Apple App Store (US) public listings for Co–Star, CHANI, Nebula and The Pattern, accessed September 2026.",
    short: "Apple App Store, Sept 2026",
    url: "https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561",
  },
} as const;

// ─── DATA ──────────────────────────────────────────────────────────────────────
// All sign distributions below come from scratch computation over SSA 2000–2014
// daily births × CDC 2013 hour-of-birth weights (weekday/weekend), at the 2020 US
// center of population. See the Methodology section for full details.

type Stat = { value: string; label: string; source: SourceKey };

const KEY_STATS: Stat[] = [
  { value: "2×", label: "Leo Rising (10.53%) is twice as common as Pisces Rising (5.18%) in the US", source: "bc" },
  { value: "Leo", label: "most common Sun sign using exact Sun ingress times (8.96% of births)", source: "bc" },
  { value: "19%", label: "of Americans born 2000–2014 were born with Mercury retrograde", source: "bc" },
  { value: "1 in 906", label: "Cancer Sun, Sagittarius Moon, Libra Rising — the most common Big Three", source: "bc" },
  { value: "1 in 157", label: "people have the same sign for Sun, Moon and Rising (a “triple”)", source: "bc" },
  { value: "28%", label: "of US adults consult astrology or a horoscope at least once a year", source: "pew2025" },
];

type SignRow = { sign: string; symbol: string; share: number };

const SUN: SignRow[] = [
  { sign: "Leo", symbol: "♌", share: 8.96 },
  { sign: "Virgo", symbol: "♍", share: 8.94 },
  { sign: "Cancer", symbol: "♋", share: 8.85 },
  { sign: "Gemini", symbol: "♊", share: 8.56 },
  { sign: "Libra", symbol: "♎", share: 8.52 },
  { sign: "Taurus", symbol: "♉", share: 8.29 },
  { sign: "Scorpio", symbol: "♏", share: 8.18 },
  { sign: "Aries", symbol: "♈", share: 8.15 },
  { sign: "Pisces", symbol: "♓", share: 8.04 },
  { sign: "Sagittarius", symbol: "♐", share: 7.95 },
  { sign: "Aquarius", symbol: "♒", share: 7.93 },
  { sign: "Capricorn", symbol: "♑", share: 7.64 },
];

const MOON: SignRow[] = [
  { sign: "Aries", symbol: "♈", share: 8.49 },
  { sign: "Taurus", symbol: "♉", share: 8.47 },
  { sign: "Gemini", symbol: "♊", share: 8.4 },
  { sign: "Pisces", symbol: "♓", share: 8.4 },
  { sign: "Aquarius", symbol: "♒", share: 8.38 },
  { sign: "Cancer", symbol: "♋", share: 8.37 },
  { sign: "Capricorn", symbol: "♑", share: 8.33 },
  { sign: "Leo", symbol: "♌", share: 8.29 },
  { sign: "Scorpio", symbol: "♏", share: 8.24 },
  { sign: "Sagittarius", symbol: "♐", share: 8.24 },
  { sign: "Libra", symbol: "♎", share: 8.19 },
  { sign: "Virgo", symbol: "♍", share: 8.18 },
];

const RISING: SignRow[] = [
  { sign: "Leo", symbol: "♌", share: 10.53 },
  { sign: "Virgo", symbol: "♍", share: 10.44 },
  { sign: "Libra", symbol: "♎", share: 10.43 },
  { sign: "Scorpio", symbol: "♏", share: 10.29 },
  { sign: "Cancer", symbol: "♋", share: 9.92 },
  { sign: "Sagittarius", symbol: "♐", share: 9.64 },
  { sign: "Gemini", symbol: "♊", share: 8.12 },
  { sign: "Capricorn", symbol: "♑", share: 7.88 },
  { sign: "Taurus", symbol: "♉", share: 6.26 },
  { sign: "Aquarius", symbol: "♒", share: 6.09 },
  { sign: "Aries", symbol: "♈", share: 5.23 },
  { sign: "Pisces", symbol: "♓", share: 5.18 },
];

// Rising sign share (%) by latitude, uniform birth times over a year.
const LAT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const LAT_RISE: { lat: string; place: string; values: number[] }[] = [
  { lat: "25°N", place: "Miami", values: [6.24, 7.08, 8.43, 9.44, 9.54, 9.26, 9.26, 9.54, 9.44, 8.44, 7.08, 6.24] },
  { lat: "35°N", place: "Memphis / Albuquerque", values: [5.48, 6.44, 8.17, 9.71, 10.17, 10.02, 10.02, 10.18, 9.71, 8.17, 6.44, 5.48] },
  { lat: "40°N", place: "New York / Denver", values: [5.03, 6.05, 8.0, 9.88, 10.57, 10.48, 10.48, 10.57, 9.88, 7.99, 6.05, 5.03] },
  { lat: "48°N", place: "Seattle", values: [4.13, 5.25, 7.62, 10.25, 11.37, 11.37, 11.37, 11.37, 10.25, 7.63, 5.25, 4.13] },
];

const TOP_SUN_MOON = [
  { sun: "Virgo", moon: "Cancer", share: 0.789 },
  { sun: "Leo", moon: "Taurus", share: 0.784 },
  { sun: "Leo", moon: "Libra", share: 0.773 },
  { sun: "Cancer", moon: "Pisces", share: 0.77 },
  { sun: "Virgo", moon: "Scorpio", share: 0.768 },
  { sun: "Virgo", moon: "Gemini", share: 0.768 },
  { sun: "Cancer", moon: "Aries", share: 0.767 },
  { sun: "Leo", moon: "Gemini", share: 0.767 },
];
const RARE_SUN_MOON = [
  { sun: "Capricorn", moon: "Libra", share: 0.559 },
  { sun: "Capricorn", moon: "Leo", share: 0.588 },
  { sun: "Capricorn", moon: "Virgo", share: 0.596 },
  { sun: "Capricorn", moon: "Gemini", share: 0.606 },
  { sun: "Sagittarius", moon: "Virgo", share: 0.617 },
];

const TOP_BIG3 = [
  { sun: "Cancer", moon: "Sagittarius", rising: "Libra", share: 0.11, n: 68635 },
  { sun: "Leo", moon: "Taurus", rising: "Scorpio", share: 0.11, n: 68145 },
  { sun: "Cancer", moon: "Aries", rising: "Libra", share: 0.109, n: 67775 },
  { sun: "Leo", moon: "Pisces", rising: "Scorpio", share: 0.108, n: 67278 },
  { sun: "Leo", moon: "Aries", rising: "Virgo", share: 0.106, n: 66127 },
  { sun: "Cancer", moon: "Pisces", rising: "Libra", share: 0.106, n: 66085 },
  { sun: "Gemini", moon: "Aquarius", rising: "Virgo", share: 0.106, n: 65773 },
  { sun: "Virgo", moon: "Sagittarius", rising: "Libra", share: 0.106, n: 65717 },
];
const RARE_BIG3 = [
  { sun: "Aries", moon: "Leo", rising: "Pisces", share: 0.021, n: 13345 },
  { sun: "Aries", moon: "Aries", rising: "Pisces", share: 0.022, n: 13373 },
  { sun: "Gemini", moon: "Sagittarius", rising: "Aries", share: 0.022, n: 13642 },
  { sun: "Taurus", moon: "Libra", rising: "Aries", share: 0.022, n: 13697 },
  { sun: "Taurus", moon: "Virgo", rising: "Pisces", share: 0.022, n: 13730 },
];

const COMBO_STATS: Stat[] = [
  { value: "1,728", label: "possible Sun–Moon–Rising combinations — all 1,728 occur in the data", source: "bc" },
  { value: "0.058%", label: "share each Big Three would have if all were equally likely (1 in 1,728)", source: "bc" },
  { value: "5.1×", label: "gap between the most common (0.110%) and rarest (0.021%) Big Three", source: "bc" },
  { value: "8.31%", label: "of people share a Sun and Moon sign (a “double” — roughly 1 in 12)", source: "bc" },
  { value: "7.41%", label: "have the same Sun and Rising sign (roughly 1 in 13.5)", source: "bc" },
  { value: "0.64%", label: "are a “triple” — Sun, Moon and Rising all in one sign", source: "bc" },
];

const PLANET_STATS: Stat[] = [
  { value: "19.04%", label: "of births (2000–2014) happened while Mercury was retrograde", source: "bc" },
  { value: "19.04%", label: "of calendar days in the same period had Mercury retrograde — births matched days exactly", source: "bc" },
  { value: "6.88%", label: "of births happened with Venus retrograde (vs 6.92% of days)", source: "bc" },
  { value: "25.0%", label: "each: Fire, Earth, Air and Water Sun signs split the population almost perfectly evenly", source: "bc" },
];

const PHASES = [
  { phase: "New Moon", births: 12.3, days: 12.3 },
  { phase: "Waxing Crescent", births: 12.42, days: 12.45 },
  { phase: "First Quarter", births: 12.72, days: 12.74 },
  { phase: "Waxing Gibbous", births: 12.56, days: 12.56 },
  { phase: "Full Moon", births: 12.3, days: 12.17 },
  { phase: "Waning Gibbous", births: 12.37, days: 12.5 },
  { phase: "Last Quarter", births: 12.78, days: 12.74 },
  { phase: "Waning Crescent", births: 12.54, days: 12.54 },
];

const TIME_STATS: Stat[] = [
  { value: "8 a.m.", label: "the single most common hour of birth in the US (6.3% of births)", source: "cdc" },
  { value: "<3%", label: "of births occur in each hour from midnight through 6:59 a.m.", source: "cdc" },
  { value: "11.6%", label: "of cesarean births happen in the 8 a.m. hour alone", source: "cdc" },
  { value: "58%", label: "more births on an average weekday (12,675) than weekend day (8,040)", source: "ssa" },
  { value: "60.3%", label: "of births fall between 6 a.m. and 6 p.m., putting the Sun above the horizon for most charts", source: "bc" },
];

const INTEREST_STATS: Stat[] = [
  { value: "+67%", label: "year-over-year growth in views of Wikipedia’s “Ascendant” (rising sign) article", source: "wiki" },
  { value: "+10%", label: "growth for Wikipedia’s “Horoscope” article, which covers the birth chart itself", source: "wiki" },
  { value: "−36%", label: "decline for the “Astrological sign” (sun sign) article over the same period", source: "wiki" },
  { value: "−19%", label: "decline for the general “Astrology” article", source: "wiki" },
  { value: "31%", label: "of 18–34-year-olds turn to horoscopes to understand their lives (vs 11% of 55+)", source: "ipsos2019" },
];

const WIKI_ROWS = [
  { article: "Astrological sign", y1: 1287736, y2: 829862 },
  { article: "Astrology", y1: 556220, y2: 448394 },
  { article: "Horoscope (birth chart)", y1: 183592, y2: 202142 },
  { article: "Ascendant (rising sign)", y1: 83942, y2: 140032 },
  { article: "Saturn return", y1: 107709, y2: 103200 },
];

const RESEARCH_STATS: Stat[] = [
  { value: "28", label: "astrologers took part in Carlson’s double-blind test, matching 116 charts to personality profiles", source: "carlson" },
  { value: "Chance", label: "level: Carlson found chart-based matching performed no better than random guessing", source: "carlson" },
  { value: "2,101", label: "“time twins” born in London, 3–9 May 1958, compared on 100+ traits with no chart-predicted similarity found", source: "deankelly" },
  { value: "52", label: "students could pick their real personality-test profile, but not their real natal-chart description", source: "wymanvyse" },
];

const SATISFACTION_STATS: Stat[] = [
  { value: "1%", label: "of US adults rely “a lot” on astrology, tarot or fortune tellers for major decisions", source: "pew2025" },
  { value: "20%", label: "engage with astrology, tarot or fortune telling mostly “just for fun”", source: "pew2025" },
  { value: "53%", label: "of people who know their sign say they identify with its description", source: "ipsos2019" },
  { value: "4.8 / 4.9", label: "US App Store ratings for Co–Star (206K ratings) and CHANI (59K ratings)", source: "appstore" },
];

const FAQS = [
  {
    q: "What is the most common rising sign?",
    a: "Leo Rising. In a BluntChart analysis of 62.2 million US births (2000–2014), weighted by CDC hour-of-birth data at the US center of population, 10.53% of people had Leo Rising, followed by Virgo (10.44%) and Libra (10.43%). Rising signs are uneven because at northern latitudes some signs take far longer to cross the horizon than others.",
  },
  {
    q: "What is the rarest rising sign?",
    a: "Pisces Rising at 5.18% of US births, just behind Aries Rising at 5.23%. Both are 'signs of short ascension' in the Northern Hemisphere, rising in under an hour. The further north you are born, the rarer they get: about 6.2% of births at Miami's latitude but about 4.1% at Seattle's.",
  },
  {
    q: "What is the most common moon sign?",
    a: "Moon signs are close to evenly distributed. The Moon changes sign every 2–3 days, so it cycles through the zodiac about 13 times a year. In 2000–2014 US births, Aries Moon was slightly most common (8.49%) and Virgo Moon least common (8.18%), a spread of only 0.31 percentage points.",
  },
  {
    q: "What is the most common Big Three combination?",
    a: "Cancer Sun, Sagittarius Moon, Libra Rising, at 0.110% of US births (about 1 in 906). Leo Sun, Taurus Moon, Scorpio Rising is effectively tied. The rarest was Aries Sun, Leo Moon, Pisces Rising at 0.021% (about 1 in 4,700). All 1,728 possible combinations appear in the data.",
  },
  {
    q: "What is the most common Sun and Moon combination?",
    a: "Virgo Sun with Cancer Moon, at 0.789% of US births from 2000–2014, just ahead of Leo Sun with Taurus Moon (0.784%). The rarest pairing was Capricorn Sun with Libra Moon (0.559%). If all 144 pairings were equally common, each would be 0.694%.",
  },
  {
    q: "How many people are born during Mercury retrograde?",
    a: "About 1 in 5. 19.04% of US births from 2000–2014 happened while Mercury was retrograde, exactly matching the share of days Mercury spent retrograde. Venus retrograde births were 6.88%.",
  },
  {
    q: "Are more babies born on a full moon?",
    a: "Not meaningfully. Full-moon days made up 12.17% of days in 2000–2014 and 12.30% of US births, a difference of about 1%. Day of the week matters far more: an average weekday has 58% more births than an average weekend day, because scheduled inductions and C-sections happen on weekdays.",
  },
  {
    q: "Is the most common sun sign Cancer or Leo?",
    a: "It depends on how you draw the boundaries. Using conventional calendar dates, Cancer edges ahead (9.00%, per our astrology statistics page). Using the Sun's exact astronomical ingress times, Leo (8.96%), Virgo (8.94%) and Cancer (8.85%) are nearly tied, with Leo on top. Capricorn is the least common either way.",
  },
  {
    q: "Have birth chart readings been scientifically tested?",
    a: "Yes, several times. In Carlson's 1985 double-blind study in Nature, 28 astrologers matching 116 charts to personality profiles performed at chance level. Dean and Kelly (2003) compared 2,101 people born minutes apart in London in 1958 on 100+ traits and found no chart-predicted similarities. Astrologers have published reanalyses disputing some of these conclusions.",
  },
];

// ─── JSON-LD STRUCTURED DATA ───────────────────────────────────────────────────

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Birth Chart Statistics: Data on Readings, Popularity & Trends",
  description:
    "Original data on the most common Sun, Moon and Rising signs and Big Three combinations from 62 million US births, plus birth chart research, reading habits and interest trends.",
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
  citation: Object.values(SOURCES)
    .map((s) => s.url)
    .filter((u) => !u.startsWith(PAGE_URL)),
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
    { "@type": "ListItem", position: 2, name: "Birth Chart Statistics", item: PAGE_URL },
  ],
};

const jsonLdDataset = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "US Sun, Moon and Rising sign distribution, births 2000–2014",
  description:
    "Share of 62,187,024 US births (SSA, 2000–2014) by Sun, Moon and Rising sign and by Sun–Moon–Rising combination, weighted by CDC hour-of-birth data and computed at the 2020 US center of population by BluntChart.",
  url: `${PAGE_URL}#rising`,
  creator: { "@type": "Organization", name: "BluntChart" },
  isBasedOn: [SOURCES.ssa.url, SOURCES.cdc.url],
  temporalCoverage: "2000/2014",
  spatialCoverage: "United States",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function Cite({ source }: { source: SourceKey }) {
  const s = SOURCES[source];
  const internal = s.url.startsWith(PAGE_URL);
  return (
    <a
      className="cite"
      href={internal ? "#sources" : s.url}
      {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
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

function SignTable({ rows, min, max, label }: { rows: SignRow[]; min: number; max: number; label: string }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>#</th>
            <th>{label}</th>
            <th>Share of US births</th>
            <th style={{ width: "40%" }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.sign}>
              <td>{i + 1}</td>
              <td className="strong">
                <span style={{ opacity: 0.6, marginRight: 6 }}>{r.symbol}</span>
                {r.sign}
              </td>
              <td className="num">{r.share.toFixed(2)}%</td>
              <td>
                <div className="bar" style={{ width: `${((r.share - min) / (max - min)) * 100}%` }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const oneIn = (share: number) => Math.round(100 / share).toLocaleString("en-US");

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function BirthChartStatisticsPage() {
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
          <a href="/astrology-statistics">Statistics</a> <span style={{ margin: "0 8px", opacity: 0.4 }}>/</span>{" "}
          <span style={{ color: "var(--white)" }}>Birth Chart Statistics</span>
        </nav>
      </div>

      {/* ── HERO ── */}
      <header className="hero">
        <div className="c">
          <div className="eyebrow">📊 Original data · 62M US births</div>
          <h1>
            Birth Chart Statistics:
            <br />
            <em>Data on Readings, Popularity &amp; Trends</em>
          </h1>
          <p className="hero-sub">
            How common is your Rising sign? Which Big Three is the rarest? How many people were born
            under Mercury retrograde? Most answers online are guesses. We calculated the real Sun, Moon
            and Rising distribution for every US birth from 2000 to 2014, weighted by when in the day
            babies are actually born. We added the research on chart readings and data on how interest
            in birth charts is changing. Every number links to its source.
          </p>
          <div className="updated">
            <strong>Last updated:</strong>
            <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{Object.keys(SOURCES).length} sources · original dataset</span>
          </div>
        </div>
      </header>

      <main>
        <div className="c">
          {/* ── KEY STATS ── */}
          <section className="key-box" aria-labelledby="key-stats">
            <h2 id="key-stats">Key birth chart statistics at a glance</h2>
            <StatGrid stats={KEY_STATS} />
          </section>

          {/* ── TOC ── */}
          <nav className="toc" aria-label="Contents">
            <div className="toc-title">On this page</div>
            <ol>
              <li><a href="#rising">Most common rising signs</a></li>
              <li><a href="#latitude">Rising signs by latitude</a></li>
              <li><a href="#moon">Most common moon signs</a></li>
              <li><a href="#sun">Sun signs (exact ingress)</a></li>
              <li><a href="#sun-moon">Most common Sun–Moon pairs</a></li>
              <li><a href="#big-three">Most &amp; least common Big Three</a></li>
              <li><a href="#planets">Retrogrades, elements &amp; moon phases</a></li>
              <li><a href="#birth-time">Birth time statistics</a></li>
              <li><a href="#interest">Birth chart vs horoscope interest</a></li>
              <li><a href="#readings">Reading habits &amp; satisfaction</a></li>
              <li><a href="#research">Birth chart research</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#sources">Methodology &amp; sources</a></li>
            </ol>
          </nav>

          {/* ── RISING ── */}
          <section className="prose">
            <h2 className="sec" id="rising">
              What is the most common rising sign? <em>Leo, by a wide margin</em>
            </h2>
            <p>
              Sun and Moon signs are spread fairly evenly across the population. Rising signs are not.
              Your Ascendant is the sign on the eastern horizon at the minute you were born. At US
              latitudes, some signs cross the horizon in under an hour while others take nearly three.
              The longer a sign spends rising, the more people are born with it.
            </p>
            <p>
              Across 62.2 million US births, weighted by the hours babies are actually delivered,{" "}
              <strong>Leo Rising is the most common at 10.53%</strong>, followed by Virgo (10.44%),
              Libra (10.43%) and Scorpio (10.29%). <strong>Pisces Rising is the rarest at 5.18%</strong>,
              just below Aries (5.23%). That makes a Leo Rising about twice as common as a Pisces Rising
              (<Cite source="bc" />). Don&apos;t know yours? The{" "}
              <a href="/rising-sign-calculator">rising sign calculator</a> works it out from your birth
              time.
            </p>
          </section>
          <SignTable rows={RISING} min={4} max={10.6} label="Rising sign" />
          <p className="tbl-note">
            Source: BluntChart analysis of SSA births 2000–2014 × CDC hour-of-birth weights, computed at
            the 2020 US center of population (37.4°N). Bar scale starts at 4%. Free to cite with a link
            to this page.
          </p>

          {/* ── LATITUDE ── */}
          <section className="prose">
            <h2 className="sec" id="latitude">
              Rising signs <em>by latitude</em>
            </h2>
            <p>
              Where you&apos;re born changes the odds. The further north you go, the faster Aries and
              Pisces rise and the slower Leo through Scorpio rise. At Seattle&apos;s latitude, Pisces Rising
              drops to about 4.1% of births, while Leo, Virgo, Libra and Scorpio each climb to 11.4%. In
              Miami the spread is much flatter: 6.2% to 9.5% (<Cite source="bc" />). Above the Arctic
              Circle some signs never rise at all, which is one reason astrologers disagree about house
              systems at extreme latitudes.
            </p>
          </section>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Rising</th>
                  {LAT_RISE.map((l) => (
                    <th key={l.lat}>
                      {l.lat}
                      <br />
                      <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{l.place}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LAT_SIGNS.map((s, i) => (
                  <tr key={s}>
                    <td className="strong">{s}</td>
                    {LAT_RISE.map((l) => (
                      <td key={l.lat} className={l.values[i] >= 10 ? "num" : undefined}>
                        {l.values[i].toFixed(2)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Share of time each sign is on the Ascendant over a full year (2010), sampled every 15
            minutes, assuming births are spread evenly across the clock. Source: <Cite source="bc" />.
          </p>

          {/* ── MOON ── */}
          <section className="prose">
            <h2 className="sec" id="moon">
              What is the most common moon sign? <em>They&apos;re nearly even</em>
            </h2>
            <p>
              The Moon moves through a sign in about 2.5 days and circles the zodiac roughly 13 times a
              year. Because of that, no season can favor any Moon sign. In the 2000–2014 data,{" "}
              <strong>Aries Moon was marginally the most common (8.49%)</strong> and Virgo Moon the least
              (8.18%), a spread of just 0.31 percentage points (<Cite source="bc" />). The small tilt
              comes from the Moon&apos;s elliptical orbit. It moves faster near perigee, and over a
              15-year window that point doesn&apos;t fully average out. It has nothing to do with birth
              seasonality. You can look up yours with the{" "}
              <a href="/moon-sign-calculator">moon sign calculator</a>.
            </p>
          </section>
          <SignTable rows={MOON} min={7.9} max={8.5} label="Moon sign" />
          <p className="tbl-note">
            Bar scale runs from 7.9% to 8.5% to make the tiny differences visible. Source:{" "}
            <Cite source="bc" />.
          </p>

          {/* ── SUN ── */}
          <section className="prose">
            <h2 className="sec" id="sun">
              Sun sign distribution <em>using exact ingress times</em>
            </h2>
            <p>
              Our <a href="/astrology-statistics#zodiac-births">astrology statistics</a> page ranks Sun
              signs using the conventional calendar dates that horoscope columns print. Here we use the
              Sun&apos;s exact astronomical entry into each sign, to the hour. That moves a few births
              across cusps. <strong>Leo (8.96%), Virgo (8.94%) and Cancer (8.85%) are effectively a
              three-way tie</strong> for most common, driven by the US late-summer birth peak.{" "}
              <strong>Capricorn stays the rarest at 7.64%</strong> (<Cite source="bc" />). If you were
              born on a cusp date, your <a href="/free-birth-chart">free birth chart</a> will tell you
              which side you fall on.
            </p>
          </section>
          <SignTable rows={SUN} min={7} max={9} label="Sun sign" />
          <p className="tbl-note">
            Bar scale starts at 7%. Source: <Cite source="bc" />.
          </p>

          {/* ── SUN-MOON ── */}
          <section className="prose">
            <h2 className="sec" id="sun-moon">
              Most common <em>Sun–Moon combinations</em>
            </h2>
            <p>
              There are 144 possible Sun–Moon pairings. If all were equally likely, each would cover
              0.694% of people. In practice, pairs involving the late-summer Sun signs lead the list.{" "}
              <strong>Virgo Sun with Cancer Moon is the most common pairing at 0.789%</strong>, about 1
              in 127 people. All five of the rarest pairings have a late-autumn or winter Sun, led by{" "}
              <strong>Capricorn Sun with Libra Moon at 0.559%</strong> (about 1 in 179) (<Cite source="bc" />).
            </p>
          </section>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Sun</th>
                  <th>Moon</th>
                  <th>Share</th>
                  <th>About 1 in</th>
                </tr>
              </thead>
              <tbody>
                {TOP_SUN_MOON.map((r, i) => (
                  <tr key={r.sun + r.moon}>
                    <td>{i + 1}</td>
                    <td className="strong">
                      <a href={`/sun-in-${r.sun.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>{r.sun}</a>
                    </td>
                    <td className="strong">{r.moon}</td>
                    <td className="num">{r.share.toFixed(3)}%</td>
                    <td>{oneIn(r.share)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={5} style={{ color: "var(--dim)", fontSize: ".75rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
                    Rarest pairings
                  </td>
                </tr>
                {RARE_SUN_MOON.map((r, i) => (
                  <tr key={r.sun + r.moon}>
                    <td>{144 - i}</td>
                    <td className="strong">{r.sun}</td>
                    <td className="strong">{r.moon}</td>
                    <td className="num">{r.share.toFixed(3)}%</td>
                    <td>{oneIn(r.share)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">Source: <Cite source="bc" />. Ranks out of 144 pairings.</p>

          {/* ── BIG THREE ── */}
          <section className="prose">
            <h2 className="sec" id="big-three">
              The most common and rarest <em>Big Three</em>
            </h2>
            <p>
              Add the Rising sign and there are 1,728 possible Sun–Moon–Rising combinations. All 1,728
              occur in the data, but they are far from equal. <strong>Cancer Sun, Sagittarius Moon,
              Libra Rising is the most common Big Three at 0.110%</strong>, about 68,600 of the 62.2
              million births, or 1 in 906. Leo Sun, Taurus Moon, Scorpio Rising is effectively tied.
            </p>
            <p>
              At the other end, <strong>Aries Sun, Leo Moon, Pisces Rising is the rarest at 0.021%</strong>,
              about 1 in 4,700. It pairs a spring Sun with the rarest Rising sign. Most of the rarest
              combinations share that shape: an Aries or Taurus Sun with Aries or Pisces Rising. Those
              Rising signs are rare in the first place, and spring babies born in the hours when they
              rise are rarer still (<Cite source="bc" />). Find your own with the{" "}
              <a href="/big-three-calculator">Big Three calculator</a>.
            </p>
          </section>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Sun</th>
                  <th>Moon</th>
                  <th>Rising</th>
                  <th>Share</th>
                  <th>US births</th>
                  <th>About 1 in</th>
                </tr>
              </thead>
              <tbody>
                {TOP_BIG3.map((r, i) => (
                  <tr key={r.sun + r.moon + r.rising}>
                    <td>{i + 1}</td>
                    <td className="strong">{r.sun}</td>
                    <td className="strong">{r.moon}</td>
                    <td className="strong">{r.rising}</td>
                    <td className="num">{r.share.toFixed(3)}%</td>
                    <td>{r.n.toLocaleString("en-US")}</td>
                    <td>{Math.round(62187024 / r.n).toLocaleString("en-US")}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={7} style={{ color: "var(--dim)", fontSize: ".75rem", letterSpacing: ".12em", textTransform: "uppercase" }}>
                    Rarest combinations
                  </td>
                </tr>
                {RARE_BIG3.map((r, i) => (
                  <tr key={r.sun + r.moon + r.rising}>
                    <td>{1728 - i}</td>
                    <td className="strong">{r.sun}</td>
                    <td className="strong">{r.moon}</td>
                    <td className="strong">{r.rising}</td>
                    <td className="num">{r.share.toFixed(3)}%</td>
                    <td>{r.n.toLocaleString("en-US")}</td>
                    <td>{Math.round(62187024 / r.n).toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Source: <Cite source="bc" />. &ldquo;US births&rdquo; are weighted estimates (daily births ×
            hourly share) and are rounded. Ranks out of 1,728 combinations.
          </p>
          <StatGrid stats={COMBO_STATS} />

          <div className="cta-section">
            <h2>Your Big Three is 1 of 1,728. Your full chart is rarer still.</h2>
            <p>
              Sun, Moon and Rising are three placements out of dozens. A full reading adds your houses,
              aspects and the patterns that actually repeat in your life. It&apos;s calculated from your
              exact birth time and place.
            </p>
            <a className="bp" href="/free-birth-chart">Get My Free Birth Chart</a>
          </div>

          {/* ── PLANETS ── */}
          <section className="prose">
            <h2 className="sec" id="planets">
              Retrogrades, elements <em>&amp; moon phases at birth</em>
            </h2>
            <p>
              Mercury retrograde gets blamed for a lot, but it&apos;s common in birth charts.{" "}
              <strong>19.04% of US births from 2000–2014 happened with Mercury retrograde</strong>, about
              1 in 5 people. That exactly matches the share of days Mercury spent retrograde, so births
              don&apos;t cluster in or out of retrograde periods. Venus retrograde is rarer, at 6.88% of
              births (<Cite source="bc" />). See when the next one hits in our{" "}
              <a href="/mercury-retrograde-2026">Mercury retrograde 2026</a> guide.
            </p>
            <p>
              Sun-sign elements split almost perfectly: Fire 25.06%, Earth 24.86%, Air 25.00%, Water
              25.07%. Each element has one sign in every season, so seasonal birth peaks cancel out.
            </p>
            <p>
              What about the idea that more babies are born on a full moon? Full-moon days made up
              12.17% of days in the period and 12.30% of births, a gap of about 1%. The pattern is
              similar across every phase. For comparison, an average weekday sees 58% more births than an
              average weekend day, because inductions and C-sections are scheduled on weekdays (
              <Cite source="ssa" />). The Moon&apos;s phase has almost no effect next to the hospital
              calendar.
            </p>
          </section>
          <StatGrid stats={PLANET_STATS} />
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Moon phase at birth</th>
                  <th>Share of births</th>
                  <th>Share of days</th>
                  <th>Births vs expected</th>
                </tr>
              </thead>
              <tbody>
                {PHASES.map((p) => {
                  const diff = ((p.births / p.days - 1) * 100).toFixed(1);
                  return (
                    <tr key={p.phase}>
                      <td className="strong">{p.phase}</td>
                      <td className="num">{p.births.toFixed(2)}%</td>
                      <td>{p.days.toFixed(2)}%</td>
                      <td>{Number(diff) > 0 ? "+" : ""}{diff}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Eight 45° phase bins by Sun–Moon elongation. Source: <Cite source="bc" />.
          </p>

          {/* ── BIRTH TIME ── */}
          <section className="prose">
            <h2 className="sec" id="birth-time">
              Birth time statistics <em>(and why they shape your chart)</em>
            </h2>
            <p>
              Your Rising sign and houses depend on your birth time, and in the US birth times are far
              from random. CDC birth-certificate data for 2013 shows{" "}
              <strong>the 8 a.m. hour is the most common time to be born (6.3% of births)</strong>,
              followed by noon (6.0%). Every hour from midnight through 6:59 a.m. has fewer than 3%. The
              8 a.m. spike comes mostly from scheduled cesareans: 11.6% of C-section births happen in
              that single hour (<Cite source="cdc" />).
            </p>
            <p>
              This has an astrological side effect. Six in ten Americans are born between 6 a.m. and 6
              p.m., when the Sun is typically above the horizon, so most US birth charts have the Sun
              in the upper half of the chart (houses 7–12). Weighting by real birth times also shifts
              the Rising distribution slightly toward Leo and Virgo compared with a uniform-clock
              assumption (<Cite source="bc" />).
            </p>
          </section>
          <StatGrid stats={TIME_STATS} />

          {/* ── INTEREST ── */}
          <section className="prose">
            <h2 className="sec" id="interest">
              Birth chart vs horoscope: <em>where interest is moving</em>
            </h2>
            <p>
              Public interest is moving from sun-sign astrology toward full charts. English Wikipedia
              pageviews give a transparent, verifiable signal. Between Sept 2024–Aug 2025 and Sept
              2025–Aug 2026,{" "}
              <strong>views of the &ldquo;Ascendant&rdquo; (rising sign) article rose 67%</strong> and
              views of &ldquo;Horoscope&rdquo;, the article on the birth chart itself, rose 10%. Over the
              same period, the &ldquo;Astrological sign&rdquo; (sun sign) article fell 36% and
              &ldquo;Astrology&rdquo; fell 19% (<Cite source="wiki" />).
            </p>
            <p>
              Wikipedia traffic overall has been under pressure from AI search summaries, which makes the
              growth in chart-specific articles stand out more. The same shift shows up in survey data.
              Younger adults use astrology for self-understanding more than for predictions: 31% of
              18–34-year-olds turn to horoscopes to understand their lives, versus 11% of those 55 and
              older (<Cite source="ipsos2019" />).
            </p>
          </section>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Wikipedia article</th>
                  <th>Views Sep 2024–Aug 2025</th>
                  <th>Views Sep 2025–Aug 2026</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {WIKI_ROWS.map((r) => {
                  const ch = Math.round((r.y2 / r.y1 - 1) * 100);
                  return (
                    <tr key={r.article}>
                      <td className="strong">{r.article}</td>
                      <td>{r.y1.toLocaleString("en-US")}</td>
                      <td>{r.y2.toLocaleString("en-US")}</td>
                      <td className="num">{ch > 0 ? "+" : ""}{ch}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="tbl-note">
            Source: <Cite source="wiki" />, user (non-bot) traffic, all platforms.
          </p>
          <StatGrid stats={INTEREST_STATS} />
          <div className="pending">
            <strong>Data pending: absolute Google search volumes.</strong> Our keyword-volume data
            provider was unavailable for this update, and Google Trends only reports relative interest
            (0–100), which can&apos;t be compared across separate queries. We&apos;ll add verified
            monthly volumes for &ldquo;birth chart&rdquo;, &ldquo;natal chart&rdquo;, &ldquo;rising
            sign&rdquo; and &ldquo;moon sign&rdquo; in the next update rather than repeat unsourced figures.
          </div>

          {/* ── READINGS ── */}
          <section className="prose">
            <h2 className="sec" id="readings">
              Birth chart reading habits <em>&amp; satisfaction</em>
            </h2>
            <p>
              28% of US adults consult astrology or a horoscope at least once a year, but few treat it
              as a decision-making tool. Only 1% rely on astrology, tarot or fortune tellers &ldquo;a
              lot&rdquo; for major decisions, and 20% say they engage mostly for fun (
              <Cite source="pew2025" />). About half of people who know their sign (53%) say they identify
              with its description (<Cite source="ipsos2019" />). Some of the other half may relate more
              to their Moon or Rising, which is the case for going beyond a sun-sign horoscope.
            </p>
            <p>
              On satisfaction, there&apos;s no independent survey of birth chart reading satisfaction that
              we could verify. The closest public proxy is app store ratings, and the leading
              chart-based apps score highly: Co–Star at 4.8 stars from 206K ratings, CHANI at 4.9 from 59K
              (<Cite source="appstore" />). Our <a href="/astrology-app-alternatives">astrology app
              comparison</a> covers what each one actually includes.
            </p>
          </section>
          <StatGrid stats={SATISFACTION_STATS} />
          <div className="pending">
            <strong>Data pending: reading satisfaction surveys.</strong> Figures like &ldquo;X% of people
            found their reading accurate&rdquo; circulate widely but usually come from vendors&apos; own
            unpublished polls. We&apos;ll add this section when a survey with published methodology is
            available.
          </div>

          {/* ── RESEARCH ── */}
          <section className="prose">
            <h2 className="sec" id="research">
              What research says about <em>birth chart accuracy</em>
            </h2>
            <p>
              Birth chart interpretation has been tested in controlled studies several times. The
              best-known is Shawn Carlson&apos;s double-blind experiment, published in <em>Nature</em> in
              1985. Astrologers helped design the protocol and agreed on the success criteria in advance.
              When 28 astrologers tried to match 116 natal charts to personality profiles, they performed
              no better than chance (<Cite source="carlson" />).
            </p>
            <p>
              Geoffrey Dean and Ivan Kelly studied 2,101 people born in London between 3 and 9 May 1958,
              many of them minutes apart and so with near-identical charts. They measured over 100
              characteristics astrologers say a chart reveals, including occupation, anxiety,
              sociability, IQ and artistic ability. They found no similarities between these
              &ldquo;time twins&rdquo; (<Cite source="deankelly" />). In a 2008 study, 52 students could
              pick out their real personality-test profile from a decoy but couldn&apos;t do the same with
              descriptions generated from their natal charts (<Cite source="wymanvyse" />).
            </p>
            <p>
              Astrologers have published reanalyses disputing parts of these results, particularly
              Carlson&apos;s. We report the published findings as they stand. At BluntChart, we treat
              astrology as a lens for self-reflection, not a scientific instrument.
            </p>
          </section>
          <StatGrid stats={RESEARCH_STATS} />

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
              <strong>Births.</strong> We used the Social Security Administration&apos;s daily US birth
              counts for January 1, 2000 through December 31, 2014 (62,187,024 births, 5,479 days) as
              published by FiveThirtyEight (<Cite source="ssa" />).
            </p>
            <p>
              <strong>Birth times.</strong> Daily counts don&apos;t include time of birth, so we split each
              day&apos;s births across 24 hours using the CDC/NCHS 2013 hour-of-birth distribution.
              Weekdays and weekends were weighted separately, and each birth was placed at the middle of
              its hour (<Cite source="cdc" />). This assumes the 2013 hourly pattern holds across
              2000–2014, which is a simplification.
            </p>
            <p>
              <strong>Location.</strong> All charts were cast for the 2020 US mean center of population
              near Hartville, Missouri (37.4°N, 92.4°W) (<Cite source="census" />). We used US Central
              Time with daylight saving rules as they applied in each year (the pre-2007 and post-2007
              schedules). A single location is an approximation. Births in northern states skew further
              toward Leo–Scorpio Rising and births in southern states skew less, as the latitude table
              shows.
            </p>
            <p>
              <strong>Positions.</strong> Tropical Sun, Moon, Mercury and Venus longitudes and the
              Ascendant were computed with the open-source astronomy-engine library (
              <Cite source="astronomy" />). The Ascendant uses local apparent sidereal time and an
              obliquity of 23.4393°. Retrograde status and moon phase were evaluated once per day at local
              noon. Sun signs use exact ingress times, so they differ slightly from calendar-date tables.
            </p>
            <p>
              <strong>Other data.</strong> Survey figures come from Pew Research Center and Ipsos.
              Interest data comes from the Wikimedia Pageviews API. App ratings come from public US App
              Store listings viewed in September 2026. Research findings come from the peer-reviewed
              papers listed below. Where we couldn&apos;t verify a number from a primary source, we
              marked it &ldquo;Data pending&rdquo; instead.
            </p>
            <div className="cite-box">
              <strong style={{ color: "var(--white)" }}>How to cite this page:</strong>
              <br />
              <code>BluntChart. &ldquo;Birth Chart Statistics: Data on Readings, Popularity &amp; Trends.&rdquo; Updated {UPDATED_LABEL}. {PAGE_URL}</code>
            </div>
            <ol>
              {Object.values(SOURCES).map((s) => (
                <li key={s.url + s.short}>
                  {s.name}{" "}
                  {s.url.startsWith(PAGE_URL) ? null : (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
                  )}
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
              <div className="related-card-desc">See where your Sun, Moon and Rising land in the rankings.</div>
            </a>
            <a className="related-card" href="/rising-sign-calculator">
              <div className="related-card-title">Rising Sign Calculator</div>
              <div className="related-card-desc">Find out if you&apos;re a common Leo or a rare Pisces Rising.</div>
            </a>
            <a className="related-card" href="/moon-sign-calculator">
              <div className="related-card-title">Moon Sign Calculator</div>
              <div className="related-card-desc">Your emotional wiring, from your birth date and time.</div>
            </a>
            <a className="related-card" href="/astrology-statistics">
              <div className="related-card-title">Astrology Statistics 2026</div>
              <div className="related-card-desc">Belief rates, market size and app data, all sourced.</div>
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
