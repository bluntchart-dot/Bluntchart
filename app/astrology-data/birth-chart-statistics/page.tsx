import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  StatsPage, JsonLd, Crumbs, PageHeader, Toc, Section, P, Cite, StatList, Table, Bar, Pending, Cta,
  LinkList, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, BIRTH_CHART_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-09-29";
const UPDATED_ISO = "2026-10-07";
const UPDATED_LABEL = "October 7, 2026";
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
  { value: "2×", label: "Leo Rising (10.53%) is twice as common as Pisces Rising (5.18%)", source: BC },
  { value: "1 in 906", label: "people have the most common Big Three: Cancer Sun, Sagittarius Moon, Libra Rising", source: BC },
  { value: "1 in 4,660", label: "have the rarest: Aries Sun, Leo Moon, Pisces Rising", source: BC },
  { value: "19%", label: "of Americans born 2000–2014 were born with Mercury retrograde", source: BC },
  { value: "1 in 157", label: "people have the same sign for Sun, Moon and Rising", source: BC },
  { value: "8 a.m.", label: "is the most common hour of birth in the US", source: S.cdc },
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

const LAT_SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const LAT_RISE = [
  { lat: "25°N", place: "Miami", v: [6.24, 7.08, 8.43, 9.44, 9.54, 9.26, 9.26, 9.54, 9.44, 8.44, 7.08, 6.24] },
  { lat: "35°N", place: "Memphis", v: [5.48, 6.44, 8.17, 9.71, 10.17, 10.02, 10.02, 10.18, 9.71, 8.17, 6.44, 5.48] },
  { lat: "40°N", place: "New York", v: [5.03, 6.05, 8.0, 9.88, 10.57, 10.48, 10.48, 10.57, 9.88, 7.99, 6.05, 5.03] },
  { lat: "48°N", place: "Seattle", v: [4.13, 5.25, 7.62, 10.25, 11.37, 11.37, 11.37, 11.37, 10.25, 7.63, 5.25, 4.13] },
];

const SUN_MOON = [
  { sun: "Virgo", moon: "Cancer", share: 0.789 }, { sun: "Leo", moon: "Taurus", share: 0.784 },
  { sun: "Leo", moon: "Libra", share: 0.773 }, { sun: "Cancer", moon: "Pisces", share: 0.77 },
  { sun: "Virgo", moon: "Scorpio", share: 0.768 },
];
const SUN_MOON_RARE = [
  { sun: "Capricorn", moon: "Libra", share: 0.559 }, { sun: "Capricorn", moon: "Leo", share: 0.588 },
  { sun: "Capricorn", moon: "Virgo", share: 0.596 },
];

const BIG3 = [
  { sun: "Cancer", moon: "Sagittarius", rising: "Libra", n: 68635 },
  { sun: "Leo", moon: "Taurus", rising: "Scorpio", n: 68145 },
  { sun: "Cancer", moon: "Aries", rising: "Libra", n: 67775 },
  { sun: "Leo", moon: "Pisces", rising: "Scorpio", n: 67278 },
  { sun: "Leo", moon: "Aries", rising: "Virgo", n: 66127 },
];
const BIG3_RARE = [
  { sun: "Aries", moon: "Leo", rising: "Pisces", n: 13345 },
  { sun: "Aries", moon: "Aries", rising: "Pisces", n: 13373 },
  { sun: "Gemini", moon: "Sagittarius", rising: "Aries", n: 13642 },
];
const TOTAL = 62187024;

const COMBOS: Stat[] = [
  { value: "1,728", label: "possible Sun–Moon–Rising combinations; all of them occur in the data", source: BC },
  { value: "5.1×", label: "gap between the most common Big Three (0.110%) and the rarest (0.021%)", source: BC },
  { value: "8.31%", label: "share a Sun and Moon sign (about 1 in 12)", source: BC },
  { value: "7.41%", label: "share a Sun and Rising sign (about 1 in 13.5)", source: BC },
];

const PLANETS: Stat[] = [
  { value: "19.04%", label: "of births happened with Mercury retrograde, the same as the share of retrograde days", source: BC },
  { value: "6.88%", label: "of births happened with Venus retrograde (vs 6.92% of days)", source: BC },
  { value: "+1%", label: "more births on full-moon days than their share of days predicts, which is within normal variation", source: BC },
  { value: "25%", label: "each: Fire, Earth, Air and Water Sun signs split the population almost exactly evenly", source: BC },
];

