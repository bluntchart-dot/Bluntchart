import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import {
  MODELS,
  CONTENT_CLUSTERS,
  TARGET_PRODUCTS,
  MAX_POSTS_PER_DAY,
  type ContentCluster,
  type TargetProduct,
} from "./config";
import { generateJson, Type } from "./gemini-client";
import {
  normalizeTopic,
  computeDedupHash,
  getExistingHashes,
  getRecentTopics,
} from "./dedup";
import { getCtaUrl } from "./internal-links";

interface TopicCandidate {
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: string;
  content_cluster: string;
  target_product: string;
  conversion_angle: string;
  opportunity_score: number;
}

export interface DiscoveredTopic {
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: string;
  content_cluster: string;
  target_product: string;
  product_status: string;
  conversion_angle: string;
  cta_destination: string;
  opportunity_score: number;
  dedup_hash: string;
}

export interface DiscoveryResult {
  ok: boolean;
  dryRun: boolean;
  inserted: number;
  skippedDuplicates: number;
  topics: DiscoveredTopic[];
  errorCode?: string;
  errorMessage?: string;
}

const DISCOVERY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          primary_keyword: {
            type: Type.STRING,
            description: "Long-tail search keyword phrase (4-8 words)",
          },
          secondary_keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3-5 related search terms",
          },
          search_intent: {
            type: Type.STRING,
            description: "informational, commercial, or navigational",
          },
          content_cluster: {
            type: Type.STRING,
            description:
              "One of: self_sabotage, love_patterns, career_money, emotional_patterns, compatibility, life_timing",
          },
          target_product: {
            type: Type.STRING,
            description: "One of: birth_chart, compatibility, transit",
          },
          conversion_angle: {
            type: Type.STRING,
            description:
              "How the article naturally leads to the target product",
          },
          opportunity_score: {
            type: Type.INTEGER,
            description:
              "1-100: higher = more search potential + less competition + stronger conversion",
          },
        },
        required: [
          "primary_keyword",
          "secondary_keywords",
          "search_intent",
          "content_cluster",
          "target_product",
          "conversion_angle",
          "opportunity_score",
        ],
      },
    },
  },
  required: ["topics"],
};

function buildDiscoveryPrompt(
  count: number,
  recentTopics: string[]
): string {
  const clusterList = CONTENT_CLUSTERS.map((c) => `- ${c}`).join("\n");

  const productList = Object.entries(TARGET_PRODUCTS)
    .map(
      ([key, info]) =>
        `- ${key} (${info.status}${info.url ? `, links to ${info.url}` : ", no page yet"})`
    )
    .join("\n");

  const avoidSection =
    recentTopics.length > 0
      ? `\n\nDo NOT generate topics similar to these recently covered ones:\n${recentTopics.map((t) => `- ${t}`).join("\n")}`
      : "";

  return `You are an SEO keyword strategist for BluntChart (bluntchart.com), an astrology SaaS product.

BluntChart offers:
- Free birth chart calculator and interactive natal chart viewer
- AI-powered personalized birth chart readings (paid product)
- Free tools: Big Three calculator, Moon sign calculator, Rising sign calculator, Saturn Return calculator
- Personality quizzes: Relationship red flags, Career strength, Love language, Toxicity, Why you attract the wrong person

Content clusters (use these exact values):
${clusterList}

Target products (use these exact values):
${productList}

Generate exactly ${count} unique astrology blog topic ideas optimized for Google search.

Requirements:
- Each primary_keyword must be a specific, natural long-tail search phrase (4-8 words) that real people type into Google
- Mix search intents across the batch: informational ("what does X mean in astrology"), commercial ("best X calculator"), problem-aware ("why do I keep X")
- Spread topics across at least 3 different content_clusters
- Prefer target_product "birth_chart" (it is live and converts). Use "compatibility" or "transit" only when the topic strongly fits
- conversion_angle: one sentence explaining how the article naturally leads readers to try a BluntChart tool
- opportunity_score: 1-100 where higher means more estimated search volume + less competition + stronger conversion fit
- Focus on emotionally resonant, specific topics — not generic "what is astrology" posts
- Include at least 1 topic targeting a specific zodiac sign placement (e.g. "moon in scorpio emotional patterns")
- secondary_keywords: 3-5 related search terms people also Google${avoidSection}`;
}

const VALID_CLUSTERS = new Set<string>(CONTENT_CLUSTERS);
const VALID_PRODUCTS = new Set<string>(Object.keys(TARGET_PRODUCTS));

