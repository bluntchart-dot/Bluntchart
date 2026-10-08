import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, Cite, StatTiles, Figure, BarChart, Pending, Cta, Cards, Faq,
  SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, ASTROLOGY_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-09-29";
const UPDATED_ISO = "2026-10-08";
const UPDATED_LABEL = "October 8, 2026";
const TITLE = "Astrology Statistics 2026: 50+ Facts, Trends & Market Data";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "50+ sourced astrology statistics for 2026: belief rates (Pew, Gallup, YouGov), market size, the most common zodiac signs from 62M US births, astrology app data, and Reddit growth. Every stat cited.",
  keywords: [
    "astrology statistics", "astrology statistics 2026", "astrology facts", "how many people believe in astrology",
    "how many americans believe in astrology", "astrology market size", "astrology app market", "most common zodiac sign",
    "astrology believers statistics", "astrology demographics", "astrology popularity statistics",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: "Belief rates, market size, most common zodiac signs and astrology app data, with every number sourced.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology Statistics 2026: 50+ Sourced Facts",
    description: "27% of US adults believe in astrology. 43% of women 18–49 do. Cancer is the most common US zodiac sign.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const KEY: Stat[] = [
  { value: "27%", label: "of US adults say they believe in astrology", source: S.pew2025, icon: "users" },
  { value: "28%", label: "consult astrology or a horoscope at least once a year", source: S.pew2025, icon: "moon" },
  { value: "43%", label: "of US women aged 18–49 believe in astrology", source: S.pew2025, icon: "users" },
  { value: "88%", label: "of Americans know their zodiac sign", source: S.ipsos2019, icon: "star" },
  { value: "Cancer", label: "is the most common US zodiac sign, at 9.00% of births", source: S.bcZodiac, icon: "sun" },
  { value: "$15.2B", label: "estimated global astrology market in 2025", source: S.mrfr, icon: "coins" },
];

const BELIEF: Stat[] = [
  { value: "27%", label: "believe in astrology (Oct 2024), statistically unchanged from 29% in 2017", source: S.pew2025 },
  { value: "24%", label: "believe in Gallup’s May 2025 poll; 55% don’t and about 20% are unsure", source: S.gallup2025 },
  { value: "20%", label: "engage with astrology, tarot or fortune telling mostly “just for fun”", source: S.pew2025 },
  { value: "1%", label: "rely “a lot” on these practices when making major life decisions", source: S.pew2025 },
];

const BELIEVE_BY_GROUP = [
  { label: "Adults under 30", value: 37 },
  { label: "Hispanic Americans", value: 32 },
  { label: "Black Americans", value: 31 },
  { label: "Catholics", value: 31 },
  { label: "Women", value: 30 },
  { label: "All US adults", value: 27 },
  { label: "Men", value: 25 },
  { label: "White Americans", value: 25 },
  { label: "Protestants", value: 22 },
  { label: "Adults 65+", value: 16 },
  { label: "Atheists", value: 10 },
];

const CONSULT_BY_GROUP = [
  { label: "LGBT adults", value: 54 },
  { label: "Women 18–49", value: 46 },
  { label: "All women", value: 37 },
  { label: "All US adults", value: 28 },
];

const ZODIAC = [
  { sign: "Cancer", share: 9.0 }, { sign: "Virgo", share: 8.96 }, { sign: "Leo", share: 8.88 },
  { sign: "Gemini", share: 8.47 }, { sign: "Libra", share: 8.41 }, { sign: "Taurus", share: 8.3 },
  { sign: "Scorpio", share: 8.22 }, { sign: "Pisces", share: 8.12 }, { sign: "Sagittarius", share: 8.08 },
  { sign: "Aquarius", share: 8.04 }, { sign: "Aries", share: 8.01 }, { sign: "Capricorn", share: 7.5 },
];

const MARKET: Stat[] = [
  { value: "$15.16B", label: "global astrology market in 2025, projected to reach $27.15B by 2035", source: S.mrfr, icon: "coins" },
  { value: "~45%", label: "of the global market is in North America", source: S.mrfr, icon: "globe" },
  { value: "$5.69B", label: "astrology app market in 2026, projected to reach $11.71B by 2030", source: S.tbrc, icon: "phone" },
  { value: "$2.3B", label: "US psychic services revenue in 2025 (astrology, tarot, mediumship)", source: S.ibis, icon: "chart" },
  { value: "+85%", label: "Astrotalk (India) FY25 revenue growth, to ₹1,214 crore", source: S.astrotalk, icon: "trend" },
  { value: "$7.11B", label: "an alternative 2025 app-market estimate, projected to $13.48B by 2032", source: S.markntel, icon: "coins" },
];

