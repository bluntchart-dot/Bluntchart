import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, Cite, StatTiles, Figure, BarChart, ColumnChart, Table,
  Cta, Cards, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, SATURN_RETURN_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-10-27";
const UPDATED_ISO = "2026-10-27";
const UPDATED_LABEL = "October 27, 2026";
const TITLE = "Saturn Return Statistics: Age, Search Trends & Life Impact Data";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "Data-backed look at the Saturn return: when it happens (ages 27–30), the life milestones that cluster around it, Wikipedia interest spikes, quarter-life crisis research, and pop-culture references.",
  keywords: [
    "saturn return statistics", "saturn return age", "when is my saturn return", "saturn return meaning",
    "saturn return dates", "what happens during saturn return", "saturn return life changes",
    "quarter life crisis age", "saturn return calculator", "saturn return 2026",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: "Saturn takes 29.5 years to orbit the Sun. At roughly age 29, first marriages, first babies, career pivots, and quarter-life crises all peak. Coincidence? Here's what the data says.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saturn Return Statistics: What the Data Says About Ages 27–30",
    description: "Median first marriage: 28.6 (women) and 30.5 (men). Mean first baby: 27.6. Median job tenure at 25–34: 2.7 years. Saturn's orbit: 29.457 years.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const KEY: Stat[] = [
  { value: "29.457", label: "years for Saturn to orbit the Sun — the clock behind every Saturn return", source: S.nasa, icon: "loop" },
  { value: "28.6", label: "median age at first marriage for US women in 2024, right in the Saturn return window", source: S.ncfmrMarriage2024, icon: "users" },
  { value: "27.6", label: "mean age of US first-time mothers in 2024", source: S.ncfmrBirth2024, icon: "star" },
  { value: "75%", label: "of 25–33-year-olds have had a quarter-life crisis, average age 27", source: S.linkedin2017, icon: "compass" },
  { value: "2.7 yrs", label: "median job tenure for workers aged 25–34 — the shortest of any adult age group", source: S.blsTenure2024, icon: "chart" },
  { value: "103K", label: "Wikipedia views of “Saturn return” in the past year (Sep 2025–Aug 2026)", source: S.wiki, icon: "search" },
];

// Saturn's three returns
const RETURNS: { label: string; age: string; desc: string }[] = [
  { label: "First return", age: "~27–30", desc: "The one everyone talks about. Identity, career, and relationships get pressure-tested." },
  { label: "Second return", age: "~56–60", desc: "Retirement questions, empty-nest shifts, reassessing legacy." },
  { label: "Third return", age: "~84–89", desc: "Rare — only reached by those who live into their mid-80s." },
];

// Wikipedia monthly pageviews for "Saturn return" article, user traffic, all-access.
// Summed from Wikimedia Pageviews API data.
const WIKI_ANNUAL = [
  { label: "2020", value: 122854, display: "123K", tip: "2020: 122,854 views — Great Conjunction spike in December" },
  { label: "2021", value: 112913, display: "113K", tip: "2021: 112,913 views — Adele's '30' album in November" },
  { label: "2022", value: 112161, display: "112K", tip: "2022: 112,161 views" },
  { label: "2023", value: 143992, display: "144K", tip: "2023: 143,992 views — Saturn entered Pisces in March" },
  { label: "2024", value: 132391, display: "132K", tip: "2024: 132,391 views" },
  { label: "2025", value: 103200, display: "103K", tip: "Sep 2025–Aug 2026: 103,200 views" },
];

const WIKI_SPIKES = [
  { label: "Dec 2020", sub: "Great Conjunction", value: 18109 },
  { label: "Nov 2021", sub: "Adele '30' release", value: 13958 },
  { label: "Apr 2023", sub: "Saturn enters Pisces", value: 34558 },
  { label: "Mar 2024", sub: "Pisces return season", value: 22244 },
  { label: "Mar 2026", sub: "Saturn in Aries preview", value: 13665 },
];

