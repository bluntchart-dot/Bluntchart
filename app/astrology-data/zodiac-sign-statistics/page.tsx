import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, Cite, StatTiles, Figure, BarChart, ColumnChart, Table, heat, Pending,
  Cta, Cards, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, ZODIAC_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-10-20";
const UPDATED_ISO = "2026-10-20";
const UPDATED_LABEL = "October 20, 2026";
const TITLE = "Zodiac Sign Statistics: Popularity, Birth Rates & Search Data";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "Which zodiac sign is the most common? Which is the most Googled? Birth rate data from 62M US births, Wikipedia pageviews for all 12 signs, Google search rankings, and seasonal interest patterns.",
  keywords: [
    "zodiac sign statistics", "most common zodiac sign", "most popular zodiac sign", "rarest zodiac sign",
    "most googled zodiac sign", "zodiac sign popularity", "most searched zodiac sign", "zodiac sign birth rate",
    "least common zodiac sign", "zodiac sign demographics", "zodiac sign data",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: "Cancer is the most common zodiac sign by birth, but Gemini is the most Googled. Data from 62M US births and 6.8M Wikipedia views.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac Sign Statistics: Which Sign Is Most Common — and Most Googled?",
    description: "Cancer leads by birth rate. Gemini leads by search interest. The full ranking, with sources.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const KEY: Stat[] = [
  { value: "Cancer", label: "is the most common US zodiac sign by birth, at 9.00%", source: S.bcZodiac, icon: "sun" },
  { value: "Gemini", label: "is the most searched zodiac sign on Google (US, 2021) and on Wikipedia", source: S.hypebae2021, icon: "search" },
  { value: "2.4×", label: "more Wikipedia views for Gemini than Leo, the least viewed sign article", source: S.wiki, icon: "chart" },
  { value: "6.8M", label: "total English Wikipedia views of the 12 zodiac sign articles in one year", source: S.wiki, icon: "globe" },
  { value: "88%", label: "of Americans know their zodiac sign", source: S.ipsos2019, icon: "users" },
  { value: "1.83M", label: "monthly Google searches worldwide for “zodiac signs”", source: S.hypebae2021, icon: "search" },
];

// Birth rates by zodiac sign, calendar dates, SSA 2000–2014.
type Row = { sign: string; share: number };
const BIRTH: Row[] = [
  { sign: "Cancer", share: 9.0 }, { sign: "Virgo", share: 8.96 }, { sign: "Leo", share: 8.88 },
  { sign: "Gemini", share: 8.47 }, { sign: "Libra", share: 8.41 }, { sign: "Taurus", share: 8.3 },
  { sign: "Scorpio", share: 8.22 }, { sign: "Pisces", share: 8.12 }, { sign: "Sagittarius", share: 8.08 },
  { sign: "Aquarius", share: 8.04 }, { sign: "Aries", share: 8.01 }, { sign: "Capricorn", share: 7.5 },
];
const bars = (rows: Row[]) => rows.map((r) => ({ label: r.sign, value: r.share }));

const BIRTH_TILES: Stat[] = [
  { value: "9.00%", label: "Cancer (Jun 21 – Jul 22): the most common US zodiac sign", source: S.bcZodiac, icon: "sun" },
  { value: "7.50%", label: "Capricorn (Dec 22 – Jan 19): the rarest US zodiac sign", source: S.bcZodiac, icon: "moon" },
  { value: "1.5pp", label: "separates the most from the least common sign — all 12 are close to even", source: S.bcZodiac, icon: "chart" },
  { value: "Sep 9", label: "is the most common birthday in the US; 9 of the 10 most common fall in September", source: S.ssa, icon: "star" },
];

