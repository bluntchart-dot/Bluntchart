import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, Cite, StatTiles, Figure, BarChart, ColumnChart, Table, heat, Pending,
  Cta, Cards, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, BIRTH_CHART_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-09-29";
const UPDATED_ISO = "2026-10-08";
const UPDATED_LABEL = "October 8, 2026";
const TITLE = "Birth Chart Statistics: Data on Readings, Popularity & Trends";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "Original birth chart data from 62M US births: the most common Sun, Moon and Rising signs, the most and least common Big Three combinations, Mercury retrograde births, plus research and interest trends.",
  keywords: [
    "birth chart statistics", "most common rising sign", "rarest rising sign", "most common big three",
    "rarest big three combination", "most common moon sign", "most common sun and moon combination",
    "are birth charts accurate", "birth time statistics", "how rare is my big three", "natal chart statistics",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: "Leo Rising is twice as common as Pisces Rising. 1 in 5 Americans was born during Mercury retrograde. Original data from 62 million US births.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birth Chart Statistics: Sun, Moon & Rising Data From 62M Births",
    description: "The most common Big Three, the rarest Rising sign, and how many people were born under Mercury retrograde.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────
// Computed from SSA 2000–2014 daily births × CDC 2013 hour-of-birth weights at the
// 2020 US center of population. Full tables: /public/data/*.csv

const BC = S.bcChart;

const KEY: Stat[] = [
  { value: "2×", label: "Leo Rising (10.53%) is twice as common as Pisces Rising (5.18%)", source: BC, icon: "sunrise" },
  { value: "1 in 906", label: "people have the most common Big Three: Cancer Sun, Sagittarius Moon, Libra Rising", source: BC, icon: "star" },
  { value: "1 in 4,660", label: "have the rarest: Aries Sun, Leo Moon, Pisces Rising", source: BC, icon: "compass" },
  { value: "19%", label: "of Americans born 2000–2014 were born with Mercury retrograde", source: BC, icon: "loop" },
  { value: "1 in 157", label: "people have the same sign for Sun, Moon and Rising", source: BC, icon: "layers" },
  { value: "8 a.m.", label: "is the most common hour of birth in the US", source: S.cdc, icon: "clock" },
];

type Row = { sign: string; share: number };
const RISING: Row[] = [
  { sign: "Leo", share: 10.53 }, { sign: "Virgo", share: 10.44 }, { sign: "Libra", share: 10.43 },
  { sign: "Scorpio", share: 10.29 }, { sign: "Cancer", share: 9.92 }, { sign: "Sagittarius", share: 9.64 },
  { sign: "Gemini", share: 8.12 }, { sign: "Capricorn", share: 7.88 }, { sign: "Taurus", share: 6.26 },
  { sign: "Aquarius", share: 6.09 }, { sign: "Aries", share: 5.23 }, { sign: "Pisces", share: 5.18 },
];
const MOON: Row[] = [
  { sign: "Aries", share: 8.49 }, { sign: "Taurus", share: 8.47 }, { sign: "Gemini", share: 8.4 },
  { sign: "Pisces", share: 8.4 }, { sign: "Aquarius", share: 8.38 }, { sign: "Cancer", share: 8.37 },
  { sign: "Capricorn", share: 8.33 }, { sign: "Leo", share: 8.29 }, { sign: "Scorpio", share: 8.24 },
  { sign: "Sagittarius", share: 8.24 }, { sign: "Libra", share: 8.19 }, { sign: "Virgo", share: 8.18 },
];
const SUN: Row[] = [
  { sign: "Leo", share: 8.96 }, { sign: "Virgo", share: 8.94 }, { sign: "Cancer", share: 8.85 },
  { sign: "Gemini", share: 8.56 }, { sign: "Libra", share: 8.52 }, { sign: "Taurus", share: 8.29 },
  { sign: "Scorpio", share: 8.18 }, { sign: "Aries", share: 8.15 }, { sign: "Pisces", share: 8.04 },
  { sign: "Sagittarius", share: 7.95 }, { sign: "Aquarius", share: 7.93 }, { sign: "Capricorn", share: 7.64 },
];
const bars = (rows: Row[]) => rows.map((r) => ({ label: r.sign, value: r.share }));

const LAT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const LAT_RISE = [
  { lat: "25°N", place: "Miami", v: [6.24, 7.08, 8.43, 9.44, 9.54, 9.26, 9.26, 9.54, 9.44, 8.44, 7.08, 6.24] },
  { lat: "35°N", place: "Memphis", v: [5.48, 6.44, 8.17, 9.71, 10.17, 10.02, 10.02, 10.18, 9.71, 8.17, 6.44, 5.48] },
  { lat: "40°N", place: "New York", v: [5.03, 6.05, 8.0, 9.88, 10.57, 10.48, 10.48, 10.57, 9.88, 7.99, 6.05, 5.03] },
  { lat: "48°N", place: "Seattle", v: [4.13, 5.25, 7.62, 10.25, 11.37, 11.37, 11.37, 11.37, 10.25, 7.63, 5.25, 4.13] },
];

const SUN_MOON = [
  { label: "Virgo Sun · Cancer Moon", value: 0.789 },
  { label: "Leo Sun · Taurus Moon", value: 0.784 },
  { label: "Leo Sun · Libra Moon", value: 0.773 },
  { label: "Cancer Sun · Pisces Moon", value: 0.77 },
  { label: "Virgo Sun · Scorpio Moon", value: 0.768 },
  { label: "Capricorn Sun · Gemini Moon", value: 0.606 },
  { label: "Capricorn Sun · Virgo Moon", value: 0.596 },
  { label: "Capricorn Sun · Leo Moon", value: 0.588 },
  { label: "Capricorn Sun · Libra Moon", value: 0.559 },
].map((r) => ({ ...r, display: `1 in ${Math.round(100 / r.value)}`, tip: `${r.label}: ${r.value.toFixed(3)}% of births` }));

const TOTAL = 62187024;
const BIG3 = [
  { rank: 1, sun: "Cancer", moon: "Sagittarius", rising: "Libra", n: 68635 },
  { rank: 2, sun: "Leo", moon: "Taurus", rising: "Scorpio", n: 68145 },
  { rank: 3, sun: "Cancer", moon: "Aries", rising: "Libra", n: 67775 },
  { rank: 4, sun: "Leo", moon: "Pisces", rising: "Scorpio", n: 67278 },
  { rank: 5, sun: "Leo", moon: "Aries", rising: "Virgo", n: 66127 },
];
const BIG3_RARE = [
  { rank: 1726, sun: "Gemini", moon: "Sagittarius", rising: "Aries", n: 13642 },
  { rank: 1727, sun: "Aries", moon: "Aries", rising: "Pisces", n: 13373 },
  { rank: 1728, sun: "Aries", moon: "Leo", rising: "Pisces", n: 13345 },
];

const COMBOS: Stat[] = [
  { value: "1,728", label: "possible Sun–Moon–Rising combinations; every one occurs in the data", source: BC, icon: "layers" },
  { value: "5.1×", label: "gap between the most common Big Three and the rarest", source: BC, icon: "chart" },
  { value: "1 in 12", label: "people share a Sun and Moon sign (8.31%)", source: BC, icon: "moon" },
  { value: "1 in 13.5", label: "share a Sun and Rising sign (7.41%)", source: BC, icon: "sunrise" },
];

const PLANETS: Stat[] = [
  { value: "19.04%", label: "of births happened with Mercury retrograde, exactly the share of retrograde days", source: BC, icon: "loop" },
  { value: "6.88%", label: "of births happened with Venus retrograde (vs 6.92% of days)", source: BC, icon: "loop" },
  { value: "+1%", label: "more births on full-moon days than their share of days predicts, within normal variation", source: BC, icon: "moon" },
  { value: "25% each", label: "Fire, Earth, Air and Water Sun signs split the population almost exactly evenly", source: BC, icon: "compass" },
];

// CDC/NCHS Data Brief 200, percent of births by hour, 2013 (midnight first).
const HOURS = [2.9, 2.9, 2.8, 2.7, 2.7, 2.8, 2.9, 4.5, 6.3, 5.0, 5.0, 5.0, 6.0, 5.7, 5.1, 4.9, 4.9, 5.0, 4.5, 4.0, 4.0, 3.7, 3.5, 3.3];
const hourName = (h: number) => (h === 0 ? "12am" : h === 12 ? "12pm" : h < 12 ? `${h}am` : `${h - 12}pm`);

const TIME: Stat[] = [
  { value: "<3%", label: "of births happen in each hour from midnight to 6:59 a.m.", source: S.cdc, icon: "moon" },
  { value: "+58%", label: "more births on an average weekday (12,675) than a weekend day (8,040)", source: S.ssa, icon: "chart" },
  { value: "60%", label: "of births fall between 6 a.m. and 6 p.m., so most US charts have the Sun above the horizon", source: BC, icon: "sun" },
];

const WIKI = [
  { article: "Ascendant (rising sign)", y1: 83942, y2: 140032 },
  { article: "Horoscope (birth chart)", y1: 183592, y2: 202142 },
  { article: "Saturn return", y1: 107709, y2: 103200 },
  { article: "Astrology", y1: 556220, y2: 448394 },
  { article: "Astrological sign", y1: 1287736, y2: 829862 },
];

const READINGS: Stat[] = [
  { value: "28%", label: "of US adults consult astrology or a horoscope at least once a year", source: S.pew2025, icon: "users" },
  { value: "1%", label: "rely “a lot” on astrology, tarot or fortune tellers for major decisions", source: S.pew2025, icon: "compass" },
  { value: "53%", label: "of people who know their sign say they identify with it", source: S.ipsos2019, icon: "star" },
  { value: "4.8 / 4.9", label: "App Store ratings for Co–Star (206K ratings) and CHANI (59K)", source: S.appstore, icon: "phone" },
];

const RESEARCH: Stat[] = [
  { value: "Chance", label: "28 astrologers matching 116 charts to personality profiles did no better than chance in a double-blind test", source: S.carlson, icon: "flask" },
  { value: "2,101", label: "“time twins” born minutes apart in London in 1958 showed no chart-predicted similarities across 100+ traits", source: S.deankelly, icon: "users" },
  { value: "52", label: "students could recognise their real personality-test profile, but not their real natal-chart description", source: S.wymanvyse, icon: "book" },
];

const FAQS = [
  { q: "What is the most common rising sign?", a: "Leo Rising, at 10.53% of US births from 2000–2014 in a BluntChart analysis weighted by CDC birth-time data, followed by Virgo (10.44%) and Libra (10.43%). Some signs take much longer to rise than others at US latitudes, which makes them more common." },
  { q: "What is the rarest rising sign?", a: "Pisces Rising at 5.18%, just behind Aries Rising at 5.23%. Both rise in under an hour in the Northern Hemisphere. They are rarer the further north you are born: about 6.2% at Miami's latitude and 4.1% at Seattle's." },
  { q: "What is the most common moon sign?", a: "Moon signs are nearly even because the Moon changes sign every 2–3 days. Aries Moon was marginally most common (8.49%) and Virgo Moon least common (8.18%) in 2000–2014 US births." },
  { q: "What is the most common Big Three combination?", a: "Cancer Sun, Sagittarius Moon, Libra Rising, at 0.110% of US births (about 1 in 906). The rarest was Aries Sun, Leo Moon, Pisces Rising at 0.021% (about 1 in 4,660). All 1,728 combinations appear in the data." },
  { q: "What is the most common Sun and Moon combination?", a: "Virgo Sun with Cancer Moon (0.789% of US births). The rarest is Capricorn Sun with Libra Moon (0.559%). If all 144 pairings were equal, each would be 0.694%." },
  { q: "How many people are born during Mercury retrograde?", a: "About 1 in 5: 19.04% of US births from 2000–2014, exactly matching the share of days Mercury was retrograde." },
  { q: "Are more babies born on a full moon?", a: "Not meaningfully. Full-moon days were 12.17% of days and 12.30% of births. Day of the week matters far more: weekdays average 58% more births than weekends." },
  { q: "Are birth charts accurate?", a: "Controlled tests have not found chart readings to perform better than chance. In Carlson's 1985 double-blind study in Nature, 28 astrologers matching 116 charts to personality profiles performed at chance level. Astrologers have published reanalyses disputing parts of these results." },
];

const SOURCES = [S.ssa, S.cdc, S.census, S.astronomy, S.pew2025, S.ipsos2019, S.wiki, S.carlson, S.deankelly, S.wymanvyse, S.appstore];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function BirthChartStatisticsPage() {
  return (
    <StatsPage>
      <JsonLd data={articleJsonLd({
        headline: TITLE,
        description: "Original data on the most common Sun, Moon and Rising signs and Big Three combinations from 62 million US births, plus research and interest trends.",
        url: PAGE_URL, iso: UPDATED_ISO, published: PUBLISHED_ISO, citations: SOURCES.map((s) => s.url),
      })} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: DATA_HUB_URL },
        { name: "Birth Chart Statistics", url: PAGE_URL },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Dataset",
        name: "US Sun, Moon and Rising sign distribution and Big Three combinations, births 2000–2014",
        description: "Share of 62,187,024 US births (SSA, 2000–2014) by Sun, Moon and Rising sign and by all 1,728 Sun–Moon–Rising combinations, weighted by CDC hour-of-birth data.",
        url: `${PAGE_URL}#rising`, creator: { "@type": "Organization", name: "BluntChart" },
        isBasedOn: [S.ssa.url, S.cdc.url], temporalCoverage: "2000/2014", spatialCoverage: "United States",
        license: "https://creativecommons.org/licenses/by/4.0/",
        distribution: [
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://bluntchart.com/data/us-sun-moon-rising-distribution-2000-2014.csv" },
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://bluntchart.com/data/us-big-three-combinations-2000-2014.csv" },
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://bluntchart.com/data/rising-sign-share-by-latitude.csv" },
        ],
      }} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Birth Chart Statistics" }]}
        kicker="Original research"
        kickerIcon="flask"
        title={TITLE}
        lede="How common is your Rising sign, and how rare is your Big Three? We calculated the Sun, Moon and Rising signs for every US birth from 2000 to 2014, weighted by when babies are actually born."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "users", text: "62.2M births analysed" }, { icon: "book", text: `${SOURCES.length} sources` }, { icon: "download", text: "Free CSV data" }]}
      />

      <Body toc={[
        { id: "key", label: "Key statistics" },
        { id: "rising", label: "Most common rising signs" },
        { id: "latitude", label: "Rising signs by latitude" },
        { id: "moon", label: "Moon signs" },
        { id: "sun", label: "Sun signs" },
        { id: "sun-moon", label: "Sun–Moon pairs" },
        { id: "big-three", label: "Big Three combinations" },
        { id: "planets", label: "Retrogrades and moon phases" },
        { id: "birth-time", label: "Birth time statistics" },
        { id: "interest", label: "Interest trends" },
        { id: "readings", label: "Reading habits" },
        { id: "research", label: "Are birth charts accurate?" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="key" icon="star" title="Key statistics">
          <StatTiles stats={KEY} highlightFirst />
        </Section>

        <Section id="rising" icon="sunrise" title="What is the most common rising sign?"
          answer={<><b>Leo Rising</b>, at 10.53% of US births. Pisces Rising is the rarest, at 5.18%.</>}>
          <Figure
            title="Rising sign share of US births, 2000–2014"
            subtitle="Weighted by CDC birth-time data, at the US center of population."
            sources={[BC]}
            note={<a href="/data/us-sun-moon-rising-distribution-2000-2014.csv" download>Download CSV</a>}
          >
            <BarChart label="Rising sign share of US births" rows={bars(RISING)} max={12} ticks={[0, 6, 12]} highlight={["Leo", "Pisces"]} />
          </Figure>
          <P>
            Your Rising sign is the sign on the eastern horizon when you were born. At US latitudes some signs
            cross the horizon in under an hour and others take nearly three, so the slow risers (Leo through
            Scorpio) are far more common. Find yours with the <a href="/rising-sign-calculator">rising sign calculator</a>.
          </P>
        </Section>

        <Section id="latitude" icon="globe" title="Rising signs by latitude"
          answer={<>The further north you’re born, <b>the rarer Aries and Pisces Rising</b> become.</>}>
          <Figure
            title="How often each sign rises, by latitude"
            subtitle="Share of the day each sign is on the Ascendant, averaged over a year. Darker = more common."
            sources={[BC]}
            note={<a href="/data/rising-sign-share-by-latitude.csv" download>Download CSV</a>}
          >
            <Table className="sx-heat">
              <thead>
                <tr><th>Rising</th>{LAT_RISE.map((l) => <th key={l.lat} style={{ textAlign: "center" }}>{l.lat} · {l.place}</th>)}</tr>
              </thead>
              <tbody>
                {LAT_SIGNS.map((s, i) => (
                  <tr key={s}>
                    <td className="b">{s}</td>
                    {LAT_RISE.map((l) => <td key={l.lat} className="h" style={heat(l.v[i], 4, 11.4)}>{l.v[i].toFixed(1)}%</td>)}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
        </Section>

        <Section id="moon" icon="moon" title="What is the most common moon sign?"
          answer={<>Moon signs are <b>almost evenly spread</b>. Aries Moon is only marginally most common (8.49%).</>}>
          <Figure title="Moon sign share of US births, 2000–2014" subtitle="All twelve signs fall between 8.2% and 8.5%." sources={[BC]}>
            <BarChart label="Moon sign share of US births" rows={bars(MOON)} max={12} ticks={[0, 6, 12]} />
          </Figure>
          <P>
            The Moon changes sign every 2–3 days, so no birth season can favour one Moon sign. Look up yours with
            the <a href="/moon-sign-calculator">moon sign calculator</a>.
          </P>
        </Section>

        <Section id="sun" icon="sun" title="Sun signs using exact ingress times"
          answer={<><b>Leo, Virgo and Cancer</b> are effectively tied for most common. Capricorn is the rarest.</>}>
          <Figure title="Sun sign share of US births, 2000–2014" subtitle="Using the Sun’s exact entry into each sign, to the hour." sources={[BC]}>
            <BarChart label="Sun sign share of US births" rows={bars(SUN)} max={12} ticks={[0, 6, 12]} />
          </Figure>
          <P>
            Our <a href="/astrology-data/astrology-statistics#zodiac-births">astrology statistics</a> report uses
            the calendar dates printed in horoscope columns, which puts Cancer first (9.00%). Exact ingress
            times move a few cusp births and put Leo slightly ahead.
          </P>
        </Section>

        <Section id="sun-moon" icon="layers" title="Most common Sun–Moon combinations"
          answer={<><b>Virgo Sun with Cancer Moon</b> is the most common pairing. Capricorn Sun pairings are the rarest.</>}>
          <Figure title="Most and least common Sun–Moon pairings" subtitle="Top 5 and bottom 4 of 144 pairings. An even split would be 1 in 144." sources={[BC]}>
            <BarChart label="Sun and Moon pairings by share of births" rows={SUN_MOON} max={0.8}
              highlight={["Virgo Sun · Cancer Moon", "Capricorn Sun · Libra Moon"]} />
          </Figure>
        </Section>

        <Section id="big-three" icon="star" title="The most common and rarest Big Three"
          answer={<>Most common: <b>Cancer Sun, Sagittarius Moon, Libra Rising</b> (1 in 906). Rarest: Aries Sun, Leo Moon, Pisces Rising (1 in 4,660).</>}>
          <Figure
            title="Big Three combinations, ranked"
            subtitle="Out of 1,728 possible Sun–Moon–Rising combinations."
            sources={[BC]}
            note={<a href="/data/us-big-three-combinations-2000-2014.csv" download>Download all 1,728 (CSV)</a>}
          >
            <Table>
              <thead><tr><th>Rank</th><th>Sun</th><th>Moon</th><th>Rising</th><th>How common</th></tr></thead>
              <tbody>
                {BIG3.map((r) => (
                  <tr key={r.rank}><td>{r.rank}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="b">{r.rising}</td><td className="n">1 in {Math.round(TOTAL / r.n).toLocaleString("en-US")}</td></tr>
                ))}
                <tr className="sep"><td colSpan={5}>Rarest</td></tr>
                {BIG3_RARE.map((r) => (
                  <tr key={r.rank}><td>{r.rank.toLocaleString("en-US")}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="b">{r.rising}</td><td className="n">1 in {Math.round(TOTAL / r.n).toLocaleString("en-US")}</td></tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <StatTiles stats={COMBOS} />
          <P>Find where yours ranks with the <a href="/big-three-calculator">Big Three calculator</a>.</P>
        </Section>

        <Cta
          title="Your Big Three is 1 of 1,728."
          text="Your houses and aspects make your full chart rarer still."
          href="/free-birth-chart"
          label="Free birth chart"
        />

        <Section id="planets" icon="loop" title="Retrogrades and moon phases at birth"
          answer={<>About <b>1 in 5</b> people was born during Mercury retrograde. The full moon has no real effect on births.</>}>
          <StatTiles stats={PLANETS} />
          <P>
            The hospital calendar matters far more than the Moon. Scheduled inductions and C-sections make
            weekdays much busier than weekends (<Cite source={S.ssa} />). See upcoming dates in{" "}
            <a href="/mercury-retrograde-2026">Mercury retrograde 2026</a>.
          </P>
        </Section>

        <Section id="birth-time" icon="clock" title="Birth time statistics"
          answer={<><b>8 a.m.</b> is the most common hour of birth in the US. The early-morning hours are the quietest.</>}>
          <Figure title="Share of US births by hour of day" subtitle="2013 birth certificates, 41 states and DC (90% of US births)." sources={[S.cdc]}>
            <ColumnChart
              label="Share of US births by hour: lowest 2.7% at 3 and 4 a.m., peaks of 6.3% at 8 a.m. and 6.0% at noon"
              max={7}
              highlight={["8am", "12pm"]}
              cols={HOURS.map((v, h) => ({
                label: h % 3 === 0 ? hourName(h) : "",
                key: hourName(h),
                value: v,
                display: h === 8 || h === 12 ? `${v.toFixed(1)}%` : "",
                tip: `${hourName(h)}: ${v}% of births`,
              }))}
            />
          </Figure>
          <StatTiles stats={TIME} />
        </Section>

        <Section id="interest" icon="search" title="Birth chart vs horoscope interest"
          answer={<>Interest is shifting from sun signs to full charts. Wikipedia views of “Ascendant” <b>rose 67%</b> in a year.</>}>
          <Figure title="English Wikipedia views, year over year" subtitle="Sep 2024–Aug 2025 vs Sep 2025–Aug 2026, human traffic only." sources={[S.wiki]}>
            <Table>
              <thead><tr><th>Article</th><th>Year 1</th><th>Year 2</th><th>Change</th></tr></thead>
              <tbody>
                {WIKI.map((r) => {
                  const ch = Math.round((r.y2 / r.y1 - 1) * 100);
                  return (
                    <tr key={r.article}>
                      <td className="b">{r.article}</td>
                      <td className="n">{r.y1.toLocaleString("en-US")}</td>
                      <td className="n">{r.y2.toLocaleString("en-US")}</td>
                      <td className="n">{ch > 0 ? "▲ +" : "▼ "}{ch}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Figure>
          <Pending title="Google search volumes">
            Google Trends only reports relative interest (0–100), which can’t be compared across separate
            searches. We’ll add verified monthly volumes in a future update.
          </Pending>
        </Section>

        <Section id="readings" icon="message" title="Birth chart reading habits"
          answer={<><b>28%</b> of US adults consult astrology yearly, but very few rely on it for big decisions.</>}>
          <StatTiles stats={READINGS} />
          <Pending title="reading satisfaction">
            Widely quoted “X% found their reading accurate” figures usually come from vendors’ unpublished polls.
            We’ll add this when a survey with published methodology exists.
          </Pending>
        </Section>

        <Section id="research" icon="flask" title="Are birth charts accurate?"
          answer={<>In controlled tests, chart-based readings <b>have not beaten chance</b>.</>}>
          <StatTiles stats={RESEARCH} />
          <P>
            Astrologers have published reanalyses disputing parts of these results. We report the published
            findings as they stand. At BluntChart, astrology is a lens for self-reflection, not a scientific
            instrument.
          </P>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. “${TITLE}.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            <strong>Births:</strong> SSA daily US birth counts, Jan 1, 2000 to Dec 31, 2014 (62,187,024 births).{" "}
            <strong>Birth times:</strong> each day’s births are split across 24 hours using the CDC’s 2013
            hour-of-birth distribution, with weekdays and weekends weighted separately. This assumes the 2013
            pattern holds for the whole period. <strong>Location:</strong> charts are cast for the 2020 US
            center of population (37.4°N, 92.4°W) in Central Time with historical daylight saving rules.{" "}
            <strong>Positions:</strong> tropical Sun, Moon, Mercury and Venus positions and the Ascendant come
            from the open-source astronomy-engine library. All tables are free to reuse with a link to this page.
          </P>
        </SourceList>

        <Section icon="layers" title="Related">
          <Cards items={[
            { href: HUB_PATH, icon: "database", title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
            { href: "/astrology-data/astrology-statistics", icon: "chart", title: "Astrology statistics 2026", desc: "Belief rates, market size and app data." },
            { href: "/big-three-calculator", icon: "star", title: "Big Three calculator", desc: "Find your Sun, Moon and Rising signs." },
          ]} />
        </Section>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
      </Body>
    </StatsPage>
  );
}
