import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Crumbs, PageHeader, Toc, Section, P, Cite, StatList, Table, Bar, Pending, Cta,
  LinkList, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, ASTROLOGY_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-09-29";
const UPDATED_ISO = "2026-10-07";
const UPDATED_LABEL = "October 7, 2026";
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
  { value: "27%", label: "of US adults say they believe in astrology", source: S.pew2025 },
  { value: "28%", label: "consult astrology or a horoscope at least once a year", source: S.pew2025 },
  { value: "43%", label: "of US women aged 18–49 believe in astrology", source: S.pew2025 },
  { value: "88%", label: "of Americans know their zodiac sign", source: S.ipsos2019 },
  { value: "Cancer", label: "is the most common US zodiac sign (9.00% of births)", source: S.bcZodiac },
  { value: "$15.16B", label: "estimated global astrology market in 2025", source: S.mrfr },
];

const BELIEF: Stat[] = [
  { value: "27%", label: "of US adults believe in astrology (Oct 2024), statistically unchanged from 29% in 2017", source: S.pew2025 },
  { value: "24%", label: "believe in astrology in Gallup’s May 2025 poll; 55% don’t and about 20% are unsure", source: S.gallup2025 },
  { value: "~1 in 10", label: "Americans consult tarot cards at least once a year; 6% consult a fortune teller", source: S.pew2025 },
  { value: "20%", label: "engage with astrology, tarot or fortune telling mostly “just for fun”", source: S.pew2025 },
  { value: "1%", label: "rely “a lot” on these practices when making major life decisions", source: S.pew2025 },
];

const DEMO: { group: string; value: string; metric: string; source: keyof typeof S }[] = [
  { group: "LGBT adults", value: "54%", metric: "consult astrology yearly", source: "pew2025" },
  { group: "Women, 18–49", value: "46%", metric: "consult astrology yearly", source: "pew2025" },
  { group: "Women, 18–49", value: "43%", metric: "believe in astrology", source: "pew2025" },
  { group: "Women, all ages", value: "37%", metric: "consult astrology yearly", source: "pew2025" },
  { group: "Adults under 30", value: "37%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Hispanic Americans", value: "32%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Black Americans", value: "31%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Catholics", value: "31%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Women", value: "30%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Men", value: "25%", metric: "believe in astrology", source: "yougov2022" },
  { group: "White Americans", value: "25%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Protestants", value: "22%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Adults 65+", value: "16%", metric: "believe in astrology", source: "yougov2022" },
  { group: "Atheists", value: "10%", metric: "believe in astrology", source: "yougov2022" },
];

const ZODIAC = [
  { sign: "Cancer", dates: "Jun 21 – Jul 22", births: 5595033, share: 9.0 },
  { sign: "Virgo", dates: "Aug 23 – Sep 22", births: 5574916, share: 8.96 },
  { sign: "Leo", dates: "Jul 23 – Aug 22", births: 5521329, share: 8.88 },
  { sign: "Gemini", dates: "May 21 – Jun 20", births: 5267980, share: 8.47 },
  { sign: "Libra", dates: "Sep 23 – Oct 22", births: 5228627, share: 8.41 },
  { sign: "Taurus", dates: "Apr 20 – May 20", births: 5161756, share: 8.3 },
  { sign: "Scorpio", dates: "Oct 23 – Nov 21", births: 5114444, share: 8.22 },
  { sign: "Pisces", dates: "Feb 19 – Mar 20", births: 5051808, share: 8.12 },
  { sign: "Sagittarius", dates: "Nov 22 – Dec 21", births: 5023366, share: 8.08 },
  { sign: "Aquarius", dates: "Jan 20 – Feb 18", births: 5001409, share: 8.04 },
  { sign: "Aries", dates: "Mar 21 – Apr 19", births: 4983157, share: 8.01 },
  { sign: "Capricorn", dates: "Dec 22 – Jan 19", births: 4663199, share: 7.5 },
];

const MARKET: Stat[] = [
  { value: "$15.16B", label: "global astrology market in 2025, projected to reach $27.15B by 2035 (6.0% CAGR)", source: S.mrfr },
  { value: "~45%", label: "of the global astrology market is in North America", source: S.mrfr },
  { value: "$5.69B", label: "astrology app market in 2026, projected to reach $11.71B by 2030", source: S.tbrc },
  { value: "$7.11B", label: "an alternative 2025 app-market estimate, projected to $13.48B by 2032", source: S.markntel },
  { value: "$2.3B", label: "US psychic services revenue in 2025 (astrology, tarot, mediumship)", source: S.ibis },
  { value: "+85%", label: "Astrotalk (India) FY25 revenue growth, to ₹1,214 crore", source: S.astrotalk },
];

const APPS = [
  { app: "Co–Star", rating: "4.8", ratings: "206K", price: "$8.99/mo" },
  { app: "Nebula", rating: "4.6", ratings: "171K", price: "$2.99–$49.99/mo" },
  { app: "CHANI", rating: "4.9", ratings: "59K", price: "$11.99/mo" },
  { app: "The Pattern", rating: "4.0", ratings: "15K", price: "$14.99/mo" },
];