// Life milestones that cluster around Saturn return ages
const MILESTONES: Stat[] = [
  { value: "28.6 / 30.5", label: "median age at first marriage — women / men (2024 ACS)", source: S.ncfmrMarriage2024, icon: "users" },
  { value: "27.6", label: "mean age of first-time mothers in the US (2024 NCHS natality data)", source: S.ncfmrBirth2024, icon: "star" },
  { value: "7.2", label: "jobs held by the average American by age 28 (BLS longitudinal study)", source: S.blsNlsy, icon: "chart" },
  { value: "2.7 yrs", label: "median job tenure for 25–34-year-olds — vs 9.6 years for ages 55–64", source: S.blsTenure2024, icon: "clock" },
];

// Job tenure by age group (BLS 2024)
const TENURE = [
  { label: "16–24", value: 1.1 },
  { label: "25–34", value: 2.7 },
  { label: "35–44", value: 4.6 },
  { label: "45–54", value: 7.0 },
  { label: "55–64", value: 9.6 },
  { label: "65+", value: 9.8 },
];

// Quarter-life crisis data
const QLC: Stat[] = [
  { value: "75%", label: "of 25–33-year-olds in a LinkedIn survey of 6,000+ said they have experienced a quarter-life crisis", source: S.linkedin2017, icon: "compass" },
  { value: "27", label: "average age of the quarter-life crisis in the same survey", source: S.linkedin2017, icon: "clock" },
  { value: "61%", label: "said finding a career they're passionate about was the top cause", source: S.linkedin2017, icon: "chart" },
];

// Astrology belief by generation (Harris Poll 2024)
const BELIEF = [
  { label: "Millennials (27–42)", value: 83 },
  { label: "All Americans", value: 69 },
  { label: "Gen X (43–58)", value: 65 },
  { label: "Gen Z (18–26)", value: 62 },
  { label: "Boomers (59+)", value: 44 },
];

const FAQS = [
  { q: "What is a Saturn return?", a: "A Saturn return is the moment the planet Saturn completes one full orbit and returns to the same position it occupied when you were born. Since Saturn's orbital period is 29.457 years, this first happens around ages 27 to 30. In astrology, it is considered a coming-of-age transit that brings major life transitions." },
  { q: "At what age does the Saturn return happen?", a: "The first Saturn return typically occurs between ages 27 and 30. The second happens around ages 56 to 60, and a rare third return can occur around ages 84 to 89. The exact timing depends on Saturn's position in your natal chart." },
  { q: "How long does a Saturn return last?", a: "Saturn spends about 2.5 years in each zodiac sign. The exact conjunction (when Saturn crosses your natal Saturn degree) may happen once or up to three times within a span of about 6 to 12 months, because Saturn retrogrades. The broader period of influence is often felt for 2 to 3 years." },
  { q: "Do life milestones really cluster around the Saturn return ages?", a: "US demographic data shows that several major milestones peak in the late 20s: the median age at first marriage is 28.6 for women and 30.5 for men (ACS 2024), the mean age of first-time mothers is 27.6 (NCHS 2024), and median job tenure for 25–34-year-olds is just 2.7 years (BLS 2024). Whether Saturn causes this or the correlation is coincidental is a matter of belief, not data." },
  { q: "What is a quarter-life crisis?", a: "A quarter-life crisis is a period of anxiety and uncertainty about career, relationships, and identity that often hits in the mid-to-late 20s. A 2017 LinkedIn survey of 6,000+ people aged 25–33 found that 75% had experienced one, with 27 as the average age." },
  { q: "Is the Saturn return scientifically proven?", a: "No. The Saturn return is an astrological concept, not a scientific one. No controlled study has demonstrated that Saturn's orbital position affects human life events. However, the age range (27–30) does coincide with well-documented demographic transitions." },
  { q: "When is Saturn return 2026?", a: "In 2026, Saturn moves between late Pisces and early Aries. People born with Saturn in late Pisces (roughly 1993–1996) are in or completing their first Saturn return. Use our Saturn return calculator to find your exact dates." },
  { q: "What is the second Saturn return?", a: "The second Saturn return occurs around ages 56 to 60, when Saturn again returns to its natal position. It often coincides with pre-retirement reflection, changing family dynamics (empty nest), and reassessing one's legacy." },
];