const APP_RATINGS = [
  { label: "Co–Star", value: 206, display: "206K", tip: "Co–Star: 206K ratings · 4.8 stars" },
  { label: "Nebula", value: 171, display: "171K", tip: "Nebula: 171K ratings · 4.6 stars" },
  { label: "CHANI", value: 59, display: "59K", tip: "CHANI: 59K ratings · 4.9 stars" },
  { label: "The Pattern", value: 15, display: "15K", tip: "The Pattern: 15K ratings · 4.0 stars" },
];

const APP_STATS: Stat[] = [
  { value: "20M+", label: "Co–Star downloads by April 2021", source: S.axios2021, icon: "download" },
  { value: "1 in 4", label: "US women aged 18–25 had downloaded Co–Star by 2021, per the company", source: S.axios2021, icon: "users" },
  { value: "$15M", label: "Co–Star Series A led by Spark Capital (2021)", source: S.axios2021, icon: "coins" },
  { value: "$5.2M", label: "Co–Star seed round (2019)", source: S.techcrunch2019, icon: "coins" },
  { value: "Top 2", label: "CHANI and Co–Star led US astrology apps by revenue in Q1 2026", source: S.statista2026, icon: "star" },
];

const HABITS: Stat[] = [
  { value: "53%", label: "of people who know their sign say they identify with it", source: S.ipsos2019 },
  { value: "31% vs 11%", label: "of 18–34s vs over-55s use horoscopes to understand their lives", source: S.ipsos2019 },
  { value: "32%", label: "of horoscope users use them to check relationship compatibility", source: S.ipsos2019 },
  { value: "5%", label: "of Americans check their horoscope often", source: S.ipsos2019 },
];

const SOCIAL: Stat[] = [
  { value: "2.1M", label: "r/astrology subscribers in September 2026", source: S.redditlist, icon: "message" },
  { value: "Feb 2025", label: "the month r/astrology passed 2 million subscribers", source: S.redditlist, icon: "trend" },
  { value: "+75K", label: "r/astrology’s biggest single month of growth (January 2025)", source: S.redditlist, icon: "users" },
];

const SCIENCE = [
  { label: "Not at all scientific", value: 60 },
  { label: "Sort of scientific", value: 29 },
  { label: "Very scientific", value: 8 },
];

const SCIENCE_STATS: Stat[] = [
  { value: "54%", label: "of 18–24-year-olds rejected astrology as unscientific, the lowest of any age group", source: S.nsf2018 },
  { value: "76% vs 57%", label: "of college graduates vs high-school graduates called it unscientific", source: S.nsf2018 },
];

const WORLD = [
  { label: "South Africa", value: 47 },
  { label: "India", value: 45 },
  { label: "United States", value: 9, display: "~9%" },
  { label: "Greece", value: 4 },
];

const FAQS = [
  { q: "What percentage of Americans believe in astrology?", a: "27% of US adults say they believe in astrology, according to a Pew Research Center survey of 9,593 adults in October 2024. Gallup measured 24% in May 2025. Both are in line with the roughly 1 in 4 that Gallup has recorded since 1990." },
  { q: "Who is most likely to believe in astrology?", a: "Younger women and LGBT adults. Pew found 43% of women aged 18–49 believe in astrology, and 54% of LGBT adults consult astrology at least once a year. YouGov found belief falls from 37% of adults under 30 to 16% of adults 65 and older." },
  { q: "How big is the astrology market?", a: "Market Research Future estimates the global astrology market at $15.16 billion in 2025, growing to $27.15 billion by 2035. The Business Research Company sizes astrology apps alone at $5.69 billion in 2026. Estimates vary because firms define the market differently." },
  { q: "What is the most common zodiac sign?", a: "Cancer, at 9.00% of 62.2 million US births from 2000–2014 (SSA data, calendar-date sign boundaries), followed by Virgo (8.96%) and Leo (8.88%). Using the Sun's exact ingress times instead, Leo, Virgo and Cancer are nearly tied." },
  { q: "What is the rarest zodiac sign?", a: "Capricorn, at 7.50% of US births from 2000–2014. Its season includes Christmas and New Year's Day, the least common birthdays in the US, because fewer deliveries are scheduled on holidays." },
  { q: "Do people make decisions based on astrology?", a: "Rarely. Pew found only 1% of US adults rely a lot on astrology, tarot or fortune tellers for major life decisions. 20% say they engage mostly for fun." },
  { q: "How many people use astrology apps?", a: "Co–Star reported more than 20 million downloads by April 2021. In September 2026 on the US App Store, Co–Star had 206K ratings, Nebula 171K, CHANI 59K and The Pattern 15K." },
];