export async function discoverTopics(
  supabase: SupabaseClient,
  runId: string,
  options: { count?: number; dryRun?: boolean } = {}
): Promise<DiscoveryResult> {
  const targetCount = options.count ?? MAX_POSTS_PER_DAY;
  const dryRun = options.dryRun ?? false;
  const generateCount = Math.min(targetCount + 4, 12);

  const recentTopics = await getRecentTopics(supabase, 50);
  const prompt = buildDiscoveryPrompt(generateCount, recentTopics);

  const result = await generateJson<{ topics: TopicCandidate[] }>({
    model: MODELS.scoring,
    prompt,
    schema: DISCOVERY_SCHEMA,
    temperature: 0.8,
    maxOutputTokens: 4000,
  });

  if (!result.ok) {
    return {
      ok: false,
      dryRun,
      inserted: 0,
      skippedDuplicates: 0,
      topics: [],
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
    };
  }

  const candidates = result.data?.topics ?? [];
  if (candidates.length === 0) {
    return { ok: true, dryRun, inserted: 0, skippedDuplicates: 0, topics: [] };
  }

  const enriched = candidates.map((c) => {
    const normalized = normalizeTopic(c.primary_keyword);
    const hash = computeDedupHash(normalized);
    const cluster = VALID_CLUSTERS.has(c.content_cluster)
      ? (c.content_cluster as ContentCluster)
      : ("self_sabotage" as ContentCluster);
    const product = VALID_PRODUCTS.has(c.target_product)
      ? (c.target_product as TargetProduct)
      : ("birth_chart" as TargetProduct);

    return {
      ...c,
      normalized_topic: normalized,
      dedup_hash: hash,
      content_cluster: cluster,
      target_product: product,
      product_status: TARGET_PRODUCTS[product].status,
      cta_destination: getCtaUrl(product),
      opportunity_score: Math.max(1, Math.min(100, c.opportunity_score || 50)),
    };
  });

  const allHashes = enriched.map((e) => e.dedup_hash);
  const existingHashes = await getExistingHashes(supabase, allHashes);

  const seenHashes = new Set<string>();
  const unique = enriched.filter((e) => {
    if (existingHashes.has(e.dedup_hash) || seenHashes.has(e.dedup_hash))
      return false;
    seenHashes.add(e.dedup_hash);
    return true;
  });

  const skippedDuplicates = enriched.length - unique.length;

  unique.sort((a, b) => b.opportunity_score - a.opportunity_score);
  const selected = unique.slice(0, targetCount);

  const topicsPayload: DiscoveredTopic[] = selected.map((s) => ({
    primary_keyword: s.primary_keyword,
    secondary_keywords: s.secondary_keywords,
    search_intent: s.search_intent,
    content_cluster: s.content_cluster,
    target_product: s.target_product,
    product_status: s.product_status,
    conversion_angle: s.conversion_angle,
    cta_destination: s.cta_destination,
    opportunity_score: s.opportunity_score,
    dedup_hash: s.dedup_hash,
  }));

  if (selected.length === 0) {
    return { ok: true, dryRun, inserted: 0, skippedDuplicates, topics: [] };
  }

  // Dry run: return scored candidates for manual review, never touch blog_posts.
  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      inserted: 0,
      skippedDuplicates,
      topics: topicsPayload,
    };
  }

  const rows = selected.map((s) => ({
    run_id: runId,
    source: "gemini",
    primary_keyword: s.primary_keyword,
    normalized_topic: s.normalized_topic,
    secondary_keywords: s.secondary_keywords,
    search_intent: s.search_intent,
    content_cluster: s.content_cluster,
    target_product: s.target_product,
    product_status: s.product_status,
    conversion_angle: s.conversion_angle,
    cta_destination: s.cta_destination,
    opportunity_score: s.opportunity_score,
    dedup_hash: s.dedup_hash,
    pipeline_stage: "TOPIC_SELECTED",
    publishing_status: "pending",
  }));

  const { error } = await supabase.from(DB.blogPosts).insert(rows);

  if (error) {
    return {
      ok: false,
      dryRun: false,
      inserted: 0,
      skippedDuplicates,
      topics: [],
      errorCode: "DB_INSERT_FAILED",
      errorMessage: error.message,
    };
  }

  return {
    ok: true,
    dryRun: false,
    inserted: selected.length,
    skippedDuplicates,
    topics: topicsPayload,
  };
}
