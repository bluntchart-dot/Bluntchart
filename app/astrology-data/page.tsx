import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, StatTiles, Figure, BarChart, ColumnChart, Cards, Faq, SourceList,
  PageFoot, faqJsonLd, breadcrumbJsonLd, type Stat,
} from "@/components/stats/StatsUI";
import { S, DATA_HUB_URL as PAGE_URL, ASTROLOGY_STATS_URL, BIRTH_CHART_STATS_URL } from "@/lib/stats-sources";

const UPDATED_ISO = "2026-10-08";
const UPDATED_LABEL = "October 8, 2026";
const TITLE = "Astrology Data & Statistics: Research, Surveys and Free Datasets";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "BluntChart’s astrology data hub: sourced statistics on who believes in astrology, 35 years of belief trends, global data, original research on 62M US birth charts, and free CSV datasets.",
  keywords: [
    "astrology data", "astrology statistics", "astrology research", "astrology dataset", "astrology research studies",
    "is astrology becoming more popular", "astrology popularity statistics", "how many people believe in astrology",
    "how many people believe in astrology in the world", "astrology believers statistics", "zodiac sign statistics",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Astrology Data & Statistics Hub",
    description: "Sourced astrology statistics, original birth chart research and free datasets, all in one place.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology Data & Statistics Hub",
    description: "1 in 4 Americans believe in astrology, and that hasn’t changed in 35 years. Sourced data and free datasets.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const REPORTS = [
  {
    href: "/astrology-data/astrology-statistics",
    icon: "chart" as const,
    title: "Astrology Statistics 2026",
    desc: "Belief rates by demographic, market size, the most common zodiac signs, apps and online communities.",
    meta: "50+ facts · 18 sources",
  },
  {
    href: "/astrology-data/birth-chart-statistics",
    icon: "sunrise" as const,
    title: "Birth Chart Statistics",
    desc: "Original research: the most common Rising signs and Big Three combinations from 62 million US births.",
    meta: "Original dataset · 62.2M births",
  },
];

const UPCOMING = [
  { icon: "star" as const, title: "Zodiac Sign Statistics", desc: "Popularity, birth rates and search data for all 12 signs.", meta: "Coming soon" },
  { icon: "loop" as const, title: "Saturn Return Statistics", desc: "Age, search trends and life-event data.", meta: "Coming soon" },
  { icon: "phone" as const, title: "Astrology App Statistics", desc: "Downloads, revenue and ratings compared.", meta: "Coming soon" },
];

const HEADLINES: Stat[] = [
  { value: "27%", label: "of US adults say they believe in astrology", source: S.pew2025, icon: "users" },
  { value: "24–28%", label: "of Americans have said they believe in every Gallup poll since 1990", source: S.gallup2025, icon: "trend" },
  { value: "43%", label: "of US women aged 18–49 believe in astrology", source: S.pew2025, icon: "users" },
  { value: "45%", label: "of adults in India consult a horoscope or fortune teller", source: S.pewGlobal, icon: "globe" },
  { value: "Cancer", label: "is the most common US zodiac sign, at 9.00% of births", source: S.bcZodiac, icon: "star" },
  { value: "Leo", label: "is the most common US Rising sign, twice as common as Pisces Rising", source: S.bcChart, icon: "sunrise" },
];

const TREND = [
  { label: "1990", sub: "Gallup", value: 25 },
  { label: "1996", sub: "Gallup", value: 25 },
  { label: "2001", sub: "Gallup", value: 28 },
  { label: "2005", sub: "Gallup", value: 25 },
  { label: "2017", sub: "Pew", value: 29 },
  { label: "2022", sub: "YouGov", value: 27 },
  { label: "2024", sub: "Pew", value: 27 },
  { label: "2025", sub: "Gallup", value: 24 },
];

const VISIBILITY: Stat[] = [
  { value: "20M+", label: "Co–Star downloads by 2021, four years after launch", source: S.axios2021, icon: "phone" },
  { value: "2.1M", label: "members in Reddit’s r/astrology community", source: S.redditlist, icon: "message" },
  { value: "+20%", label: "astrology app market growth, 2025 to 2026", source: S.tbrc, icon: "coins" },
];

