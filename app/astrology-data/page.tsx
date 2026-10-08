import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Crumbs, PageHeader, Section, P, Cite, StatList, Table, LinkList, Faq, SourceList,
  PageFoot, faqJsonLd, breadcrumbJsonLd, type Stat,
} from "@/components/stats/StatsUI";
import { S, DATA_HUB_URL as PAGE_URL, ASTROLOGY_STATS_URL, BIRTH_CHART_STATS_URL } from "@/lib/stats-sources";

const UPDATED_ISO = "2026-10-07";
const UPDATED_LABEL = "October 7, 2026";
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
    title: "Astrology Statistics 2026: 50+ Facts, Trends & Market Data",
    desc: "Belief rates by demographic, market size, the most common zodiac signs, apps and online communities.",
    meta: "Updated October 7, 2026 · 18 sources",
  },
  {
    href: "/astrology-data/birth-chart-statistics",
    title: "Birth Chart Statistics: Data on Readings, Popularity & Trends",
    desc: "Original research: the most common Rising signs and Big Three combinations from 62 million US births.",
    meta: "Updated October 7, 2026 · original dataset",
  },
];

const UPCOMING = ["Zodiac sign statistics", "Saturn return statistics", "Astrology app statistics"];

const HEADLINES: Stat[] = [
  { value: "27%", label: "of US adults believe in astrology", source: S.pew2025 },
  { value: "24–28%", label: "of Americans have said they believe in astrology in every Gallup poll since 1990", source: S.gallup2025 },
  { value: "43%", label: "of US women aged 18–49 believe in astrology", source: S.pew2025 },
  { value: "45%", label: "of adults in India consult a horoscope or fortune teller to see the future", source: S.pewGlobal },
  { value: "Cancer", label: "is the most common US zodiac sign (9.00% of births)", source: S.bcZodiac },
  { value: "Leo", label: "is the most common US Rising sign (10.53%), twice as common as Pisces Rising", source: S.bcChart },
];

const TREND = [
  { year: "1990", value: "25%", source: S.gallup2005, poll: "Gallup" },
  { year: "1996", value: "25%", source: S.gallup2005, poll: "Gallup" },
  { year: "2001", value: "28%", source: S.gallup2005, poll: "Gallup" },
  { year: "2005", value: "25%", source: S.gallup2005, poll: "Gallup" },
  { year: "2017", value: "29%", source: S.pew2025, poll: "Pew Research Center" },
  { year: "2022", value: "27%", source: S.yougov2022, poll: "YouGov" },
  { year: "2024", value: "27%", source: S.pew2025, poll: "Pew Research Center" },
  { year: "2025", value: "24%", source: S.gallup2025, poll: "Gallup" },
];

const VISIBILITY: Stat[] = [
  { value: "20M+", label: "Co–Star downloads by 2021, four years after launch", source: S.axios2021 },
  { value: "2.1M", label: "members in Reddit’s r/astrology (September 2026)", source: S.redditlist },
  { value: "+20%", label: "astrology app market growth from 2025 to 2026 ($4.73B to $5.69B)", source: S.tbrc },
  { value: "31% vs 11%", label: "of 18–34s vs over-55s use horoscopes to understand their lives", source: S.ipsos2019 },
];

const WORLD = [
  { place: "South Africa", value: "47%", measure: "consult a fortune teller or horoscope", source: S.pewGlobal },
  { place: "India", value: "45%", measure: "consult a fortune teller or horoscope", source: S.pewGlobal },
  { place: "United States", value: "27%", measure: "believe in astrology", source: S.pew2025 },
  { place: "United States", value: "~9%", measure: "consult a fortune teller or horoscope (cross-national question)", source: S.pewGlobal },
  { place: "Great Britain", value: "20%", measure: "say star signs say something useful about people", source: S.yougovUK2015 },
  { place: "Great Britain", value: "8%", measure: "believe horoscopes can predict the future", source: S.yougovUK2015 },
  { place: "Greece", value: "4%", measure: "consult a fortune teller or horoscope (lowest of 35 countries)", source: S.pewGlobal },
];