const SOURCES = [
  S.nasa, S.wiki, S.ncfmrMarriage2024, S.ncfmrBirth2024, S.blsTenure2024, S.blsNlsy,
  S.linkedin2017, S.harris2024, S.pew2025,
];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function SaturnReturnStatisticsPage() {
  return (
    <StatsPage>
      <JsonLd data={articleJsonLd({
        headline: TITLE,
        description: "Data on the Saturn return: when it happens, life milestones that cluster around ages 27–30, Wikipedia interest trends, quarter-life crisis research, and pop-culture references.",
        url: PAGE_URL, iso: UPDATED_ISO, published: PUBLISHED_ISO, citations: SOURCES.map((s) => s.url),
      })} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: DATA_HUB_URL },
        { name: "Saturn Return Statistics", url: PAGE_URL },
      ])} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Saturn Return Statistics" }]}
        kicker="Data report"
        kickerIcon="chart"
        title={TITLE}
        lede="Saturn takes 29.5 years to orbit the Sun. At roughly age 29, first marriages, first babies, and career pivots all peak. Here's what the numbers actually say about the Saturn return."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "book", text: `${SOURCES.length} sources` }, { icon: "search", text: "103K Wikipedia views/yr" }]}
      />

      <Body toc={[
        { id: "key", label: "Key statistics" },
        { id: "what", label: "What is a Saturn return?" },
        { id: "interest", label: "Search interest trends" },
        { id: "milestones", label: "Life milestones at ages 27–30" },
        { id: "tenure", label: "Job tenure by age" },
        { id: "quarter-life", label: "Quarter-life crisis research" },
        { id: "belief", label: "Astrology belief by generation" },
        { id: "culture", label: "Saturn return in pop culture" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="key" icon="star" title="Key statistics">
          <StatTiles stats={KEY} highlightFirst />
        </Section>

        <Section id="what" icon="loop" title="What is a Saturn return?"
          answer={<>Saturn orbits the Sun every <b>29.457 years</b>. When it returns to the position it occupied at your birth, astrologers call it a Saturn return.</>}>
          <P>
            The first Saturn return hits between ages 27 and 30 — the transit most people
            mean when they say "my Saturn return." Saturn spends roughly 2.5 years in each
            zodiac sign, and the exact conjunction can repeat up to three times within a year
            because of retrograde motion (<Cite source={S.nasa} />).
          </P>
          <Figure title="The three Saturn returns" subtitle="Approximate age ranges based on Saturn's 29.457-year orbital period." sources={[S.nasa]}>
            <Table>
              <thead><tr><th>Return</th><th>Age range</th><th>Themes</th></tr></thead>
              <tbody>
                {RETURNS.map((r) => (
                  <tr key={r.label}>
                    <td className="b">{r.label}</td>
                    <td className="n">{r.age}</td>
                    <td>{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            BluntChart does not claim Saturn causes life events. But the age range of the first
            return (27–30) lines up remarkably well with demographic data on major life
            transitions — as the sections below show.
          </P>
        </Section>

        <Section id="interest" icon="search" title="How popular is the Saturn return concept?"
          answer={<>Wikipedia's "Saturn return" article draws <b>100K–144K views per year</b>, with sharp spikes during sign changes and pop-culture moments.</>}>
          <Figure
            title={`Wikipedia “Saturn return” article views by year`}
            subtitle="English Wikipedia, human traffic only. 2025 is Sep 2025–Aug 2026."
            sources={[S.wiki]}
          >
            <ColumnChart
              label="Saturn return Wikipedia views by year: 123K in 2020, 113K in 2021, 112K in 2022, 144K in 2023, 132K in 2024, 103K in 2025"
              max={160000}
              highlight={["2023"]}
              cols={WIKI_ANNUAL.map((t) => ({ ...t, key: t.label }))}
            />
          </Figure>
          <P>
            The 2023 peak (144K views) coincided with Saturn entering Pisces in March 2023,
            which drove a single-month spike of 34,558 views in April. Other notable
            spikes: December 2020 (18K views, during the Jupiter–Saturn "Great Conjunction")
            and November 2021 (14K views, when Adele released her album <em>30</em>, which
            she said was inspired by her Saturn return).
          </P>
          <Figure
            title="Biggest monthly spikes"
            subtitle={`Wikipedia views for “Saturn return” in peak months, with the likely trigger.`}
            sources={[S.wiki]}
          >
            <BarChart
              label="Top spike months for Saturn return Wikipedia views"
              rows={WIKI_SPIKES.map((s) => ({ label: s.label, value: s.value, display: s.value.toLocaleString("en-US"), tip: `${s.label} (${s.sub}): ${s.value.toLocaleString("en-US")} views` }))}
              max={36000}
              highlight={["Apr 2023"]}
              format={(v) => v.toLocaleString("en-US")}
              ticks={[0, 18000, 36000]}
            />
          </Figure>
        </Section>

        <Section id="milestones" icon="users" title="Life milestones that cluster at ages 27–30"
          answer={<>First marriage, first baby, and the biggest career churn all happen in the <b>exact age range</b> astrology assigns to the Saturn return.</>}>
          <StatTiles stats={MILESTONES} />
          <P>
            The median US woman now marries at 28.6 and has her first child at 27.6. The median
            man marries at 30.5 (<Cite source={S.ncfmrMarriage2024} />). Meanwhile, BLS data
            shows that the average American has already held 7.2 jobs by age 28 and that the
            25–34 age group has the shortest job tenure of any adult group at 2.7 years
            (<Cite source={S.blsTenure2024} />).
          </P>
          <P>
            These milestones have been shifting later for decades. In 1980, the median age at
            first marriage was 22.0 for women and 24.7 for men — well before the Saturn return
            window. The convergence with the Saturn return ages is a recent phenomenon,
            driven by longer education, rising housing costs, and delayed family formation.
          </P>
        </Section>

        <Section id="tenure" icon="chart" title="Job tenure by age group"
          answer={<>Workers aged 25–34 stay at a job for a <b>median of 2.7 years</b> — less than half the overall median of 3.9 years.</>}>
          <Figure
            title="Median years with current employer, by age group"
            subtitle="US wage and salary workers, January 2024."
            sources={[S.blsTenure2024]}
          >
            <BarChart
              label="Job tenure by age: 1.1 years for 16–24, 2.7 for 25–34, 4.6 for 35–44, 7.0 for 45–54, 9.6 for 55–64, 9.8 for 65+"
              rows={TENURE.map((r) => ({ label: r.label, value: r.value, display: `${r.value} yrs` }))}
              max={10}
              highlight={["25–34"]}
              ticks={[0, 5, 10]}
              format={(v) => `${v} yrs`}
            />
          </Figure>
          <P>
            The 25–34 bracket covers most first Saturn returns. BLS data also shows that the
            overall median tenure fell to 3.9 years in 2024, the lowest since 2002
            (<Cite source={S.blsTenure2024} />). Younger workers are not just changing
            jobs — they are doing so faster than any adult cohort.
          </P>
        </Section>

        <Section id="quarter-life" icon="compass" title="Quarter-life crisis research"
          answer={<>A LinkedIn survey found <b>75% of 25–33-year-olds</b> have experienced a quarter-life crisis, with 27 as the average age.</>}>
          <StatTiles stats={QLC} />
          <P>
            The quarter-life crisis — a period of career anxiety and identity questioning in
            the mid-to-late 20s — was defined in academic research by Oliver Robinson (University
            of Greenwich) and formally studied across eight countries. His cross-cultural study
            found crisis prevalence of 40% to 77% depending on the country.
          </P>
          <P>
            The LinkedIn survey's average crisis age (27) and Saturn's orbital period (29.457
            years) don't match exactly, but both point to the late 20s as a universal pinch
            point. The causes are secular — career pressure, comparison, delayed adulthood
            markers — not celestial. But the overlap is why astrology's framing resonates.
          </P>
        </Section>

        <Cta
          title="When is your Saturn return?"
          text="Enter your birth date and we'll calculate the exact transit dates."
          href="/saturn-return-calculator"
          label="Saturn return calculator"
        />

        <Section id="belief" icon="users" title="Who believes in astrology during their Saturn return?"
          answer={<>Millennials — the generation in or just past their first Saturn return — are the <b>most likely to believe in astrology</b>.</>}>
          <Figure
            title={`Share who are “somewhat” or “total” believers in astrology`}
            subtitle="Harris Poll survey of 2,069 US adults, January 2024."
            sources={[S.harris2024]}
          >
            <BarChart
              label="Astrology belief by generation: Millennials 83%, all Americans 69%, Gen X 65%, Gen Z 62%, Boomers 44%"
              rows={BELIEF.map((r) => ({ label: r.label, value: r.value }))}
              max={100}
              highlight={["Millennials (27–42)"]}
              ticks={[0, 50, 100]}
            />
          </Figure>
          <P>
            Born roughly 1981–1996, Millennials are now 30–45 and have all completed their
            first Saturn return. The 2024 Harris Poll found 83% of Millennials believe in
            astrology at some level — the highest of any generation — compared with 62% of
            Gen Z and 44% of Boomers (<Cite source={S.harris2024} />).
          </P>
          <P>
            Pew Research separately found that 43% of US women aged 18–49 believe in
            astrology, and 28% of all US adults consult astrology at least once a year
            (<Cite source={S.pew2025} />).
          </P>
        </Section>

        <Section id="culture" icon="star" title="Saturn return in pop culture"
          answer={<>From <b>Adele's <em>30</em></b> to No Doubt's <em>Return of Saturn</em>, the concept has become a mainstream cultural reference.</>}>
          <Figure title="Notable Saturn return references in popular culture" sources={[]}>
            <Table>
              <thead><tr><th>Year</th><th>Reference</th><th>Detail</th></tr></thead>
              <tbody>
                <tr><td className="n">1976</td><td className="b">Liz Greene, <em>Saturn: A New Look at an Old Devil</em></td><td>Influential astrology book that reframed Saturn as a planet of growth, not just hardship. Popularized the Saturn return in modern astrology.</td></tr>
                <tr><td className="n">2000</td><td className="b">No Doubt, <em>Return of Saturn</em></td><td>Band's fourth album, titled after the concept. Debuted at #2 on the Billboard 200. Nominated for Best Rock Album at the 43rd Grammys.</td></tr>
                <tr><td className="n">2020</td><td className="b">Caggie Dunlop, <em>Saturn Returns</em> podcast</td><td>Podcast exploring the quarter-life crisis through an astrological lens. Led to a book, <em>Saturn Returns: Your Cosmic Coming of Age</em> (2023).</td></tr>
                <tr><td className="n">2021</td><td className="b">Adele, <em>30</em></td><td>Album named after the age of her Saturn return. Adele said it was "inspired by" the transit and has a Saturn tattoo. Wikipedia "Saturn return" views spiked 65% in November 2021.</td></tr>
              </tbody>
            </Table>
          </Figure>
          <P>
            The phrase "Saturn return" has moved beyond astrology circles into mainstream
            vocabulary for the late-20s identity crisis. Podcasts, TikTok creators, and
            lifestyle media regularly use it as a framing device for career and relationship
            upheaval — whether or not the audience takes the astrology literally.
          </P>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. "${TITLE}." Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            <strong>Data sources:</strong> Life milestone data comes from the US Census Bureau's
            American Community Survey (marriage), the CDC's National Center for Health Statistics
            (births), and the Bureau of Labor Statistics (job tenure and longitudinal employment).
            Wikipedia pageview data is from the Wikimedia Foundation's Pageviews API, filtered
            to human traffic. Astrology belief data is from the 2024 Harris Poll and 2025 Pew
            Research Center surveys. Saturn's orbital period is from NASA. All statistics are
            free to reuse with a link to this page.
          </P>
        </SourceList>

        <Section icon="layers" title="Related">
          <Cards items={[
            { href: HUB_PATH, icon: "database", title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
            { href: "/astrology-data/astrology-statistics", icon: "chart", title: "Astrology statistics 2026", desc: "Belief rates, market size and app data." },
            { href: "/saturn-return-calculator", icon: "loop", title: "Saturn return calculator", desc: "Enter your birth date to find your exact Saturn return dates." },
            { href: "/astrology-data/birth-chart-statistics", icon: "sunrise", title: "Birth chart statistics", desc: "The most common Rising signs and Big Three from 62M births." },
          ]} />
        </Section>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
      </Body>
    </StatsPage>
  );
}
