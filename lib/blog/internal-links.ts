import { TARGET_PRODUCTS, type TargetProduct } from "./config";

const BASE_URL = "https://bluntchart.com";

/**
 * Verified live BluntChart routes for internal linking.
 * Every entry is confirmed from the live sitemap — do not add
 * routes here until they are deployed and indexed.
 */
export const LINKABLE_PAGES = {
  freeBirthChart: { url: `${BASE_URL}/free-birth-chart`, label: "free birth chart" },
  natalChart: { url: `${BASE_URL}/natal-chart`, label: "natal chart" },
  bigThreeCalc: { url: `${BASE_URL}/big-three-calculator`, label: "Big Three calculator" },
  moonSignCalc: { url: `${BASE_URL}/moon-sign-calculator`, label: "Moon sign calculator" },
  risingSignCalc: { url: `${BASE_URL}/rising-sign-calculator`, label: "Rising sign calculator" },
  saturnReturnCalc: { url: `${BASE_URL}/saturn-return-calculator`, label: "Saturn Return calculator" },
  redFlagsQuiz: { url: `${BASE_URL}/relationship-red-flags-birth-chart`, label: "relationship red flags quiz" },
  careerStrength: { url: `${BASE_URL}/career-strength-birth-chart`, label: "career strength calculator" },
  loveLanguage: { url: `${BASE_URL}/love-language-birth-chart`, label: "love language calculator" },
  toxicityQuiz: { url: `${BASE_URL}/how-toxic-are-you-quiz`, label: "toxicity quiz" },
  whyYouAttract: { url: `${BASE_URL}/why-you-attract-the-wrong-person`, label: "why you attract the wrong person" },
  freeBirthChartReadings: { url: `${BASE_URL}/free-birth-chart-readings`, label: "free birth chart readings" },
  paidReading: { url: `${BASE_URL}/#try-it`, label: "personalized reading" },
} as const;

/**
 * Maps content clusters to their best internal-link targets.
 * The pipeline gives these to Gemini so it can place contextual links.
 */
export const CLUSTER_LINK_MAP: Record<string, Array<{ url: string; label: string }>> = {
  self_sabotage: [
    LINKABLE_PAGES.freeBirthChart,
    LINKABLE_PAGES.natalChart,
    LINKABLE_PAGES.paidReading,
  ],
  love_patterns: [
    LINKABLE_PAGES.freeBirthChart,
    LINKABLE_PAGES.whyYouAttract,
    LINKABLE_PAGES.loveLanguage,
    LINKABLE_PAGES.redFlagsQuiz,
  ],
  career_money: [
    LINKABLE_PAGES.freeBirthChart,
    LINKABLE_PAGES.careerStrength,
  ],
  emotional_patterns: [
    LINKABLE_PAGES.moonSignCalc,
    LINKABLE_PAGES.risingSignCalc,
    LINKABLE_PAGES.bigThreeCalc,
  ],
  compatibility: [
    LINKABLE_PAGES.freeBirthChart,
    LINKABLE_PAGES.whyYouAttract,
    LINKABLE_PAGES.loveLanguage,
  ],
  life_timing: [
    LINKABLE_PAGES.saturnReturnCalc,
    LINKABLE_PAGES.freeBirthChart,
    LINKABLE_PAGES.natalChart,
  ],
};

/**
 * Returns the current best CTA URL for a target product.
 * For upcoming products, falls back to the birth chart page.
 */
export function getCtaUrl(product: TargetProduct): string {
  const info = TARGET_PRODUCTS[product];
  if (info.status === "live" && info.url) return `${BASE_URL}${info.url}`;
  return LINKABLE_PAGES.freeBirthChart.url;
}

/**
 * Wraps a CTA paragraph in semantic markers for future backfill.
 * The markers let the CTA-update endpoint find and replace
 * only the CTA block without rewriting the full article.
 */
export function wrapCtaHtml(
  ctaHtml: string,
  targetProduct: TargetProduct
): string {
  return `<!-- bluntchart:cta:${targetProduct} -->\n${ctaHtml}\n<!-- /bluntchart:cta -->`;
}