const SOURCES = [
  S.pew2025, S.gallup2025, S.gallup2005, S.yougov2022, S.ipsos2019, S.nsf2018, S.pewGlobal, S.ssa,
  S.mrfr, S.tbrc, S.markntel, S.ibis, S.astrotalk, S.appstore, S.techcrunch2019, S.axios2021, S.statista2026, S.redditlist,
];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function AstrologyStatisticsPage() {
  return (
    <StatsPage>
      <JsonLd data={articleJsonLd({
        headline: TITLE,
        description: "Sourced astrology statistics covering belief rates, demographics, market size, zodiac sign birth frequencies, apps and online communities.",
        url: PAGE_URL, iso: UPDATED_ISO, published: PUBLISHED_ISO, citations: SOURCES.map((s) => s.url),
      })} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: DATA_HUB_URL },
        { name: "Astrology Statistics", url: PAGE_URL },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Dataset",
        name: "US births by zodiac sign, 2000–2014",
        description: "Share of 62,187,024 US births (SSA, 2000–2014) under each tropical zodiac sign, aggregated by BluntChart.",
        url: `${PAGE_URL}#zodiac-births`, creator: { "@type": "Organization", name: "BluntChart" },
        isBasedOn: S.ssa.url, temporalCoverage: "2000/2014", spatialCoverage: "United States",
        license: "https://creativecommons.org/licenses/by/4.0/",
        distribution: { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://bluntchart.com/data/us-births-by-zodiac-sign-2000-2014.csv" },
      }} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Astrology Statistics" }]}
        kicker="Report"
        title={TITLE}
        lede="How many people believe in astrology, who they are, how big the industry is, and which zodiac sign is most common. Every number links to its original source."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "book", text: `${SOURCES.length} sources` }, { icon: "chart", text: "50+ statistics" }]}
      />

      <Body toc={[
        { id: "key", label: "Key statistics" },
        { id: "belief", label: "How many people believe" },
        { id: "demographics", label: "Belief by demographic" },
        { id: "zodiac-births", label: "Most common zodiac signs" },
        { id: "market", label: "Market size" },
        { id: "apps", label: "Astrology apps" },
        { id: "habits", label: "Horoscope habits" },
        { id: "social", label: "Online communities" },
        { id: "science", label: "Is it seen as scientific?" },
        { id: "global", label: "Around the world" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="key" icon="star" title="Key statistics">
          <StatTiles stats={KEY} highlightFirst />
        </Section>

        <Section id="belief" icon="users" title="How many people believe in astrology?"
          answer={<><b>About 1 in 4</b> US adults: 27% in Pew’s 2024 survey and 24% in Gallup’s 2025 poll.</>}>
          <StatTiles stats={BELIEF} />
          <P>
            Belief has barely moved despite the rise of astrology apps. Gallup recorded 25% in 1990 and 28% in
            2001 (<Cite source={S.gallup2005} />). See the full <a href="/astrology-data#popularity">35-year trend</a>.
          </P>
        </Section>

        <Section id="demographics" icon="users" title="Astrology belief by demographic"
          answer={<>Age and gender matter most. <b>Younger adults, women and LGBT adults</b> are the most engaged.</>}>
          <Figure title="Who believes in astrology" subtitle="Share of each group who say they believe in astrology, US, 2022." sources={[S.yougov2022]}>
            <BarChart label="Belief in astrology by group" rows={BELIEVE_BY_GROUP} max={40} ticks={[0, 20, 40]} highlight={["All US adults"]} />
          </Figure>
          <Figure title="Who consults astrology" subtitle="Share who consult astrology or a horoscope at least once a year, US, 2024." sources={[S.pew2025]}>
            <BarChart label="Yearly astrology use by group" rows={CONSULT_BY_GROUP} max={60} ticks={[0, 30, 60]} highlight={["All US adults"]} />
          </Figure>
        </Section>

        <Section id="zodiac-births" icon="sun" title="What is the most common zodiac sign?"
          answer={<><b>Cancer</b>, at 9.00% of US births. Capricorn is the rarest, at 7.50%.</>}>
          <Figure
            title="US births by zodiac sign, 2000–2014"
            subtitle="62,187,024 births grouped by the standard calendar dates for each sign."
            sources={[S.ssa, S.bcZodiac]}
            note={<a href="/data/us-births-by-zodiac-sign-2000-2014.csv" download>Download CSV</a>}
          >
            <BarChart label="Share of US births by zodiac sign" max={10} ticks={[0, 5, 10]} highlight={["Cancer"]}
              rows={ZODIAC.map((z) => ({ label: z.sign, value: z.share, href: `/sun-in-${z.sign.toLowerCase()}` }))} />
          </Figure>
          <P>
            The signs are close: every sign holds between 7.5% and 9.0% of births. Summer signs lead because
            July, August and September are the busiest birth months. Capricorn trails because its season
            includes Christmas and New Year’s Day, the two least common birthdays. Using exact Sun ingress
            times instead, Leo, Virgo and Cancer are nearly tied (see{" "}
            <a href="/astrology-data/birth-chart-statistics#sun">birth chart statistics</a>).
          </P>
        </Section>

        <Section id="market" icon="coins" title="Astrology market size"
          answer={<>Roughly <b>$15 billion</b> globally in 2025. Apps are the fastest-growing part.</>}>
          <StatTiles stats={MARKET} />
          <P>Research firms define “the astrology market” differently, so always cite the firm along with the number.</P>
        </Section>

        <Section id="apps" icon="phone" title="Astrology app statistics"
          answer={<><b>Co–Star</b> is the most-downloaded astrology app. CHANI and Co–Star led US revenue in Q1 2026.</>}>
          <Figure title="App Store ratings count, US" subtitle="Number of ratings, a rough proxy for each app’s user base. Hover for star rating." sources={[S.appstore]}>
            <BarChart label="App Store ratings: Co–Star 206K, Nebula 171K, CHANI 59K, The Pattern 15K" rows={APP_RATINGS} max={220} format={(v) => `${v}K`} />
          </Figure>
          <StatTiles stats={APP_STATS} />
          <P>Compare features in our <a href="/astrology-app-alternatives">astrology app guide</a>.</P>
        </Section>

        <Cta
          title="You’re one of the 88% who know their sign."
          text="Your Moon and Rising say more. Get the full chart, calculated from your exact birth time."
          href="/free-birth-chart"
          label="Free birth chart"
        />

        <Section id="habits" icon="moon" title="Zodiac sign and horoscope habits"
          answer={<><b>88%</b> of Americans know their sign, but only about half identify with it.</>}>
          <StatTiles stats={HABITS} />
        </Section>

        <Section id="social" icon="message" title="Astrology online communities"
          answer={<>Reddit’s r/astrology has <b>more than 2.1 million</b> members.</>}>
          <StatTiles stats={SOCIAL} />
          <Pending title="TikTok and Instagram">
            Hashtag view counts are widely quoted, but TikTok no longer shows them consistently and we couldn’t
            verify a current figure from a primary source.
          </Pending>
        </Section>

        <Section id="science" icon="flask" title="Do people think astrology is scientific?"
          answer={<>Most don’t: <b>60%</b> of Americans called it “not at all scientific” in 2016.</>}>
          <Figure title="Is astrology scientific?" subtitle="US adults, 2016 General Social Survey." sources={[S.nsf2018]}>
            <BarChart label="Not at all scientific 60%, sort of scientific 29%, very scientific 8%" rows={SCIENCE} max={100} ticks={[0, 50, 100]} />
          </Figure>
          <StatTiles stats={SCIENCE_STATS} />
        </Section>

        <Section id="global" icon="globe" title="Astrology around the world"
          answer={<>Use is highest in <b>South Africa and India</b> and lowest in Greece.</>}>
          <Figure title="Adults who consult a fortune teller or horoscope" subtitle="Same question asked in 35 countries. Selected countries shown." sources={[S.pewGlobal]}>
            <BarChart label="South Africa 47%, India 45%, United States about 9%, Greece 4%" rows={WORLD} max={50} ticks={[0, 25, 50]} highlight={["South Africa", "India"]} />
          </Figure>
          <P>
            This cross-national question covers fortune tellers and horoscopes together, so the US figure here
            (~9%) is lower than the US-only survey above.
          </P>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. “${TITLE}.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            We use primary sources (survey organisations, government data, company announcements and public app
            listings) over secondary roundups. Market sizes come from commercial research firms. We quote their
            published headline numbers and name the firm. Zodiac births sum SSA daily counts for 2000–2014 into
            signs using conventional start dates (Aquarius Jan 20, Pisces Feb 19, Aries Mar 21, Taurus Apr 20,
            Gemini May 21, Cancer Jun 21, Leo Jul 23, Virgo Aug 23, Libra Sep 23, Scorpio Oct 23, Sagittarius
            Nov 22, Capricorn Dec 22). Anything we couldn’t verify is marked “Data pending”.
          </P>
        </SourceList>

        <Section icon="layers" title="Related">
          <Cards items={[
            { href: HUB_PATH, icon: "database", title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
            { href: "/astrology-data/birth-chart-statistics", icon: "sunrise", title: "Birth chart statistics", desc: "The most common Rising signs and Big Three combinations." },
            { href: "/big-three-calculator", icon: "star", title: "Big Three calculator", desc: "Find your Sun, Moon and Rising signs." },
          ]} />
        </Section>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
      </Body>
    </StatsPage>
  );
}