// Wikipedia pageviews, Sep 2025 – Aug 2026, human traffic, English Wikipedia.
type WikiRow = { sign: string; views: number };
const WIKI_VIEWS: WikiRow[] = [
  { sign: "Gemini", views: 902539 },
  { sign: "Sagittarius", views: 851868 },
  { sign: "Capricorn", views: 637696 },
  { sign: "Aries", views: 614335 },
  { sign: "Scorpio", views: 543605 },
  { sign: "Virgo", views: 526107 },
  { sign: "Aquarius", views: 514658 },
  { sign: "Taurus", views: 501665 },
  { sign: "Libra", views: 474234 },
  { sign: "Pisces", views: 470961 },
  { sign: "Cancer", views: 381858 },
  { sign: "Leo", views: 378289 },
];
const wikiRows = WIKI_VIEWS.map((r) => ({
  label: r.sign,
  value: r.views,
  display: `${(r.views / 1000).toFixed(0)}K`,
  tip: `${r.sign}: ${r.views.toLocaleString("en-US")} views`,
}));

// Google US search interest ranking, 2021.
const GOOGLE_RANK = [
  { rank: 1, sign: "Gemini" },
  { rank: 2, sign: "Virgo" },
  { rank: 3, sign: "Aries" },
  { rank: 4, sign: "Scorpio" },
  { rank: 5, sign: "Taurus" },
  { rank: 6, sign: "Pisces" },
  { rank: 7, sign: "Leo" },
  { rank: 8, sign: "Libra" },
  { rank: 9, sign: "Aquarius" },
  { rank: 10, sign: "Capricorn" },
  { rank: 11, sign: "Sagittarius" },
  { rank: 12, sign: "Cancer" },
];

// Birth rank lookup for comparison table.
const birthRankMap = new Map(BIRTH.map((r, i) => [r.sign, i + 1]));
const wikiRankMap = new Map(WIKI_VIEWS.map((r, i) => [r.sign, i + 1]));

// Seasonal search patterns: peak month views and off-peak average.
const SIGNS_ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SEASON_DATES = [
  "Mar 21 – Apr 19", "Apr 20 – May 20", "May 21 – Jun 20", "Jun 21 – Jul 22",
  "Jul 23 – Aug 22", "Aug 23 – Sep 22", "Sep 23 – Oct 22", "Oct 23 – Nov 21",
  "Nov 22 – Dec 21", "Dec 22 – Jan 19", "Jan 20 – Feb 18", "Feb 19 – Mar 20",
];
// Monthly views by sign, same order as SIGNS_ORDER.
const MONTHLY: number[][] = [
  [51706,52420,49807,48132,55782,50948,70324,64110,43397,42669,42374,42666],
  [35588,35339,34126,34677,39696,36013,37161,50225,45822,50457,50739,51822],
  [132046,73706,59478,55626,61523,57306,60614,68228,92187,92738,72366,76721],
  [32768,31652,31846,32248,33054,30777,30212,27835,29630,37068,40101,24667],
  [34621,32638,31293,30375,32136,27551,26231,24687,25888,28792,43134,40943],
  [67173,41055,37386,36122,39517,36875,66242,37894,37614,37263,38749,50217],
  [61092,69430,37958,34854,35575,33643,35344,32453,33395,33520,34428,32542],
  [50335,74971,73717,40950,40259,37620,39004,36117,37130,35775,38227,39500],
  [62104,79780,113538,105555,69086,59266,55428,57731,60467,63019,63060,62834],
  [53496,55506,53781,70302,83308,49353,47554,47503,47199,43411,44291,41992],
  [42430,41841,40038,41734,64074,61054,39244,35311,37012,35829,37335,38756],
  [40334,40253,39998,36594,40804,52912,54154,33564,33802,31810,33367,33369],
];
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
// Peak month index for each sign (where their season falls).
const peakData = SIGNS_ORDER.map((sign, i) => {
  const row = MONTHLY[i];
  const total = row.reduce((a, b) => a + b, 0);
  const avg = total / 12;
  const peakVal = Math.max(...row);
  const peakIdx = row.indexOf(peakVal);
  return { sign, season: SEASON_DATES[i], peakMonth: MONTHS[peakIdx], peakViews: peakVal, avg: Math.round(avg), ratio: +(peakVal / avg).toFixed(2) };
});