const TIME: Stat[] = [
  { value: "6.3%", label: "of US births happen in the 8 a.m. hour, the busiest of the day; noon is next at 6.0%", source: S.cdc },
  { value: "<3%", label: "of births happen in each hour from midnight to 6:59 a.m.", source: S.cdc },
  { value: "+58%", label: "more births on an average weekday (12,675) than a weekend day (8,040)", source: S.ssa },
  { value: "60%", label: "of births fall between 6 a.m. and 6 p.m., so most US charts have the Sun above the horizon", source: BC },
];

const WIKI = [
  { article: "Ascendant (rising sign)", y1: 83942, y2: 140032 },
  { article: "Horoscope (birth chart)", y1: 183592, y2: 202142 },
  { article: "Saturn return", y1: 107709, y2: 103200 },
  { article: "Astrology", y1: 556220, y2: 448394 },
  { article: "Astrological sign", y1: 1287736, y2: 829862 },
];

const READINGS: Stat[] = [
  { value: "28%", label: "of US adults consult astrology or a horoscope at least once a year", source: S.pew2025 },
  { value: "1%", label: "rely “a lot” on astrology, tarot or fortune tellers for major decisions", source: S.pew2025 },
  { value: "53%", label: "of people who know their sign say they identify with it", source: S.ipsos2019 },
  { value: "4.8 / 4.9", label: "App Store ratings for Co–Star (206K ratings) and CHANI (59K)", source: S.appstore },
];