const WORLD = [
  { label: "South Africa", value: 47 },
  { label: "India", value: 45 },
  { label: "United States", value: 9, display: "~9%" },
  { label: "Greece", value: 4 },
];

const UK: Stat[] = [
  { value: "20%", label: "of Britons say star signs tell you something useful about people", source: S.yougovUK2015, icon: "users" },
  { value: "8% vs 14%", label: "of Britons vs Americans believe horoscopes can predict the future", source: S.yougovUK2015, icon: "globe" },
];

const DATASETS = [
  { href: "/data/us-births-by-zodiac-sign-2000-2014.csv", icon: "download" as const, title: "US births by zodiac sign", desc: "Births and share per sign for 62.2M US births (2000–2014), by calendar dates and exact Sun ingress.", meta: "CSV · 12 rows" },
  { href: "/data/us-sun-moon-rising-distribution-2000-2014.csv", icon: "download" as const, title: "Sun, Moon & Rising distribution", desc: "Share of US births under each Sun, Moon and Rising sign, weighted by CDC birth times.", meta: "CSV · 12 rows" },
  { href: "/data/us-big-three-combinations-2000-2014.csv", icon: "download" as const, title: "All 1,728 Big Three combinations", desc: "Every Sun–Moon–Rising combination, ranked, with share and “1 in N” odds.", meta: "CSV · 1,728 rows" },
  { href: "/data/rising-sign-share-by-latitude.csv", icon: "download" as const, title: "Rising sign share by latitude", desc: "How often each sign rises from 25°N to 48°N.", meta: "CSV · 12 rows" },
];

const FAQS = [
  { q: "Is astrology becoming more popular?", a: "Belief hasn’t grown. About 1 in 4 Americans has believed in astrology in every major poll since 1990: 25% (Gallup, 1990), 28% (Gallup, 2001), 29% (Pew, 2017), 27% (Pew, 2024) and 24% (Gallup, 2025). What has grown is how visible and commercial astrology is, through apps like Co–Star (20M+ downloads) and communities like r/astrology (2.1M members)." },
  { q: "How many people believe in astrology?", a: "In the US, 27% of adults say they believe in astrology (Pew Research Center, 2024 survey). Gallup measured 24% in 2025. Belief is highest among younger women: 43% of women aged 18–49." },
  { q: "How many people believe in astrology in the world?", a: "There is no single global figure. Pew’s 35-country survey found that the share of adults who consult a fortune teller or horoscope to see the future ranges from 47% in South Africa and 45% in India down to 4% in Greece." },
  { q: "How many people in the UK believe in astrology?", a: "A 2015 YouGov survey found 8% of Britons believe horoscopes can predict the future, compared with 14% of Americans asked the same question. 20% of Britons said star signs can tell you something useful about people." },
  { q: "Is there a free astrology dataset?", a: "Yes. BluntChart publishes free CSV datasets derived from 62.2 million US births (2000–2014): births by zodiac sign, Sun/Moon/Rising distributions, all 1,728 Big Three combinations and Rising sign share by latitude. They are licensed CC BY 4.0." },
  { q: "Can I cite BluntChart statistics?", a: "Yes. Every figure links to its original source, and our own analyses are free to reuse with a link to the report page. Each report includes a suggested citation." },
];