// Love horoscope search ranking, US, 2021.
const LOVE_RANK = [
  { label: "Leo", value: 5, display: "#1" },
  { label: "Gemini", value: 4, display: "#2" },
  { label: "Aries", value: 3, display: "#3" },
  { label: "Sagittarius", value: 2, display: "#4" },
  { label: "Pisces", value: 1, display: "#5" },
];

const AWARENESS: Stat[] = [
  { value: "88%", label: "of Americans know their zodiac sign", source: S.ipsos2019, icon: "users" },
  { value: "53%", label: "of those who know their sign say they identify with it", source: S.ipsos2019, icon: "star" },
  { value: "31%", label: "of adults 18–34 use horoscopes to understand parts of their life", source: S.ipsos2019, icon: "compass" },
  { value: "27%", label: "of US adults believe in astrology", source: S.pew2025, icon: "moon" },
];

const FAQS = [
  { q: "What is the most common zodiac sign?", a: "Cancer, at 9.00% of US births from 2000 to 2014 using calendar dates. This is because September (Cancer's birth month, Jun 21 – Jul 22, means most Cancer births are conceived in September–October, the peak conception period) has some of the highest birth rates. Using exact Sun ingress times, Leo edges ahead at 8.96%." },
  { q: "What is the rarest zodiac sign?", a: "Capricorn, at 7.50% of US births from 2000 to 2014. December 22 – January 19 spans the holiday period and the shortest days of the year, when birth rates are lower. February is the shortest month, making Aquarius a close second at 8.04%." },
  { q: "What is the most Googled zodiac sign?", a: "Gemini ranked first in Google US search interest in 2021, and also led English Wikipedia pageviews in the year ending August 2026 with 903K views. Gemini is only the 4th most common sign by birth, so curiosity about the sign outpaces its population share." },
  { q: "What is the least popular zodiac sign?", a: "It depends what you mean by popular. Cancer is the least searched on Google (ranked 12th in 2021 US data) despite being the most common by birth. By birth rate, Capricorn is the rarest at 7.50%." },
  { q: "Why is Gemini the most searched zodiac sign?", a: "There is no definitive answer. Gemini's reputation as a dual-natured, unpredictable sign may drive curiosity. The Gemini season (late May to June) also overlaps with school endings and summer planning, a period of high internet activity. Gemini has also been the most-memed sign on social media for years." },
  { q: "Do zodiac sign searches spike during that sign's season?", a: "Yes. Every zodiac sign's English Wikipedia article shows a clear traffic spike during that sign's season. The effect ranges from about 1.3× to 2× the off-season average, with Sagittarius showing the biggest seasonal surge." },
  { q: "How many people know their zodiac sign?", a: "88% of Americans know their zodiac sign, according to a 2019 Ipsos poll. Among those who know their sign, 53% say they identify with it. Awareness is high even among non-believers." },
  { q: "Are all zodiac signs equally common?", a: "Nearly. The most common sign (Cancer, 9.00%) is only 1.5 percentage points ahead of the rarest (Capricorn, 7.50%). If signs were perfectly even, each would be 8.33%. The variation comes from seasonal birth patterns, not the signs themselves." },
];

