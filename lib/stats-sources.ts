import type { Source } from "@/components/stats/StatsUI";

/**
 * Every external source cited across the /astrology-data hub and its reports.
 * Pages pick the subset they use so their source lists stay accurate.
 */

export const DATA_HUB_URL = "https://bluntchart.com/astrology-data";
export const ASTROLOGY_STATS_URL = `${DATA_HUB_URL}/astrology-statistics`;
export const BIRTH_CHART_STATS_URL = `${DATA_HUB_URL}/birth-chart-statistics`;

export const S = {
  pew2025: {
    name: "Pew Research Center, “3 in 10 Americans consult astrology, tarot cards or fortune tellers” (May 21, 2025). Survey of 9,593 US adults, Oct 21–27, 2024.",
    short: "Pew Research Center, 2025",
    url: "https://www.pewresearch.org/religion/2025/05/21/3-in-10-americans-consult-astrology-tarot-cards-or-fortune-tellers/",
  },
  pewGlobal: {
    name: "Pew Research Center, “Spells, curses and ways to see the future: Beliefs & practices in 35 countries” (May 6, 2025).",
    short: "Pew Research Center, 35 countries, 2025",
    url: "https://www.pewresearch.org/religion/2025/05/06/spells-curses-and-ways-to-see-the-future/",
  },
  gallup2025: {
    name: "Gallup, “Paranormal Phenomena Met With Skepticism in U.S.” (July 23, 2025). 1,003 US adults, May 1–18, 2025.",
    short: "Gallup, 2025",
    url: "https://news.gallup.com/poll/692738/paranormal-phenomena-met-skepticism.aspx",
  },
  gallup2005: {
    name: "Gallup, “Three in Four Americans Believe in Paranormal” (June 16, 2005). 1,002 US adults, June 6–8, 2005; includes 1990, 1996 and 2001 trend.",
    short: "Gallup, 2005",
    url: "https://news.gallup.com/poll/16915/three-four-americans-believe-paranormal.aspx",
  },
  yougov2022: {
    name: "YouGov, “One in four Americans say they believe in astrology” (April 2022). Survey of 3,472 US adults, April 21–22, 2022.",
    short: "YouGov, 2022",
    url: "https://yougov.com/en-us/articles/42292-one-four-americans-say-they-believe-astrology",
  },
  yougovUK2015: {
    name: "YouGov, “8% of Britons believe horoscopes can predict the future” (July 3, 2015). Parallel GB and US surveys.",
    short: "YouGov UK, 2015",
    url: "https://yougov.com/en-gb/articles/12731-8-of-Britons-believe-horoscopes-predict-the-future",
  },
  ipsos2019: {
    name: "Ipsos, “Divides among public opinion on astrology and horoscopes” (2019). Survey of 1,005 US adults, Nov 26–27, 2019.",
    short: "Ipsos, 2019",
    url: "https://www.ipsos.com/en-us/news-polls/astrology-horoscopes",
  },
  nsf2018: {
    name: "National Science Board, Science & Engineering Indicators 2018, Ch. 7: Public Knowledge About S&T (General Social Survey data, 2016).",
    short: "NSF Science & Engineering Indicators, 2018",
    url: "https://ncses.nsf.gov/statistics/2018/nsb20181/report/sections/science-and-technology-public-attitudes-and-understanding/public-knowledge-about-s-t",
  },
  mrfr: {
    name: "Market Research Future, “Astrology Market Size, Share, Growth and Trends Forecast 2035.”",
    short: "Market Research Future",
    url: "https://www.marketresearchfuture.com/reports/astrology-market-22040",
  },
  tbrc: {
    name: "The Business Research Company via Research and Markets, “Astrology App Market Report 2026” (Feb 2026).",
    short: "The Business Research Company, 2026",
    url: "https://www.researchandmarkets.com/reports/6090017/astrology-app-market-report",
  },
  markntel: {
    name: "MarkNtel Advisors, “Astrology App Market: Size, Share, and Growth Report.”",
    short: "MarkNtel Advisors",
    url: "https://www.marknteladvisors.com/research-library/astrology-app-market.html",
  },
  ibis: {
    name: "IBISWorld, “Psychic Services in the US – Market Size Statistics” (2025).",
    short: "IBISWorld, 2025",
    url: "https://www.ibisworld.com/united-states/market-size/psychic-services/4413/",
  },
  astrotalk: {
    name: "BW Disrupt, “Astrotalk revenue jumps 85% to Rs 1,214 Cr” (FY25 results).",
    short: "BW Disrupt, 2025",
    url: "https://www.bwdisrupt.com/article/astrotalk-revenue-jumps-85-to-rs-1-214-cr-591016",
  },
  ssa: {
    name: "US Social Security Administration daily birth counts 2000–2014 (62,187,024 births), published by FiveThirtyEight.",
    short: "SSA births 2000–2014 via FiveThirtyEight",
    url: "https://github.com/fivethirtyeight/data/tree/master/births",
  },
  cdc: {
    name: "Martin JA, Hamilton BE, Osterman MJK. “When Are Babies Born: Morning, Noon, or Night? Birth Certificate Data for 2013.” NCHS Data Brief No. 200 (May 2015).",
    short: "CDC/NCHS Data Brief 200, 2015",
    url: "https://www.cdc.gov/nchs/products/databriefs/db200.htm",
  },
  census: {
    name: "US Census Bureau, “Center of Population” (2020 Census): Hartville, Missouri, 37.4°N, 92.4°W.",
    short: "US Census Bureau, 2020",
    url: "https://www.census.gov/geographies/reference-files/time-series/geo/centers-population.html",
  },
  astronomy: {
    name: "Don Cross, astronomy-engine (open-source astronomy library, validated against NASA JPL Horizons and NOVAS).",
    short: "astronomy-engine",
    url: "https://github.com/cosinekitty/astronomy",
  },
  appstore: {
    name: "Apple App Store (US) public listings for Co–Star, CHANI, Nebula and The Pattern, accessed September 2026.",
    short: "Apple App Store, Sept 2026",
    url: "https://apps.apple.com/us/app/co-star-personalized-astrology/id1264782561",
  },
  techcrunch2019: {
    name: "TechCrunch, “Co-Star raises $5 million to bring its astrology app to Android” (April 17, 2019).",
    short: "TechCrunch, 2019",
    url: "https://techcrunch.com/2019/04/17/co-star-astrology-app-seed-round/",
  },
  axios2021: {
    name: "Axios, “Astrology app Co-Star raises $15 million in new funding” (April 14, 2021).",
    short: "Axios, 2021",
    url: "https://www.axios.com/2021/04/14/astrology-app-co-star-raises-15-million-funding",
  },
  statista2026: {
    name: "Statista (data: AppMagic), “Leading horoscope and astrology apps in the United States as of 1st quarter 2026, by revenue” (June 2026).",
    short: "Statista / AppMagic, 2026",
    url: "https://www.statista.com/statistics/1451664/top-horoscope-apps-us-market-revenue/",
  },
  redditlist: {
    name: "RedditList, r/astrology subscriber statistics (September 2026).",
    short: "RedditList, Sept 2026",
    url: "https://redditli.st/subreddit/astrology",
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
    short: "Dean & Kelly, 2003",
    url: "https://philpapers.org/rec/DEAIAR",
  },
  wymanvyse: {
    name: "Wyman AJ, Vyse S. “Science Versus the Stars: A Double-Blind Test of the Validity of the NEO Five-Factor Inventory and Computer-Generated Astrological Natal Charts.” Journal of General Psychology 135(3), 287–300 (2008).",
    short: "Wyman & Vyse, 2008",
    url: "https://www.tandfonline.com/doi/abs/10.3200/GENP.135.3.287-300",
  },
  // BluntChart's own analyses, cited by their report pages.
  bcZodiac: {
    name: "BluntChart analysis: SSA daily US births 2000–2014 aggregated into tropical sun signs by conventional dates.",
    short: "BluntChart analysis of SSA data",
    url: `${ASTROLOGY_STATS_URL}#zodiac-births`,
  },
  bcChart: {
    name: "BluntChart analysis: 62,187,024 US births 2000–2014 (SSA) weighted by CDC hour-of-birth data, positions computed with astronomy-engine at the 2020 US center of population.",
    short: "BluntChart analysis of SSA + CDC data",
    url: `${BIRTH_CHART_STATS_URL}#sources`,
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof S;