const RESEARCH: Stat[] = [
  { value: "Chance", label: "28 astrologers matching 116 charts to personality profiles did no better than chance in a double-blind test", source: S.carlson },
  { value: "2,101", label: "“time twins” born minutes apart in London in 1958 showed no chart-predicted similarities across 100+ traits", source: S.deankelly },
  { value: "52", label: "students could recognise their real personality-test profile, but not their real natal-chart description", source: S.wymanvyse },
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

const oneIn = (share: number) => Math.round(100 / share).toLocaleString("en-US");

function SignTable({ rows, min, max, label, note }: { rows: Row[]; min: number; max: number; label: string; note: ReactNode }) {
  return (
    <Table note={note}>
      <thead><tr><th>#</th><th>{label}</th><th>Share</th><th style={{ width: "45%" }}></th></tr></thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.sign}>
            <td>{i + 1}</td>
            <td className="b">{r.sign}</td>
            <td className="n">{r.share.toFixed(2)}%</td>
            <td><Bar value={r.share} min={min} max={max} /></td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

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

      <Crumbs items={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Birth Chart Statistics" }]} />
      <PageHeader
        kicker="Original research"
        title={TITLE}
        lede="How common is your Rising sign, and how rare is your Big Three? We calculated the Sun, Moon and Rising signs for every US birth from 2000 to 2014, weighted by when babies are actually born."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        meta={`${SOURCES.length} sources · 62.2M births analysed`}
      />

      <Section id="key" title="Key statistics">
        <StatList stats={KEY} />
      </Section>

      <Toc items={[
        { id: "rising", label: "Most common rising signs" },
        { id: "latitude", label: "Rising signs by latitude" },
        { id: "moon", label: "Moon signs" },
        { id: "sun", label: "Sun signs (exact ingress)" },
        { id: "sun-moon", label: "Sun–Moon pairs" },
        { id: "big-three", label: "Big Three combinations" },
        { id: "planets", label: "Retrogrades and moon phases" },
        { id: "birth-time", label: "Birth time statistics" },
        { id: "interest", label: "Interest trends" },
        { id: "readings", label: "Reading habits" },
        { id: "research", label: "Are birth charts accurate?" },
        { id: "faq", label: "FAQ" },
      ]} />

      <Section id="rising" title="What is the most common rising sign?" answer="Leo Rising, at 10.53% of US births. Pisces Rising is the rarest, at 5.18%.">
        <P>
          Your Rising sign is the sign on the eastern horizon when you were born. At US latitudes some signs
          cross the horizon in under an hour and others take nearly three, so the slow risers (Leo through
          Scorpio) are far more common. Find yours with the <a href="/rising-sign-calculator">rising sign calculator</a>.
        </P>
        <SignTable rows={RISING} min={4} max={10.6} label="Rising sign"
          note={<>Source: <Cite source={BC} />. Bar scale starts at 4%. <a href="/data/us-sun-moon-rising-distribution-2000-2014.csv">Download CSV</a>.</>} />
      </Section>

      <Section id="latitude" title="Rising signs by latitude" answer="The further north you’re born, the rarer Aries and Pisces Rising become.">
        <Table note={<>Share of time each sign is rising over a year, sampled every 15 minutes. Source: <Cite source={BC} />. <a href="/data/rising-sign-share-by-latitude.csv">Download CSV</a>.</>}>
          <thead>
            <tr><th>Rising</th>{LAT_RISE.map((l) => <th key={l.lat}>{l.lat} <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>{l.place}</span></th>)}</tr>
          </thead>
          <tbody>
            {LAT_SIGNS.map((s, i) => (
              <tr key={s}><td className="b">{s}</td>{LAT_RISE.map((l) => <td key={l.lat} className="n">{l.v[i].toFixed(1)}%</td>)}</tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="moon" title="What is the most common moon sign?" answer="Moon signs are almost evenly spread. Aries Moon is marginally most common (8.49%).">
        <P>
          The Moon changes sign every 2–3 days, so no birth season can favour one Moon sign. The 0.31-point
          spread comes from the Moon’s elliptical orbit, not from birth patterns. Look up yours with
          the <a href="/moon-sign-calculator">moon sign calculator</a>.
        </P>
        <SignTable rows={MOON} min={7.9} max={8.5} label="Moon sign" note={<>Bar scale runs from 7.9% to 8.5%. Source: <Cite source={BC} />.</>} />
      </Section>

      <Section id="sun" title="Sun signs using exact ingress times" answer="Leo, Virgo and Cancer are effectively tied for most common. Capricorn is the rarest.">
        <P>
          Our <a href="/astrology-data/astrology-statistics#zodiac-births">astrology statistics</a> report
          uses the calendar dates printed in horoscope columns, which puts Cancer first (9.00%). Here we use
          the Sun’s exact entry into each sign, which moves a few cusp births and puts Leo slightly
          ahead.
        </P>
        <SignTable rows={SUN} min={7} max={9} label="Sun sign" note={<>Bar scale starts at 7%. Source: <Cite source={BC} />.</>} />
      </Section>

      <Section id="sun-moon" title="Most common Sun–Moon combinations" answer="Virgo Sun with Cancer Moon (about 1 in 127). The rarest is Capricorn Sun with Libra Moon (about 1 in 179).">
        <Table note={<>Ranks out of 144 pairings. An even split would give each 0.694%. Source: <Cite source={BC} />.</>}>
          <thead><tr><th>Rank</th><th>Sun</th><th>Moon</th><th>Share</th><th>1 in</th></tr></thead>
          <tbody>
            {SUN_MOON.map((r, i) => (
              <tr key={r.sun + r.moon}><td>{i + 1}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="n">{r.share.toFixed(3)}%</td><td>{oneIn(r.share)}</td></tr>
            ))}
            <tr className="sep"><td colSpan={5}>Rarest</td></tr>
            {SUN_MOON_RARE.map((r, i) => (
              <tr key={r.sun + r.moon}><td>{144 - i}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="n">{r.share.toFixed(3)}%</td><td>{oneIn(r.share)}</td></tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="big-three" title="The most common and rarest Big Three" answer="Most common: Cancer Sun, Sagittarius Moon, Libra Rising (1 in 906). Rarest: Aries Sun, Leo Moon, Pisces Rising (1 in 4,660).">
        <Table note={<>Ranks out of 1,728. Births are weighted estimates. <a href="/data/us-big-three-combinations-2000-2014.csv">Download all 1,728 combinations (CSV)</a>.</>}>
          <thead><tr><th>Rank</th><th>Sun</th><th>Moon</th><th>Rising</th><th>1 in</th></tr></thead>
          <tbody>
            {BIG3.map((r, i) => (
              <tr key={r.sun + r.moon + r.rising}><td>{i + 1}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="b">{r.rising}</td><td className="n">{Math.round(TOTAL / r.n).toLocaleString("en-US")}</td></tr>
            ))}
            <tr className="sep"><td colSpan={5}>Rarest</td></tr>
            {BIG3_RARE.map((r, i) => (
              <tr key={r.sun + r.moon + r.rising}><td>{(1728 - i).toLocaleString("en-US")}</td><td className="b">{r.sun}</td><td className="b">{r.moon}</td><td className="b">{r.rising}</td><td className="n">{Math.round(TOTAL / r.n).toLocaleString("en-US")}</td></tr>
            ))}
          </tbody>
        </Table>
        <StatList stats={COMBOS} />
        <P>Find where yours ranks with the <a href="/big-three-calculator">Big Three calculator</a>.</P>
      </Section>

      <Cta
        text={<><strong>Your Big Three is 1 of 1,728.</strong> Your houses and aspects make the full chart rarer still.</>}
        href="/free-birth-chart"
        label="Free birth chart"
      />

      <Section id="planets" title="Retrogrades and moon phases at birth" answer="About 1 in 5 people was born during Mercury retrograde. The full moon has no real effect on births.">
        <StatList stats={PLANETS} />
        <P>
          The hospital calendar matters far more than the Moon. Scheduled inductions and C-sections make
          weekdays much busier than weekends (<Cite source={S.ssa} />). See upcoming dates in{" "}
          <a href="/mercury-retrograde-2026">Mercury retrograde 2026</a>.
        </P>
      </Section>

      <Section id="birth-time" title="Birth time statistics" answer="8 a.m. is the most common hour of birth in the US. The early-morning hours are the quietest.">
        <StatList stats={TIME} />
      </Section>

      <Section id="interest" title="Birth chart vs horoscope interest" answer="Interest is shifting from sun signs to full charts. Wikipedia views of “Ascendant” rose 67% in a year.">
        <Table note={<>English Wikipedia user views, Sep 2024–Aug 2025 vs Sep 2025–Aug 2026. Source: <Cite source={S.wiki} />.</>}>
          <thead><tr><th>Article</th><th>Year 1</th><th>Year 2</th><th>Change</th></tr></thead>
          <tbody>
            {WIKI.map((r) => {
              const ch = Math.round((r.y2 / r.y1 - 1) * 100);
              return (
                <tr key={r.article}><td className="b">{r.article}</td><td>{r.y1.toLocaleString("en-US")}</td><td>{r.y2.toLocaleString("en-US")}</td><td className="n">{ch > 0 ? "+" : ""}{ch}%</td></tr>
              );
            })}
          </tbody>
        </Table>
        <Pending title="Google search volumes">
          Google Trends only reports relative interest (0–100), which can’t be compared across separate
          searches. We’ll add verified monthly volumes in a future update.
        </Pending>
      </Section>

      <Section id="readings" title="Birth chart reading habits" answer="28% of US adults consult astrology yearly, but very few rely on it for big decisions.">
        <StatList stats={READINGS} />
        <Pending title="reading satisfaction">
          Widely quoted “X% found their reading accurate” figures usually come from vendors’ unpublished
          polls. We’ll add this when a survey with published methodology exists.
        </Pending>
      </Section>

      <Section id="research" title="Are birth charts accurate?" answer="In controlled tests, chart-based readings have not beaten chance.">
        <StatList stats={RESEARCH} />
        <P>
          Astrologers have published reanalyses disputing parts of these results. We report the published
          findings as they stand. At BluntChart, astrology is a lens for self-reflection, not a
          scientific instrument.
        </P>
      </Section>

      <Section id="faq" title="FAQ">
        <Faq items={FAQS} />
      </Section>

      <SourceList sources={SOURCES} citeAs={`BluntChart. “${TITLE}.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
        <P>
          <strong>Births:</strong> SSA daily US birth counts, Jan 1, 2000 to Dec 31, 2014 (62,187,024
          births). <strong>Birth times:</strong> each day’s births are split across 24 hours using the
          CDC’s 2013 hour-of-birth distribution, with weekdays and weekends weighted separately. This
          assumes the 2013 pattern holds for the whole period. <strong>Location:</strong> charts are cast
          for the 2020 US center of population (37.4°N, 92.4°W) in Central Time with historical daylight
          saving rules. <strong>Positions:</strong> tropical Sun, Moon, Mercury and Venus positions and the
          Ascendant come from the open-source astronomy-engine library. All tables are free to reuse
          with a link to this page.
        </P>
      </SourceList>

      <Section title="Related">
        <LinkList items={[
          { href: HUB_PATH, title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
          { href: "/astrology-data/astrology-statistics", title: "Astrology statistics 2026", desc: "Belief rates, market size and app data." },
          { href: "/big-three-calculator", title: "Big Three calculator", desc: "Your Sun, Moon and Rising signs." },
        ]} />
      </Section>

      <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
    </StatsPage>
  );
}