const APP_STATS: Stat[] = [
  { value: "20M+", label: "Co–Star downloads by April 2021", source: S.axios2021 },
  { value: "1 in 4", label: "US women aged 18–25 had downloaded Co–Star by 2021, per the company", source: S.axios2021 },
  { value: "$15M", label: "Co–Star Series A led by Spark Capital (2021)", source: S.axios2021 },
  { value: "$5.2M", label: "Co–Star seed round (2019)", source: S.techcrunch2019 },
  { value: "Top 2", label: "CHANI and Co–Star led US astrology apps by revenue in Q1 2026", source: S.statista2026 },
];

const HABITS: Stat[] = [
  { value: "53%", label: "of people who know their sign say they identify with it", source: S.ipsos2019 },
  { value: "5%", label: "of Americans check their horoscope often", source: S.ipsos2019 },
  { value: "31%", label: "of 18–34-year-olds use horoscopes to understand their lives, vs 11% of those 55+", source: S.ipsos2019 },
  { value: "32%", label: "of horoscope users use them to check relationship compatibility", source: S.ipsos2019 },
];

const SOCIAL: Stat[] = [
  { value: "2.1M", label: "r/astrology subscribers in September 2026 (2,102,160)", source: S.redditlist },
  { value: "Feb 2025", label: "the month r/astrology passed 2 million subscribers", source: S.redditlist },
  { value: "+75,159", label: "r/astrology’s biggest single month of growth (January 2025)", source: S.redditlist },
];

const SCIENCE: Stat[] = [
  { value: "60%", label: "of Americans said astrology is “not at all scientific” in 2016; 37% said it is “sort of” or “very” scientific", source: S.nsf2018 },
  { value: "54%", label: "of 18–24-year-olds rejected astrology as unscientific, the lowest of any age group", source: S.nsf2018 },
  { value: "76% vs 57%", label: "of college graduates vs high-school graduates called astrology unscientific", source: S.nsf2018 },
];