const SOURCES = [S.gallup2005, S.gallup2025, S.pew2025, S.yougov2022, S.pewGlobal, S.yougovUK2015, S.ipsos2019, S.axios2021, S.redditlist, S.tbrc, S.ssa, S.cdc];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function AstrologyDataHub() {
  return (
    <StatsPage>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Astrology Data & Statistics",
        description: "Sourced astrology statistics, original birth chart research and free datasets from BluntChart.",
        url: PAGE_URL,
        dateModified: `${UPDATED_ISO}T00:00:00+00:00`,
        publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
        hasPart: [
          { "@type": "Article", name: "Astrology Statistics 2026: 50+ Facts, Trends & Market Data", url: ASTROLOGY_STATS_URL },
          { "@type": "Article", name: "Birth Chart Statistics: Data on Readings, Popularity & Trends", url: BIRTH_CHART_STATS_URL },
        ],
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "DataCatalog",
        name: "BluntChart astrology datasets",
        url: `${PAGE_URL}#datasets`,
        creator: { "@type": "Organization", name: "BluntChart" },
        license: "https://creativecommons.org/licenses/by/4.0/",
        dataset: DATASETS.map((d) => ({
          "@type": "Dataset",
          name: d.title,
          description: d.desc,
          license: "https://creativecommons.org/licenses/by/4.0/",
          isBasedOn: S.ssa.url,
          distribution: { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `https://bluntchart.com${d.href}` },
        })),
      }} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: PAGE_URL },
      ])} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data" }]}
        kicker="Data hub"
        kickerIcon="database"
        title="Astrology Data & Statistics"
        lede="Sourced statistics on who believes in astrology and why, original research on 62 million US birth charts, and free datasets. Every number links to where it came from."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "file", text: `${REPORTS.length} reports` }, { icon: "download", text: `${DATASETS.length} free datasets` }, { icon: "book", text: `${SOURCES.length} primary sources` }]}
      />

      <Body toc={[
        { id: "reports", label: "Reports" },
        { id: "headlines", label: "Headline numbers" },
        { id: "popularity", label: "Is astrology getting more popular?" },
        { id: "world", label: "Belief around the world" },
        { id: "datasets", label: "Free datasets" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="reports" icon="file" title="Reports">
          <Cards items={[...REPORTS, ...UPCOMING]} />
        </Section>

        <Section id="headlines" icon="star" title="Headline numbers">
          <StatTiles stats={HEADLINES} highlightFirst />
        </Section>

        <Section id="popularity" icon="trend" title="Is astrology becoming more popular?"
          answer={<>Belief isn’t growing. <b>About 1 in 4 Americans</b> has believed in astrology for 35 years. What grew is how visible it is.</>}>
          <Figure
            title="Share of US adults who believe in astrology, 1990–2025"
            subtitle="Each column is one national poll. Pollsters word the question slightly differently."
            sources={[S.gallup2005, S.pew2025, S.yougov2022, S.gallup2025]}
          >
            <ColumnChart
              label="US belief in astrology by year: 25% in 1990, 25% in 1996, 28% in 2001, 25% in 2005, 29% in 2017, 27% in 2022, 27% in 2024, 24% in 2025"
              max={35}
              highlight={["2025"]}
              cols={TREND.map((t) => ({ ...t, display: `${t.value}%`, tip: `${t.label} · ${t.sub}: ${t.value}%` }))}
            />
          </Figure>
          <P>
            Apps, Reddit and social media made astrology far more visible. They don’t appear to have created
            many new believers.
          </P>
          <StatTiles stats={VISIBILITY} />
        </Section>

        <Section id="world" icon="globe" title="How many people believe in astrology around the world?"
          answer={<>It varies widely: <b>nearly half</b> of adults in South Africa and India consult horoscopes, against 4% in Greece.</>}>
          <Figure
            title="Adults who consult a fortune teller or horoscope to see the future"
            subtitle="Same question asked in 35 countries. Selected countries shown."
            sources={[S.pewGlobal]}
          >
            <BarChart label="South Africa 47%, India 45%, United States about 9%, Greece 4%" rows={WORLD} max={50} ticks={[0, 25, 50]} highlight={["South Africa", "India"]} />
          </Figure>
          <StatTiles stats={UK} />
        </Section>

        <Section id="datasets" icon="database" title="Free astrology datasets"
          answer={<>Original datasets built from <b>62.2 million US births</b>. Free to reuse under CC BY 4.0.</>}>
          <Cards items={DATASETS} />
          <P>
            Built from Social Security Administration birth counts and CDC hour-of-birth data. The full method
            is in the <a href="/astrology-data/birth-chart-statistics#sources">birth chart statistics</a> report.
            Please credit “BluntChart” with a link to this page.
          </P>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. “Astrology Data & Statistics.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            <strong>Our standards:</strong> we cite primary sources (survey organisations, government data,
            peer-reviewed papers and company filings) and name the source next to every figure. We never
            publish an unverified number. Where good data doesn’t exist, we mark it “Data pending”. Reports
            are dated every time they change.
          </P>
        </SourceList>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} inHub={false} />
      </Body>
    </StatsPage>
  );
}