const SOURCES = [S.bcZodiac, S.ssa, S.cdc, S.wiki, S.hypebae2021, S.ipsos2019, S.pew2025];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function ZodiacSignStatisticsPage() {
  return (
    <StatsPage>
      <JsonLd data={articleJsonLd({
        headline: TITLE,
        description: "Birth rates, search interest and seasonal patterns for all 12 zodiac signs, from 62 million US births and 6.8 million Wikipedia views.",
        url: PAGE_URL, iso: UPDATED_ISO, published: PUBLISHED_ISO, citations: SOURCES.map((s) => s.url),
      })} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: DATA_HUB_URL },
        { name: "Zodiac Sign Statistics", url: PAGE_URL },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "Dataset",
        name: "Zodiac sign Wikipedia pageviews by month, Sep 2025 – Aug 2026",
        description: "Monthly English Wikipedia pageviews (human traffic, all access) for each of the 12 zodiac sign articles from September 2025 through August 2026, sourced from the Wikimedia Pageviews API.",
        url: `${PAGE_URL}#search-interest`, creator: { "@type": "Organization", name: "BluntChart" },
        isBasedOn: S.wiki.url, temporalCoverage: "2025-09/2026-08",
        license: "https://creativecommons.org/licenses/by/4.0/",
        distribution: [
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: "https://bluntchart.com/data/zodiac-sign-wikipedia-pageviews-2025-2026.csv" },
        ],
      }} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Zodiac Sign Statistics" }]}
        kicker="Data report"
        kickerIcon="chart"
        title={TITLE}
        lede="Cancer is the most common zodiac sign by birth — but Gemini is the most Googled. We ranked all 12 signs by birth rate, search interest and seasonal patterns, with every number sourced."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "users", text: "62.2M births analysed" }, { icon: "globe", text: "6.8M Wikipedia views" }, { icon: "book", text: `${SOURCES.length} sources` }]}
      />

      <Body toc={[
        { id: "key", label: "Key statistics" },
        { id: "birth", label: "Most common sign by birth" },
        { id: "search-interest", label: "Most searched signs" },
        { id: "google", label: "Google search ranking" },
        { id: "comparison", label: "Birth rank vs search rank" },
        { id: "seasonal", label: "Seasonal search patterns" },
        { id: "love", label: "Love horoscope searches" },
        { id: "awareness", label: "Who knows their sign?" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="key" icon="star" title="Key statistics">
          <StatTiles stats={KEY} highlightFirst />
        </Section>

        <Section id="birth" icon="sun" title="What is the most common zodiac sign?"
          answer={<><b>Cancer</b>, at 9.00% of US births. Capricorn is the rarest at 7.50%. But all 12 signs are close to even.</>}>
          <Figure
            title="Zodiac sign share of US births, 2000–2014"
            subtitle="Based on calendar dates. An even split would be 8.33% each."
            sources={[S.bcZodiac]}
            note={<a href="/data/us-births-by-zodiac-sign-2000-2014.csv" download>Download CSV</a>}
          >
            <BarChart label="Zodiac sign share of US births" rows={bars(BIRTH)} max={10} ticks={[0, 5, 10]} highlight={["Cancer", "Capricorn"]} />
          </Figure>
          <StatTiles stats={BIRTH_TILES} />
          <P>
            The variation is small: just 1.5 percentage points separate the most and least common signs.
            September is the busiest birth month in the US because conception rates peak in late autumn.
            That pushes Cancer (Jun 21 – Jul 22) and Virgo (Aug 23 – Sep 22) to the top.
            Capricorn spans the holiday season and the darkest days of winter, when fewer babies are born.
          </P>
          <P>
            Using exact Sun ingress times instead of calendar dates changes the order slightly: Leo edges
            ahead at 8.96%. See the full breakdown in our <a href="/astrology-data/birth-chart-statistics#sun">birth chart statistics</a> report.
          </P>
        </Section>

        <Section id="search-interest" icon="search" title="What is the most searched zodiac sign?"
          answer={<><b>Gemini</b> led both Wikipedia pageviews (903K) and Google US search interest. Leo was the least viewed on Wikipedia.</>}>
          <Figure
            title="English Wikipedia pageviews by zodiac sign, Sep 2025 – Aug 2026"
            subtitle={'Human traffic only. Each sign’s article, e.g. "Gemini (astrology)".'}

            sources={[S.wiki]}
            note={<a href="/data/zodiac-sign-wikipedia-pageviews-2025-2026.csv" download>Download CSV</a>}
          >
            <BarChart
              label="Wikipedia pageviews by zodiac sign: Gemini 903K, Sagittarius 852K, down to Leo 378K"
              rows={wikiRows}
              max={950000}
              ticks={[0, 500000, 950000]}
              format={(v) => `${(v / 1000).toFixed(0)}K`}
              highlight={["Gemini", "Leo"]}
            />
          </Figure>
          <P>
            Gemini gets 2.4× more Wikipedia traffic than Leo, even though Leo is a more common sign by birth.
            The ranking doesn't follow birth rates at all — Cancer, the most common sign, is 11th by Wikipedia views.
            Curiosity about a sign and how many people <em>are</em> that sign are two different things.
          </P>
        </Section>

        <Section id="google" icon="globe" title="Google search interest ranking (US, 2021)"
          answer={<><b>Gemini</b> ranked first and <b>Cancer</b> ranked last in Google's US search interest data.</>}>
          <Figure title="Zodiac signs ranked by Google US search interest, 2021" sources={[S.hypebae2021]}>
            <Table>
              <thead><tr><th>Rank</th><th>Sign</th><th>Wikipedia rank</th><th>Birth rank</th></tr></thead>
              <tbody>
                {GOOGLE_RANK.map((r) => (
                  <tr key={r.sign}>
                    <td className="n">{r.rank}</td>
                    <td className="b">{r.sign}</td>
                    <td className="n">#{wikiRankMap.get(r.sign)}</td>
                    <td className="n">#{birthRankMap.get(r.sign)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            The Google ranking is from 2021 and may have shifted since. The Wikipedia data (Sep 2025 – Aug 2026)
            broadly confirms the same pattern: Gemini leads, Cancer trails. Sagittarius is the biggest mover —
            ranked 11th by Google in 2021 but 2nd on Wikipedia in 2025–2026.
          </P>
        </Section>

        <Section id="comparison" icon="layers" title="Birth rank vs search rank"
          answer={<>The biggest gap: <b>Cancer is #1 by birth but #11 by search</b>. Capricorn is #12 by birth but #3 by search.</>}>
          <Figure title="Signs where birth rank and search rank diverge most" subtitle="Birth rank from SSA data; search rank from Wikipedia pageviews." sources={[S.bcZodiac, S.wiki]}>
            <Table>
              <thead><tr><th>Sign</th><th>Birth rank</th><th>Search rank</th><th>Gap</th></tr></thead>
              <tbody>
                {[
                  { sign: "Cancer", birth: 1, search: 11, gap: -10 },
                  { sign: "Leo", birth: 3, search: 12, gap: -9 },
                  { sign: "Capricorn", birth: 12, search: 3, gap: +9 },
                  { sign: "Sagittarius", birth: 9, search: 2, gap: +7 },
                  { sign: "Gemini", birth: 4, search: 1, gap: +3 },
                  { sign: "Scorpio", birth: 7, search: 5, gap: +2 },
                ].map((r) => (
                  <tr key={r.sign}>
                    <td className="b">{r.sign}</td>
                    <td className="n">#{r.birth}</td>
                    <td className="n">#{r.search}</td>
                    <td className="n">{r.gap > 0 ? `▲ +${r.gap}` : `▼ ${r.gap}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            Cancer and Leo are under-searched relative to how common they are. Capricorn and Sagittarius
            are over-searched. This suggests that <strong>rarity or mystique drives search interest</strong> more
            than population share.
          </P>
        </Section>

        <Cta
          title="Which sign are you?"
          text="Get your Sun, Moon and Rising signs instantly — free, no signup."
          href="/free-birth-chart"
          label="Free birth chart"
        />

        <Section id="seasonal" icon="trend" title="Do zodiac sign searches spike during that sign's season?"
          answer={<><b>Yes.</b> Every sign's Wikipedia article peaks during its season, typically 1.3–2× above the off-season average.</>}>
          <Figure
            title="Peak month and seasonal spike for each sign's Wikipedia article"
            subtitle="Sep 2025 – Aug 2026, human traffic only."
            sources={[S.wiki]}
          >
            <Table>
              <thead><tr><th>Sign</th><th>Season</th><th>Peak month</th><th>Peak views</th><th>Monthly avg</th><th>Spike</th></tr></thead>
              <tbody>
                {peakData.map((r) => (
                  <tr key={r.sign}>
                    <td className="b">{r.sign}</td>
                    <td>{r.season}</td>
                    <td className="b">{r.peakMonth}</td>
                    <td className="n">{r.peakViews.toLocaleString("en-US")}</td>
                    <td className="n">{r.avg.toLocaleString("en-US")}</td>
                    <td className="n">{r.ratio}×</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            People look up their own sign when the Sun is in it — probably to read their horoscope or share
            birthday-season content. Sagittarius shows the biggest spike (2.05×), likely amplified by the
            holiday gift-giving season. Taurus shows the smallest (1.21×), with a broad plateau from April to August.
          </P>
        </Section>

        <Section id="love" icon="moon" title="Love horoscope searches"
          answer={<><b>Leo</b> ranked first for love horoscope searches on Google in 2021, ahead of Gemini and Aries.</>}>
          <Figure title={'Top 5 zodiac signs by "love horoscope" Google searches, US, 2021'} sources={[S.hypebae2021]}>
            <BarChart
              label="Love horoscope searches: Leo #1, Gemini #2, Aries #3, Sagittarius #4, Pisces #5"
              rows={LOVE_RANK}
              max={5.5}
              highlight={["Leo"]}
              format={(v) => `#${6 - v}`}
            />
          </Figure>
          <P>
            Leo ranks 12th in solo Wikipedia views but 1st in love horoscope searches — suggesting Leo
            draws more romantic curiosity than general interest. The fire signs (Leo, Aries, Sagittarius)
            dominate the top 5.
          </P>
        </Section>

        <Section id="awareness" icon="users" title="How many people know their zodiac sign?"
          answer={<><b>88%</b> of Americans know their sign. Among those who do, 53% say they identify with it.</>}>
          <StatTiles stats={AWARENESS} />
          <P>
            Zodiac sign awareness far outpaces belief. Most Americans can name their sign whether or not
            they believe in astrology. Younger adults (18–34) are more likely to use horoscopes to understand
            their life (31%) than older adults (11% of 55+), even though older adults are <em>more</em> likely
            to know their sign (<Cite source={S.ipsos2019} />).
          </P>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. "${TITLE}." Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            <strong>Birth data:</strong> SSA daily US births, Jan 1, 2000 to Dec 31, 2014 (62,187,024 births),
            assigned to zodiac signs by calendar dates. See our <a href="/astrology-data/birth-chart-statistics#sources">methodology</a> for
            exact ingress calculations. <strong>Wikipedia data:</strong> English Wikipedia monthly pageviews
            (human traffic, all-access) from the Wikimedia Pageviews API, September 2025 through August 2026.
            Each sign uses its "(astrology)" article. <strong>Google data:</strong> the 2021 US search interest
            ranking is from Google, as reported by Hypebae. It reflects relative search interest, not absolute
            volumes. All tables are free to reuse with a link to this page.
          </P>
        </SourceList>

        <Section icon="layers" title="Related">
          <Cards items={[
            { href: HUB_PATH, icon: "database", title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
            { href: "/astrology-data/birth-chart-statistics", icon: "sunrise", title: "Birth chart statistics", desc: "Most common Rising signs and Big Three from 62M births." },
            { href: "/astrology-data/astrology-statistics", icon: "chart", title: "Astrology statistics 2026", desc: "Belief rates, market size and app data." },
            { href: "/free-birth-chart", icon: "star", title: "Free birth chart", desc: "Get your Sun, Moon and Rising signs." },
          ]} />
        </Section>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
      </Body>
    </StatsPage>
  );
}