const DATASETS = [
  { href: "/data/us-births-by-zodiac-sign-2000-2014.csv", title: "US births by zodiac sign, 2000–2014", desc: "Births and share per sign for 62.2M US births, using calendar dates and exact Sun ingress.", meta: "CSV · 12 rows" },
  { href: "/data/us-sun-moon-rising-distribution-2000-2014.csv", title: "Sun, Moon and Rising sign distribution", desc: "Share of US births under each Sun, Moon and Rising sign, weighted by CDC birth times.", meta: "CSV · 12 rows" },
  { href: "/data/us-big-three-combinations-2000-2014.csv", title: "All 1,728 Big Three combinations, ranked", desc: "Every Sun–Moon–Rising combination with share, estimated births and “1 in N” odds.", meta: "CSV · 1,728 rows" },
  { href: "/data/rising-sign-share-by-latitude.csv", title: "Rising sign share by latitude", desc: "How often each sign rises at 25°N to 48°N.", meta: "CSV · 12 rows" },
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
          { "@type": "Article", name: REPORTS[0].title, url: ASTROLOGY_STATS_URL },
          { "@type": "Article", name: REPORTS[1].title, url: BIRTH_CHART_STATS_URL },
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

      <Crumbs items={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data" }]} />
      <PageHeader
        kicker="Data hub"
        title="Astrology Data & Statistics"
        lede="Sourced statistics on who believes in astrology and why, original research on 62 million US birth charts, and free datasets. Every number links to where it came from."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        meta={`${REPORTS.length} reports · ${DATASETS.length} datasets`}
      />

      <Section id="reports" title="Reports">
        <LinkList items={REPORTS} />
        <p className="sx-note">Coming soon: {UPCOMING.join(" · ")}.</p>
      </Section>

      <Section id="headlines" title="Headline numbers">
        <StatList stats={HEADLINES} />
      </Section>

      <Section id="popularity" title="Is astrology becoming more popular?" answer="Belief isn’t growing. About 1 in 4 Americans has believed in astrology for 35 years. Visibility is what has grown.">
        <Table note="Share of US adults who say they believe in astrology. Pollsters word the question slightly differently, so treat small differences as noise.">
          <thead><tr><th>Year</th><th>Believe</th><th>Poll</th></tr></thead>
          <tbody>
            {TREND.map((t) => (
              <tr key={t.year}>
                <td className="b">{t.year}</td>
                <td className="n">{t.value}</td>
                <td><Cite source={{ ...t.source, short: t.poll }} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <P>
          What changed is how visible astrology is, and how much money it makes. Apps, Reddit and
          social media made it more public. They don’t appear to have created many new believers.
        </P>
        <StatList stats={VISIBILITY} />
      </Section>

      <Section id="world" title="How many people believe in astrology around the world?" answer="It varies widely: nearly half of adults in South Africa and India consult horoscopes, versus 4% in Greece.">
        <Table note="Surveys ask different questions; compare within a source, not across them.">
          <thead><tr><th>Country</th><th>Share</th><th>Measure</th><th>Source</th></tr></thead>
          <tbody>
            {WORLD.map((w) => (
              <tr key={w.place + w.measure}>
                <td className="b">{w.place}</td>
                <td className="n">{w.value}</td>
                <td>{w.measure}</td>
                <td><Cite source={w.source} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="datasets" title="Free astrology datasets" answer="Original datasets built from 62.2 million US births. Free to use under CC BY 4.0.">
        <LinkList items={DATASETS} />
        <P>
          Built from Social Security Administration birth counts (<Cite source={S.ssa} />) and CDC
          hour-of-birth data (<Cite source={S.cdc} />). The full method is in the{" "}
          <a href="/astrology-data/birth-chart-statistics#sources">birth chart statistics</a> report.
          Please credit “BluntChart” with a link to this page.
        </P>
      </Section>

      <Section id="faq" title="FAQ">
        <Faq items={FAQS} />
      </Section>

      <SourceList sources={SOURCES} citeAs={`BluntChart. “Astrology Data & Statistics.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
        <P>
          <strong>Our standards:</strong> we cite primary sources (survey organisations, government data,
          peer-reviewed papers and company filings) and name the source next to every figure. We never
          publish an unverified number. Where good data doesn’t exist, we mark it “Data pending”. Reports
          are reviewed and dated each time they change.
        </P>
      </SourceList>

      <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} inHub={false} />
    </StatsPage>
  );
}
