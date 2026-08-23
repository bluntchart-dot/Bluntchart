/**
 * Reading product registry.
 *
 * One entry per reading product. Every product exposes the same shape:
 *   - blueprint       (static structure)
 *   - guidelines      (per-chapter AI direction)
 *   - mockBodies      (in-voice placeholder narratives)
 *   - chapterProfiles (insight scheduler config for Part I chapters)
 *   - systemPrompt    (the master system prompt for the AI writer)
 *   - contractReminder(the closing reminder appended after chapter slots)
 *   - readingToolName (Anthropic tool-use function name)
 *
 * Add new products by dropping a folder next to birth-chart and adding
 * an entry to REGISTRY below. The rest of the engine (types, generator,
 * renderer) does not change.
 */

import type {
  BlueprintSection,
  ReadingProduct,
  SectionGuideline,
  SectionId,
} from "@/lib/premium/types";
import type { ChapterProfile } from "@/lib/premium/insights/types";

import {
  ACTIVE_BLUEPRINT_SECTIONS as BC_ACTIVE,
  BIRTH_CHART_BLUEPRINT,
  TOTAL_ACTIVE_CHAPTERS as BC_TOTAL,
} from "./birth-chart/blueprint";
import { BIRTH_CHART_GUIDELINES } from "./birth-chart/guidelines";
import { BIRTH_CHART_MOCK_BODIES } from "./birth-chart/mock-content";
import { BIRTH_CHART_CHAPTER_PROFILES } from "./birth-chart/chapter-profiles";
import {
  SYSTEM_PROMPT as BC_SYSTEM_PROMPT,
  CONTRACT_REMINDER as BC_CONTRACT_REMINDER,
  READING_TOOL_NAME as BC_READING_TOOL_NAME,
} from "./birth-chart/prompt-fragments";

import {
  ACTIVE_BLUEPRINT_SECTIONS as IDR_ACTIVE,
  IN_DEPTH_READING_BLUEPRINT,
  TOTAL_ACTIVE_CHAPTERS as IDR_TOTAL,
} from "./in-depth-reading/blueprint";
import { IN_DEPTH_READING_GUIDELINES } from "./in-depth-reading/guidelines";
import { IN_DEPTH_READING_MOCK_BODIES } from "./in-depth-reading/mock-content";
import { IN_DEPTH_READING_CHAPTER_PROFILES } from "./in-depth-reading/chapter-profiles";
import {
  SYSTEM_PROMPT as IDR_SYSTEM_PROMPT,
  CONTRACT_REMINDER as IDR_CONTRACT_REMINDER,
  READING_TOOL_NAME as IDR_READING_TOOL_NAME,
} from "./in-depth-reading/prompt-fragments";

export interface ProductDefinition {
  readonly product: ReadingProduct;
  readonly blueprint: readonly BlueprintSection[];
  readonly activeSections: readonly BlueprintSection[];
  readonly totalChapters: number;
  readonly guidelines: Partial<Record<SectionId, SectionGuideline>>;
  readonly mockBodies: Partial<Record<SectionId, string>>;
  readonly chapterProfiles: readonly ChapterProfile[];
  readonly systemPrompt: string;
  readonly contractReminder: string;
  readonly readingToolName: string;
}

const REGISTRY: Record<ReadingProduct, ProductDefinition | null> = {
  "birth-chart": {
    product: "birth-chart",
    blueprint: BIRTH_CHART_BLUEPRINT,
    activeSections: BC_ACTIVE,
    totalChapters: BC_TOTAL,
    guidelines: BIRTH_CHART_GUIDELINES,
    mockBodies: BIRTH_CHART_MOCK_BODIES,
    chapterProfiles: BIRTH_CHART_CHAPTER_PROFILES,
    systemPrompt: BC_SYSTEM_PROMPT,
    contractReminder: BC_CONTRACT_REMINDER,
    readingToolName: BC_READING_TOOL_NAME,
  },
  "in-depth-reading": {
    product: "in-depth-reading",
    blueprint: IN_DEPTH_READING_BLUEPRINT,
    activeSections: IDR_ACTIVE,
    totalChapters: IDR_TOTAL,
    guidelines: IN_DEPTH_READING_GUIDELINES,
    mockBodies: IN_DEPTH_READING_MOCK_BODIES,
    chapterProfiles: IN_DEPTH_READING_CHAPTER_PROFILES,
    systemPrompt: IDR_SYSTEM_PROMPT,
    contractReminder: IDR_CONTRACT_REMINDER,
    readingToolName: IDR_READING_TOOL_NAME,
  },
  // Reserved slots — implementations added when built.
  compatibility: null,
  "year-ahead": null,
  "gift-reading": null,
};

/**
 * Look up a product by id. Throws if the product is registered but not
 * yet implemented so no caller silently degrades.
 */
export function getProduct(product: ReadingProduct): ProductDefinition {
  const entry = REGISTRY[product];
  if (!entry) {
    throw new Error(
      `[premium/registry] Product "${product}" is reserved but not implemented yet.`
    );
  }
  return entry;
}