const GLOBAL: Stat[] = [
  { value: "47%", label: "of adults in South Africa consult a fortune teller or horoscope, the highest of 35 countries", source: S.pewGlobal },
  { value: "45%", label: "of adults in India do the same", source: S.pewGlobal },
  { value: "4%", label: "in Greece, the lowest of the 35 countries", source: S.pewGlobal },
  { value: "8%", label: "of Britons believe horoscopes can predict the future (vs 14% of Americans asked the same question)", source: S.yougovUK2015 },
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
  S.pew2025, S.gallup2025, S.yougov2022, S.ipsos2019, S.nsf2018, S.pewGlobal, S.yougovUK2015, S.ssa,
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

      <Crumbs items={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Astrology Statistics" }]} />
      <PageHeader
        kicker="Report"
        title={TITLE}
        lede="How many people believe in astrology, who they are, how big the industry is, and which zodiac sign is most common. Every number links to its original source."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        meta={`${SOURCES.length} sources`}
      />

      <Section id="key" title="Key statistics">
        <StatList stats={KEY} />
      </Section>

      <Toc items={[
        { id: "belief", label: "How many people believe" },
        { id: "demographics", label: "Belief by demographic" },
        { id: "zodiac-births", label: "Most common zodiac signs" },
        { id: "market", label: "Market size" },
        { id: "apps", label: "Astrology apps" },
        { id: "habits", label: "Horoscope habits" },
        { id: "social", label: "Online communities" },
        { id: "science", label: "Is astrology seen as scientific?" },
        { id: "global", label: "Around the world" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]} />

      <Section id="belief" title="How many people believe in astrology?" answer="About 1 in 4 US adults: 27% in Pew’s 2024 survey and 24% in Gallup’s 2025 poll.">
        <StatList stats={BELIEF} />
        <P>
          Belief has barely moved despite the rise of astrology apps. Gallup recorded 25% in 1990 and 28%
          in 2001 (<Cite source={S.gallup2005} />). Our <a href="/astrology-data#popularity">data hub</a>{" "}
          charts the full 35-year trend.
        </P>
      </Section>

      <Section id="demographics" title="Astrology belief by demographic" answer="Gender and age matter most. Younger women and LGBT adults are the most engaged groups.">
        <Table note="Pew and YouGov use different questions and samples, so compare figures within a source rather than across sources.">
          <thead><tr><th>Group</th><th>Share</th><th>Measure</th><th>Source</th></tr></thead>
          <tbody>
            {DEMO.map((r) => (
              <tr key={r.group + r.metric}>
                <td className="b">{r.group}</td>
                <td className="n">{r.value}</td>
                <td>{r.metric}</td>
                <td><Cite source={S[r.source]} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="zodiac-births" title="What is the most common zodiac sign?" answer="Cancer, at 9.00% of US births. Capricorn is the rarest, at 7.50%.">
        <P>
          We grouped 62,187,024 US births from 2000–2014 (<Cite source={S.ssa} />) by the standard
          calendar dates for each sign. The late-summer signs lead because August, July and September are
          the busiest birth months. Capricorn trails because its season includes Christmas and New
          Year’s Day, the two least common birthdays.
        </P>
        <Table note={<>Bar scale starts at 7%. Using exact Sun ingress times instead of calendar dates, Leo, Virgo and Cancer are nearly tied (see <a href="/astrology-data/birth-chart-statistics#sun">birth chart statistics</a>). <a href="/data/us-births-by-zodiac-sign-2000-2014.csv">Download CSV</a>.</>}>
          <thead><tr><th>Sign</th><th>Dates</th><th>Births</th><th>Share</th><th style={{ width: "28%" }}></th></tr></thead>
          <tbody>
            {ZODIAC.map((z) => (
              <tr key={z.sign}>
                <td className="b"><a href={`/sun-in-${z.sign.toLowerCase()}`} style={{ color: "inherit", textDecoration: "none" }}>{z.sign}</a></td>
                <td className="n">{z.dates}</td>
                <td>{z.births.toLocaleString("en-US")}</td>
                <td className="n">{z.share.toFixed(2)}%</td>
                <td><Bar value={z.share} min={7} max={9} /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section id="market" title="Astrology market size" answer="Roughly $15 billion globally in 2025. Apps are the fastest-growing segment.">
        <StatList stats={MARKET} />
        <P>Firms define “the astrology market” differently, so cite the firm along with the number.</P>
      </Section>

      <Section id="apps" title="Astrology app statistics" answer="Co–Star is the most-downloaded astrology app. CHANI and Co–Star led US revenue in Q1 2026.">
        <StatList stats={APP_STATS} />
        <Table note={<>Source: <Cite source={S.appstore} />. Rating counts are a rough proxy for user base. See our <a href="/astrology-app-alternatives">app comparison</a>.</>}>
          <thead><tr><th>App</th><th>Rating</th><th>Ratings</th><th>Price</th></tr></thead>
          <tbody>
            {APPS.map((a) => (
              <tr key={a.app}><td className="b">{a.app}</td><td className="n">{a.rating}</td><td>{a.ratings}</td><td className="n">{a.price}</td></tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Cta
        text={<><strong>You’re one of the 88% who know their sign.</strong> Your Moon and Rising say more. Get the full chart, calculated from your exact birth time.</>}
        href="/free-birth-chart"
        label="Free birth chart"
      />

      <Section id="habits" title="Zodiac sign and horoscope habits" answer="Most Americans know their sign, but only about half identify with it.">
        <StatList stats={HABITS} />
      </Section>

      <Section id="social" title="Astrology online communities" answer="Reddit’s r/astrology has more than 2.1 million members.">
        <StatList stats={SOCIAL} />
        <Pending title="TikTok and Instagram">
          Hashtag view counts are widely quoted but no longer shown consistently by TikTok, and we couldn’t
          verify a current figure from a primary source.
        </Pending>
      </Section>

      <Section id="science" title="Do people think astrology is scientific?" answer="Most don’t: 60% of Americans called it “not at all scientific” in 2016.">
        <StatList stats={SCIENCE} />
      </Section>

      <Section id="global" title="Astrology around the world" answer="Use is highest in South Africa and India and lowest in Greece.">
        <StatList stats={GLOBAL} />
        <P>
          Pew’s 35-country question covers fortune tellers and horoscopes together, so its US figure (about
          9%) is lower than the US-only survey above (<Cite source={S.pewGlobal} />).
        </P>
      </Section>

      <Section id="faq" title="FAQ">
        <Faq items={FAQS} />
      </Section>

      <SourceList sources={SOURCES} citeAs={`BluntChart. “${TITLE}.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
        <P>
          We use primary sources (survey organisations, government data, company announcements and public
          app listings) over secondary roundups. Market sizes come from commercial research firms. We quote
          their published headline numbers and name the firm. Zodiac births sum SSA daily counts for
          2000–2014 into signs using conventional start dates (Aquarius Jan 20, Pisces Feb 19, Aries Mar 21,
          Taurus Apr 20, Gemini May 21, Cancer Jun 21, Leo Jul 23, Virgo Aug 23, Libra Sep 23, Scorpio Oct
          23, Sagittarius Nov 22, Capricorn Dec 22). Anything we couldn’t verify is marked “Data pending”.
        </P>
      </SourceList>

      <Section title="Related">
        <LinkList items={[
          { href: HUB_PATH, title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
          { href: "/astrology-data/birth-chart-statistics", title: "Birth chart statistics", desc: "The most common Rising signs and Big Three combinations from 62M births." },
          { href: "/big-three-calculator", title: "Big Three calculator", desc: "Your Sun, Moon and Rising signs." },
        ]} />
      </Section>

      <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
    </StatsPage>
  );
}
