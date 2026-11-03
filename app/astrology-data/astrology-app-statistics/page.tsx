import type { Metadata } from "next";
import {
  StatsPage, JsonLd, Hero, Body, Section, P, Cite, StatTiles, Figure, BarChart, ColumnChart, Table, Pending,
  Cta, Cards, Faq, SourceList, PageFoot, faqJsonLd, breadcrumbJsonLd, articleJsonLd, HUB_PATH, type Stat,
} from "@/components/stats/StatsUI";
import { S, ASTROLOGY_APP_STATS_URL as PAGE_URL, DATA_HUB_URL } from "@/lib/stats-sources";

const PUBLISHED_ISO = "2026-11-03";
const UPDATED_ISO = "2026-11-03";
const UPDATED_LABEL = "November 3, 2026";
const TITLE = "Astrology App Statistics: Downloads, Revenue & Market Comparison";

export const metadata: Metadata = {
  title: `${TITLE} | BluntChart`,
  description:
    "Sourced data on the astrology app market: Co–Star, CHANI, Nebula, The Pattern and Sanctuary compared by downloads, revenue, ratings and pricing, plus market size and growth trends.",
  keywords: [
    "astrology app statistics", "astrology app downloads", "astrology app revenue",
    "co-star app downloads", "chani app revenue", "astrology app market size",
    "best astrology app", "astrology app comparison", "astrology app users",
    "nebula astrology app", "the pattern astrology app",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: TITLE,
    description: "The top 10 US astrology apps earned $40M in 2019. CHANI leads US revenue in 2026. Co–Star has 20M+ downloads. Full comparison with sourced data.",
    url: PAGE_URL,
    siteName: "BluntChart",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astrology App Statistics: Market Data & App Comparison",
    description: "Co–Star, CHANI, Nebula, The Pattern and Sanctuary compared. Market size, downloads, revenue and pricing — every number sourced.",
  },
  robots: { index: true, follow: true },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const KEY: Stat[] = [
  { value: "$40M", label: "in revenue from the top 10 US astrology apps in 2019, up 65% from 2018", source: S.sensorTower2020, icon: "coins" },
  { value: "20M+", label: "Co–Star downloads by 2021, four years after its 2017 launch", source: S.axios2021, icon: "phone" },
  { value: "#1 US", label: "CHANI is the highest-grossing US astrology app as of Q1 2026", source: S.statista2026, icon: "chart" },
  { value: "$1B", label: "Astrotalk valuation — India’s first astrology unicorn", source: S.inc42astrotalk, icon: "coins" },
  { value: "4.9 ★", label: "CHANI’s App Store rating from 59K reviews, the highest among major apps", source: S.appstore, icon: "star" },
  { value: "43%", label: "of US women aged 18–49 believe in astrology, the core app demographic", source: S.pew2025, icon: "users" },
];

const MARKET: Stat[] = [
  { value: "$4.75B", label: "estimated global astrology app market in 2025", source: S.tbrc, icon: "globe" },
  { value: "$5.69B", label: "projected for 2026, driven by AI personalization and subscription models", source: S.tbrc, icon: "chart" },
  { value: "19.8%", label: "compound annual growth rate (CAGR) projected from 2026 to 2030", source: S.tbrc, icon: "trend" },
  { value: "$11.71B", label: "projected market size by 2030", source: S.tbrc, icon: "coins" },
];

const REVENUE_HISTORY = [
  { label: "2016", value: 7.7, display: "$7.7M", tip: "2016: $7.7M — top 10 US astrology apps" },
  { label: "2018", value: 24.1, display: "$24.1M", tip: "2018: $24.1M (+213% vs 2016)" },
  { label: "2019", value: 40, display: "$40M", tip: "2019: $40M (+65% vs 2018)" },
];

const APPS = [
  { name: "Co–Star", rating: "4.8", reviews: "206K", pricing: "Free + in-app purchases", downloads: "20M+", dlNote: "by 2021" },
  { name: "CHANI", rating: "4.9", reviews: "59K", pricing: "$11.99/mo · $107.99/yr", downloads: "2M+", dlNote: "" },
  { name: "Nebula", rating: "4.6", reviews: "171K", pricing: "Varies by feature", downloads: "5M+", dlNote: "Google Play" },
  { name: "Sanctuary", rating: "4.8", reviews: "44K", pricing: "$4.99–$19.99/session", downloads: "—", dlNote: "" },
  { name: "The Pattern", rating: "4.0", reviews: "16K", pricing: "Free + $14.99/mo", downloads: "1M+", dlNote: "Google Play" },
];

const DOWNLOADS = [
  { label: "Co–Star", value: 20, display: "20M+", tip: "Co–Star: 20M+ downloads by 2021" },
  { label: "Nebula", value: 5, display: "5M+", tip: "Nebula: 5M+ Google Play downloads" },
  { label: "CHANI", value: 2, display: "2M+", tip: "CHANI: 2M+ downloads" },
  { label: "The Pattern", value: 1, display: "1M+", tip: "The Pattern: 1M+ Google Play downloads" },
];

const REVENUE_TILES: Stat[] = [
  { value: "#1 US", label: "CHANI is the highest-grossing US astrology app as of Q1 2026", source: S.statista2026, icon: "chart" },
  { value: "$14M", label: "in estimated 2019 revenue from a single app (Astrology & Palmistry Coach), 35% of the top 10", source: S.sensorTower2020, icon: "coins" },
  { value: "+20%", label: "astrology app market growth from 2025 to 2026", source: S.tbrc, icon: "trend" },
];

const FUNDING = [
  { company: "Co–Star", total: "$21M", rounds: "4 rounds", last: "Series A, $15M (April 2021)", lead: "Spark Capital" },
  { company: "Sanctuary", total: "$4.55M", rounds: "4 rounds", last: "Seed, $3M (May 2021)", lead: "Advancit Capital" },
];

const INDIA: Stat[] = [
  { value: "₹1,214 Cr", label: "Astrotalk operating revenue in FY25, up 85% from ₹651 Cr in FY24", source: S.astrotalk, icon: "chart" },
  { value: "₹250 Cr", label: "net profit in FY25, up 2.5× from ₹100 Cr", source: S.inc42astrotalk, icon: "coins" },
  { value: "$1B", label: "valuation after ESOP buyback — the first astrology unicorn globally", source: S.inc42astrotalk, icon: "star" },
  { value: "45%", label: "of adults in India consult a horoscope or fortune teller", source: S.pewGlobal, icon: "globe" },
];

const DEMOGRAPHICS: Stat[] = [
  { value: "35% vs 18%", label: "of US women vs men believe in astrology", source: S.pew2025, icon: "users" },
  { value: "43%", label: "of US women aged 18–49 believe in astrology", source: S.pew2025, icon: "users" },
  { value: "25%", label: "of US women 18–25 downloaded Co–Star by 2021 (company claim)", source: S.axios2021, icon: "phone" },
  { value: "28%", label: "of US adults consult astrology or a horoscope at least once a year", source: S.pew2025, icon: "compass" },
];

const FAQS = [
  { q: "What is the most popular astrology app?", a: "By downloads, Co–Star leads with over 20 million total downloads as of 2021. By revenue in the US, CHANI was the highest-grossing astrology app as of Q1 2026 according to Statista/AppMagic data. Globally, India’s Astrotalk generates the most revenue at ₹1,214 crore (~$145M) in FY25." },
  { q: "Which astrology app makes the most money?", a: "In the US, CHANI leads app revenue as of Q1 2026 through premium subscriptions priced at $11.99/month or $107.99/year. Globally, India’s Astrotalk reported ₹1,214 crore (~$145M) in FY25 operating revenue and became the first astrology company to reach a $1 billion valuation." },
  { q: "How much does an astrology app cost?", a: "Most astrology apps are free to download with optional paid features. CHANI charges $11.99/month or $107.99/year for full access. The Pattern offers a “Go Deeper+” subscription starting at $14.99/month. Sanctuary charges $4.99–$19.99 per live reading session. Co–Star is largely free with optional in-app purchases." },
  { q: "How big is the astrology app market?", a: "The Business Research Company estimated the global astrology app market at $4.75 billion in 2025 and $5.69 billion in 2026, with a projected 19.8% CAGR through 2030. The top 10 US apps alone generated $40 million in 2019, the last year Sensor Tower published category-level data." },
  { q: "Are astrology apps accurate?", a: "The planetary positions shown in astrology apps are astronomically accurate — they use the same ephemeris data as professional astronomy software. Whether astrological interpretations of those positions are meaningful is a separate question. Controlled studies have not found chart readings to predict personality better than chance." },
  { q: "How do astrology apps make money?", a: "The main models are: premium subscriptions (CHANI, The Pattern), in-app purchases (Co–Star, Nebula), per-session live readings (Sanctuary), and freemium features. Subscription-based apps like CHANI appear to generate the highest per-user revenue." },
  { q: "How many people use astrology apps?", a: "Reliable user counts are hard to verify because most apps do not publish them. Co–Star claimed 25% of US women aged 18–25 had downloaded it by 2021. Nebula lists 5 million+ Google Play downloads. The 28% of US adults who consult astrology at least yearly (Pew, 2024) sets an upper bound on the potential audience." },
];

const SOURCES = [S.sensorTower2020, S.tbrc, S.statista2026, S.appstore, S.axios2021, S.techcrunch2019, S.astrotalk, S.inc42astrotalk, S.pew2025, S.pewGlobal, S.markntel];

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function AstrologyAppStatisticsPage() {
  return (
    <StatsPage>
      <JsonLd data={articleJsonLd({
        headline: TITLE,
        description: "Sourced data on the astrology app market: downloads, revenue, ratings and pricing for the five leading US apps, plus market size, funding and growth trends.",
        url: PAGE_URL, iso: UPDATED_ISO, published: PUBLISHED_ISO, citations: SOURCES.map((s) => s.url),
      })} />
      <JsonLd data={faqJsonLd(FAQS)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "BluntChart", url: "https://bluntchart.com" },
        { name: "Astrology Data", url: DATA_HUB_URL },
        { name: "Astrology App Statistics", url: PAGE_URL },
      ])} />

      <Hero
        crumbs={[{ label: "BluntChart", href: "/" }, { label: "Astrology Data", href: HUB_PATH }, { label: "Astrology App Statistics" }]}
        kicker="Market data"
        kickerIcon="phone"
        title={TITLE}
        lede="How big is the astrology app market, which app earns the most, and how do Co–Star, CHANI, Nebula, The Pattern and Sanctuary compare? Every number sourced."
        updatedIso={UPDATED_ISO}
        updatedLabel={UPDATED_LABEL}
        pills={[{ icon: "book", text: `${SOURCES.length} sources` }, { icon: "chart", text: "35+ statistics" }]}
      />

      <Body toc={[
        { id: "key", label: "Key statistics" },
        { id: "market", label: "Market size" },
        { id: "revenue", label: "US app revenue growth" },
        { id: "apps", label: "Top apps compared" },
        { id: "downloads", label: "Downloads" },
        { id: "funding", label: "Funding & investment" },
        { id: "india", label: "India’s astrology market" },
        { id: "demographics", label: "Who uses astrology apps" },
        { id: "faq", label: "FAQ" },
        { id: "sources", label: "Sources" },
      ]}>
        <Section id="key" icon="star" title="Key statistics">
          <StatTiles stats={KEY} highlightFirst />
        </Section>

        <Section id="market" icon="globe" title="How big is the astrology app market?"
          answer={<>The global astrology app market was worth an estimated <b>$4.75 billion</b> in 2025 and is projected to nearly double by 2030.</>}>
          <StatTiles stats={MARKET} />
          <P>
            Market-size estimates vary widely across research firms. MarkNtel Advisors puts the 2026 market at
            $8.28 billion (<Cite source={S.markntel} />), while The Business Research Company gives $5.69 billion
            (<Cite source={S.tbrc} />). We show the lower, more conservative estimate. The disagreement comes from
            how firms define &ldquo;astrology app&rdquo; &mdash; some include all spiritual and horoscope services,
            others count only mobile apps. Growth is driven by AI-powered personalization, subscription pricing,
            and rising smartphone adoption in India and Southeast Asia.
          </P>
        </Section>

        <Section id="revenue" icon="coins" title="US astrology app revenue growth"
          answer={<>The top 10 US apps earned <b>$40 million in 2019</b>, up from $7.7 million in 2016 &mdash; a fivefold increase in three years.</>}>
          <Figure
            title="Top 10 US astrology app revenue, 2016&ndash;2019"
            subtitle="Sensor Tower Store Intelligence data. 2019 was the last year this data was published at the category level."
            sources={[S.sensorTower2020]}
          >
            <ColumnChart
              label="Top 10 US astrology app revenue: $7.7M in 2016, $24.1M in 2018, $40M in 2019"
              max={45}
              highlight={["2019"]}
              cols={REVENUE_HISTORY}
            />
          </Figure>
          <StatTiles stats={REVENUE_TILES} />
          <P>
            In 2019, a single app &mdash; Astrology &amp; Palmistry Coach &mdash; accounted for $14 million
            (35%) of the top 10&rsquo;s revenue. Downloads across the top 10 grew just 3% that year, while
            revenue grew 65%, suggesting apps were getting better at monetization rather than just growing
            their reach (<Cite source={S.sensorTower2020} />). For comparison, the top 10 meditation apps
            earned $195 million in the same period &mdash; nearly five times as much.
          </P>
          <Pending title="2020&ndash;2026 US app revenue">
            Sensor Tower and AppMagic have not published astrology-category revenue data since 2019.
            Statista&rsquo;s Q1 2026 chart shows CHANI as the top US earner but does not include revenue
            figures publicly. We will update this section when category-level data is published.
          </Pending>
        </Section>

        <Section id="apps" icon="phone" title="Top astrology apps compared"
          answer={<><b>CHANI</b> has the highest rating (4.9&#9733;). <b>Co&#8211;Star</b> leads downloads. <b>Nebula</b> has the most reviews.</>}>
          <Figure title="Leading US astrology apps, iOS App Store" subtitle="Ratings, review counts and pricing as of September 2026." sources={[S.appstore]}>
            <Table>
              <thead>
                <tr><th>App</th><th>Rating</th><th>Reviews</th><th>Pricing model</th></tr>
              </thead>
              <tbody>
                {APPS.map((a) => (
                  <tr key={a.name}>
                    <td className="b">{a.name}</td>
                    <td className="n">{a.rating} &#9733;</td>
                    <td className="n">{a.reviews}</td>
                    <td>{a.pricing}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            Rating counts are a rough proxy for reach. Nebula&rsquo;s 171K reviews put it ahead by volume,
            but many reviews come from prompted in-app rating requests, so a higher count does not always mean
            more active users. Co&#8211;Star and CHANI consistently score higher on user satisfaction. Sanctuary
            stands apart with its live-reader model &mdash; users pay per session rather than subscribing &mdash;
            while The Pattern takes a personality-first approach that does not require astrological knowledge.
          </P>
        </Section>

        <Section id="downloads" icon="download" title="Downloads"
          answer={<><b>Co&#8211;Star</b> leads with 20M+ total downloads by 2021. Most apps do not publish download figures.</>}>
          <Figure
            title="Reported lifetime downloads for major astrology apps"
            subtitle="Figures come from company claims, funding announcements and Google Play public data. They cover different dates and platforms &mdash; not a like-for-like comparison."
            sources={[S.axios2021, S.appstore]}
          >
            <BarChart
              label="Astrology app downloads: Co&#8211;Star 20M+, Nebula 5M+, CHANI 2M+, The Pattern 1M+"
              rows={DOWNLOADS}
              max={25}
              ticks={[0, 10, 20]}
              format={(v) => `${v}M`}
              highlight={["Co–Star"]}
            />
          </Figure>
          <P>
            Co&#8211;Star&rsquo;s 20M+ figure comes from its April 2021 funding announcement
            (<Cite source={S.axios2021} />). The company also claimed that 25% of US women aged 18&ndash;25
            had downloaded the app by that point. Nebula and The Pattern figures come from Google Play&rsquo;s
            public install counts and do not include iOS. Sanctuary does not publish download data. Real
            lifetime downloads for all apps are likely higher than the figures shown, since app stores report
            minimums and company claims date to specific points in time.
          </P>
        </Section>

        <Section id="funding" icon="chart" title="Funding and investment"
          answer={<><b>Co&#8211;Star</b> raised the most US venture capital ($21M). Astrotalk in India reached a $1B valuation.</>}>
          <Figure title="Venture funding for major astrology apps" subtitle="US-based apps. Astrotalk (India) reached $1B via ESOP buyback, not VC." sources={[S.axios2021, S.techcrunch2019, S.inc42astrotalk]}>
            <Table>
              <thead><tr><th>Company</th><th>Total raised</th><th>Last round</th><th>Lead investor</th></tr></thead>
              <tbody>
                {FUNDING.map((f) => (
                  <tr key={f.company}>
                    <td className="b">{f.company}</td>
                    <td className="n">{f.total}</td>
                    <td>{f.last}</td>
                    <td>{f.lead}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Figure>
          <P>
            Co&#8211;Star raised a $5.2 million seed round in 2019 (<Cite source={S.techcrunch2019} />) and a
            $15 million Series A led by Spark Capital in 2021 (<Cite source={S.axios2021} />), bringing its
            total to approximately $21 million across four rounds. CHANI has not disclosed external funding.
            The Pattern and Nebula operate under different business structures that are not directly comparable.
            Astrotalk in India became the first astrology unicorn in January 2026 after an ESOP buyback valued
            the company at $1 billion (<Cite source={S.inc42astrotalk} />).
          </P>
        </Section>

        <Cta
          title="Your chart, no subscription."
          text="BluntChart gives you a full birth chart with honest interpretations &mdash; no monthly fee."
          href="/free-birth-chart"
          label="Free birth chart"
        />

        <Section id="india" icon="globe" title="India&rsquo;s astrology app market"
          answer={<>India&rsquo;s <b>Astrotalk</b> is the world&rsquo;s highest-revenue astrology platform, hitting a $1B valuation in January 2026.</>}>
          <StatTiles stats={INDIA} highlightFirst />
          <P>
            Astrotalk connects users with astrologers for paid consultations via chat, call and video. Its
            FY25 operating revenue of &#8377;1,214 crore (~$145M USD) dwarfs every Western astrology app
            combined. The company also launched an e-commerce arm selling spiritual products, which hit
            &#8377;200 crore in annualised revenue within its first year (<Cite source={S.inc42astrotalk} />).
            India&rsquo;s astrology market is driven by deep cultural integration: 45% of Indian adults consult
            horoscopes or fortune tellers, more than four times the US rate (<Cite source={S.pewGlobal} />).
            Other Indian platforms include Astroyogi, InstaAstro and AstroSage.
          </P>
        </Section>

        <Section id="demographics" icon="users" title="Who uses astrology apps?"
          answer={<>The audience skews young and female. <b>43%</b> of US women aged 18&ndash;49 believe in astrology.</>}>
          <StatTiles stats={DEMOGRAPHICS} />
          <P>
            Pew Research found that women are about twice as likely as men to believe in astrology
            (35% vs 18%), with the gender gap widest among adults under 50 (<Cite source={S.pew2025} />).
            Co&#8211;Star claimed that by 2021, 25% of US women aged 18&ndash;25 had downloaded their app &mdash; a
            company figure, not independently verified (<Cite source={S.axios2021} />). Americans under 65
            are more likely to consult astrology than those 65 and older, but the belief rate has barely changed
            in 35 years, hovering between 24% and 29% in every major poll since 1990.
          </P>
          <Pending title="app-level user demographics">
            No major astrology app publishes a demographic breakdown of its active users. The figures above
            come from population surveys, not app analytics. App-specific data would require a Nielsen or
            Comscore category report, which has not been publicly released for this category.
          </Pending>
        </Section>

        <Section id="faq" icon="help" title="FAQ">
          <Faq items={FAQS} />
        </Section>

        <SourceList sources={SOURCES} citeAs={`BluntChart. “${TITLE}.” Updated ${UPDATED_LABEL}. ${PAGE_URL}`}>
          <P>
            <strong>Data quality note:</strong> Astrology app revenue and download figures are among the
            hardest to verify in the mobile market. Most apps are privately held and do not publish financials.
            Third-party analytics tools (Sensor Tower, AppMagic, AppCurrents) use modeled estimates that
            can differ by 3&ndash;5&times; for the same app. We cite the most authoritative source for each
            figure &mdash; company announcements where available, Sensor Tower or Statista for market-level
            data &mdash; and flag estimates as such. Market-size figures from research firms vary by
            2&ndash;6&times; depending on how &ldquo;astrology app&rdquo; is defined.
          </P>
        </SourceList>

        <Section icon="layers" title="Related">
          <Cards items={[
            { href: HUB_PATH, icon: "database", title: "Astrology data hub", desc: "All BluntChart reports and downloadable datasets." },
            { href: "/astrology-data/astrology-statistics", icon: "chart", title: "Astrology statistics 2026", desc: "Belief rates, market size and demographic data." },
            { href: "/astrology-data/birth-chart-statistics", icon: "sunrise", title: "Birth chart statistics", desc: "Original data from 62M US births." },
          ]} />
        </Section>

        <PageFoot updatedIso={UPDATED_ISO} updatedLabel={UPDATED_LABEL} />
      </Body>
    </StatsPage>
  );
}
