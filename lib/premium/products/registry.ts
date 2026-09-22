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
import type { BirthData, ChartData } from "@/lib/types";

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

import {
  SYSTEM_PROMPT as BHR_SYSTEM_PROMPT,
  TOOL_NAME as BHR_TOOL_NAME,
  TOOL_SCHEMA as BHR_TOOL_SCHEMA,
  buildUserPrompt as bhrBuildUserPrompt,
} from "./brutally-honest-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as TCT_SYSTEM_PROMPT,
  TOOL_NAME as TCT_TOOL_NAME,
  TOOL_SCHEMA as TCT_TOOL_SCHEMA,
  buildUserPrompt as tctBuildUserPrompt,
} from "./three-card-tarot/prompt-fragments";

import {
  SYSTEM_PROMPT as YNT_SYSTEM_PROMPT,
  TOOL_NAME as YNT_TOOL_NAME,
  TOOL_SCHEMA as YNT_TOOL_SCHEMA,
  buildUserPrompt as yntBuildUserPrompt,
} from "./yes-no-tarot/prompt-fragments";

import {
  SYSTEM_PROMPT as LR_SYSTEM_PROMPT,
  TOOL_NAME as LR_TOOL_NAME,
  TOOL_SCHEMA as LR_TOOL_SCHEMA,
  buildUserPrompt as lrBuildUserPrompt,
} from "./love-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as CR_SYSTEM_PROMPT,
  TOOL_NAME as CR_TOOL_NAME,
  TOOL_SCHEMA as CR_TOOL_SCHEMA,
  buildUserPrompt as crBuildUserPrompt,
} from "./career-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as SHR_SYSTEM_PROMPT,
  TOOL_NAME as SHR_TOOL_NAME,
  TOOL_SCHEMA as SHR_TOOL_SCHEMA,
  buildUserPrompt as shrBuildUserPrompt,
} from "./shadow-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as SR_SYSTEM_PROMPT,
  TOOL_NAME as SR_TOOL_NAME,
  TOOL_SCHEMA as SR_TOOL_SCHEMA,
  buildUserPrompt as srBuildUserPrompt,
} from "./saturn-return/prompt-fragments";

import {
  SYSTEM_PROMPT as MR_SYSTEM_PROMPT,
  TOOL_NAME as MR_TOOL_NAME,
  TOOL_SCHEMA as MR_TOOL_SCHEMA,
  buildUserPrompt as mrBuildUserPrompt,
} from "./moon-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as MNR_SYSTEM_PROMPT,
  TOOL_NAME as MNR_TOOL_NAME,
  TOOL_SCHEMA as MNR_TOOL_SCHEMA,
  buildUserPrompt as mnrBuildUserPrompt,
} from "./money-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as DT_SYSTEM_PROMPT,
  TOOL_NAME as DT_TOOL_NAME,
  TOOL_SCHEMA as DT_TOOL_SCHEMA,
  buildUserPrompt as dtBuildUserPrompt,
} from "./daily-tarot/prompt-fragments";

import {
  SYSTEM_PROMPT as YAR_SYSTEM_PROMPT,
  TOOL_NAME as YAR_TOOL_NAME,
  TOOL_SCHEMA as YAR_TOOL_SCHEMA,
  buildUserPrompt as yarBuildUserPrompt,
} from "./year-ahead/prompt-fragments";

import {
  SYSTEM_PROMPT as GR_SYSTEM_PROMPT,
  TOOL_NAME as GR_TOOL_NAME,
  TOOL_SCHEMA as GR_TOOL_SCHEMA,
  buildUserPrompt as grBuildUserPrompt,
} from "./gift-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as COMPAT_SYSTEM_PROMPT,
  TOOL_NAME as COMPAT_TOOL_NAME,
  TOOL_SCHEMA as COMPAT_TOOL_SCHEMA,
  buildUserPrompt as compatBuildUserPrompt,
} from "./compatibility/prompt-fragments";

import {
  SYSTEM_PROMPT as MT_SYSTEM_PROMPT,
  TOOL_NAME as MT_TOOL_NAME,
  TOOL_SCHEMA as MT_TOOL_SCHEMA,
  buildUserPrompt as mtBuildUserPrompt,
} from "./monthly-transit/prompt-fragments";

import {
  SYSTEM_PROMPT as SOUL_SYSTEM_PROMPT,
  TOOL_NAME as SOUL_TOOL_NAME,
  TOOL_SCHEMA as SOUL_TOOL_SCHEMA,
  buildUserPrompt as soulBuildUserPrompt,
} from "./soulmate-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as HF_SYSTEM_PROMPT,
  TOOL_NAME as HF_TOOL_NAME,
  TOOL_SCHEMA as HF_TOOL_SCHEMA,
  buildUserPrompt as hfBuildUserPrompt,
} from "./hidden-feelings/prompt-fragments";

import {
  SYSTEM_PROMPT as EX_SYSTEM_PROMPT,
  TOOL_NAME as EX_TOOL_NAME,
  TOOL_SCHEMA as EX_TOOL_SCHEMA,
  buildUserPrompt as exBuildUserPrompt,
} from "./ex-love-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as BL_SYSTEM_PROMPT,
  TOOL_NAME as BL_TOOL_NAME,
  TOOL_SCHEMA as BL_TOOL_SCHEMA,
  buildUserPrompt as blBuildUserPrompt,
} from "./blunt-love/prompt-fragments";

import {
  SYSTEM_PROMPT as BCR_SYSTEM_PROMPT,
  TOOL_NAME as BCR_TOOL_NAME,
  TOOL_SCHEMA as BCR_TOOL_SCHEMA,
  buildUserPrompt as bcrBuildUserPrompt,
} from "./blunt-career/prompt-fragments";

import {
  SYSTEM_PROMPT as B3_SYSTEM_PROMPT,
  TOOL_NAME as B3_TOOL_NAME,
  TOOL_SCHEMA as B3_TOOL_SCHEMA,
  buildUserPrompt as b3BuildUserPrompt,
} from "./big-three-mini/prompt-fragments";

import {
  SYSTEM_PROMPT as LP_SYSTEM_PROMPT,
  TOOL_NAME as LP_TOOL_NAME,
  TOOL_SCHEMA as LP_TOOL_SCHEMA,
  buildUserPrompt as lpBuildUserPrompt,
} from "./life-purpose/prompt-fragments";

import {
  SYSTEM_PROMPT as PD_SYSTEM_PROMPT,
  TOOL_NAME as PD_TOOL_NAME,
  TOOL_SCHEMA as PD_TOOL_SCHEMA,
  buildUserPrompt as pdBuildUserPrompt,
} from "./personality-decoded/prompt-fragments";

import {
  SYSTEM_PROMPT as BLIND_SYSTEM_PROMPT,
  TOOL_NAME as BLIND_TOOL_NAME,
  TOOL_SCHEMA as BLIND_TOOL_SCHEMA,
  buildUserPrompt as blindBuildUserPrompt,
} from "./blind-reading/prompt-fragments";

import {
  SYSTEM_PROMPT as SIT_SYSTEM_PROMPT,
  TOOL_NAME as SIT_TOOL_NAME,
  TOOL_SCHEMA as SIT_TOOL_SCHEMA,
  buildUserPrompt as sitBuildUserPrompt,
} from "./situationship-reality-check/prompt-fragments";

import type { TarotProductConfig, TarotPromptBuilder } from "@/lib/pipeline/tarot";

export type PipelineTier = "quick" | "standard" | "premium";

export interface QuickProductConfig {
  readonly model: string;
  readonly maxTokens: number;
  readonly temperature: number;
  readonly toolName: string;
  readonly toolSchema: object;
  readonly systemPrompt: string;
  readonly buildUserPrompt: (birth: BirthData, chart: ChartData) => string;
  readonly expectedSections: number;
  readonly minWordsPerSection: number;
  readonly maxWordsPerSection: number;
  readonly sectionField?: string;
  readonly forbiddenWords?: readonly string[];
}

export interface CompatProductConfig {
  readonly model: string;
  readonly maxTokens: number;
  readonly temperature: number;
  readonly toolName: string;
  readonly toolSchema: object;
  readonly systemPrompt: string;
  readonly buildUserPrompt: (
    birth1: BirthData, chart1: ChartData,
    birth2: BirthData, chart2: ChartData,
    synastry: import("@/lib/astro-compat").SynastryResult
  ) => string;
  readonly expectedSections: number;
  readonly minWordsPerSection: number;
  readonly maxWordsPerSection: number;
  readonly sectionField?: string;
  readonly forbiddenWords?: readonly string[];
}

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
  readonly pipelineTier: PipelineTier;
  readonly quickConfig?: QuickProductConfig;
  readonly tarotConfig?: TarotProductConfig;
  readonly compatConfig?: CompatProductConfig;
}

const REGISTRY: Partial<Record<ReadingProduct, ProductDefinition | null>> & {
  "birth-chart": ProductDefinition;
  "in-depth-reading": ProductDefinition;
} = {
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
    pipelineTier: "premium",
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
    pipelineTier: "premium",
  },
  // ── Quick-tier products ─────────────────────────────────────
  "brutally-honest-reading": {
    product: "brutally-honest-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: BHR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: BHR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 12000,
      temperature: 0.9,
      toolName: BHR_TOOL_NAME,
      toolSchema: BHR_TOOL_SCHEMA,
      systemPrompt: BHR_SYSTEM_PROMPT,
      buildUserPrompt: bhrBuildUserPrompt,
      expectedSections: 10,
      minWordsPerSection: 200,
      maxWordsPerSection: 500,
      sectionField: "explain",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Tarot products ──────────────────────────────────────────
  "three-card-tarot": {
    product: "three-card-tarot",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: TCT_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: TCT_TOOL_NAME,
    pipelineTier: "quick",
    tarotConfig: {
      model: "claude-haiku-4-5",
      maxTokens: 4096,
      temperature: 0.85,
      toolName: TCT_TOOL_NAME,
      toolSchema: TCT_TOOL_SCHEMA,
      systemPrompt: TCT_SYSTEM_PROMPT,
      spreadId: "three-card",
      allowReversed: true,
      expectedSections: 3,
      minWordsPerSection: 100,
      maxWordsPerSection: 250,
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
      buildPrompt: {
        type: "spread",
        fn: tctBuildUserPrompt,
      },
    },
  },
  "yes-no-tarot": {
    product: "yes-no-tarot",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: YNT_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: YNT_TOOL_NAME,
    pipelineTier: "quick",
    tarotConfig: {
      model: "claude-haiku-4-5",
      maxTokens: 2048,
      temperature: 0.8,
      toolName: YNT_TOOL_NAME,
      toolSchema: YNT_TOOL_SCHEMA,
      systemPrompt: YNT_SYSTEM_PROMPT,
      spreadId: "yes-no",
      majorOnly: true,
      allowReversed: true,
      expectedSections: 1,
      minWordsPerSection: 80,
      maxWordsPerSection: 200,
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
      buildPrompt: {
        type: "yesno",
        fn: yntBuildUserPrompt,
      },
    },
  },
  // ── Birth-chart Quick products ─────────────────────────────
  "love-reading": {
    product: "love-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: LR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: LR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: LR_TOOL_NAME,
      toolSchema: LR_TOOL_SCHEMA,
      systemPrompt: LR_SYSTEM_PROMPT,
      buildUserPrompt: lrBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening", "twin flame", "soulmate",
      ],
    },
  },
  // ── Birth-chart Quick products (continued) ──────────────────
  "career-reading": {
    product: "career-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: CR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: CR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: CR_TOOL_NAME,
      toolSchema: CR_TOOL_SCHEMA,
      systemPrompt: CR_SYSTEM_PROMPT,
      buildUserPrompt: crBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "shadow-reading": {
    product: "shadow-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: SHR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: SHR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: SHR_TOOL_NAME,
      toolSchema: SHR_TOOL_SCHEMA,
      systemPrompt: SHR_SYSTEM_PROMPT,
      buildUserPrompt: shrBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "saturn-return": {
    product: "saturn-return",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: SR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: SR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: SR_TOOL_NAME,
      toolSchema: SR_TOOL_SCHEMA,
      systemPrompt: SR_SYSTEM_PROMPT,
      buildUserPrompt: srBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "moon-reading": {
    product: "moon-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: MR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: MR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: MR_TOOL_NAME,
      toolSchema: MR_TOOL_SCHEMA,
      systemPrompt: MR_SYSTEM_PROMPT,
      buildUserPrompt: mrBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "money-reading": {
    product: "money-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: MNR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: MNR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: MNR_TOOL_NAME,
      toolSchema: MNR_TOOL_SCHEMA,
      systemPrompt: MNR_SYSTEM_PROMPT,
      buildUserPrompt: mnrBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "year-ahead": {
    product: "year-ahead",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: YAR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: YAR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 8192,
      temperature: 0.9,
      toolName: YAR_TOOL_NAME,
      toolSchema: YAR_TOOL_SCHEMA,
      systemPrompt: YAR_SYSTEM_PROMPT,
      buildUserPrompt: yarBuildUserPrompt,
      expectedSections: 8,
      minWordsPerSection: 200,
      maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "gift-reading": {
    product: "gift-reading",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: GR_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: GR_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: GR_TOOL_NAME,
      toolSchema: GR_TOOL_SCHEMA,
      systemPrompt: GR_SYSTEM_PROMPT,
      buildUserPrompt: grBuildUserPrompt,
      expectedSections: 4,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Tarot products (continued) ─────────────────────────────
  "daily-tarot": {
    product: "daily-tarot",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: DT_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: DT_TOOL_NAME,
    pipelineTier: "quick",
    tarotConfig: {
      model: "claude-haiku-4-5",
      maxTokens: 2048,
      temperature: 0.85,
      toolName: DT_TOOL_NAME,
      toolSchema: DT_TOOL_SCHEMA,
      systemPrompt: DT_SYSTEM_PROMPT,
      spreadId: "single",
      allowReversed: true,
      expectedSections: 1,
      minWordsPerSection: 60,
      maxWordsPerSection: 200,
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
      buildPrompt: {
        type: "spread",
        fn: dtBuildUserPrompt,
      },
    },
  },
  // ── Transit-based Quick product ──────────────────────────────
  "monthly-transit": {
    product: "monthly-transit",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: MT_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: MT_TOOL_NAME,
    pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 6144,
      temperature: 0.9,
      toolName: MT_TOOL_NAME,
      toolSchema: MT_TOOL_SCHEMA,
      systemPrompt: MT_SYSTEM_PROMPT,
      buildUserPrompt: mtBuildUserPrompt,
      expectedSections: 6,
      minWordsPerSection: 150,
      maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Love readings ───────────────────────────────────────────
  "soulmate-reading": {
    product: "soulmate-reading",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: SOUL_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: SOUL_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: SOUL_TOOL_NAME, toolSchema: SOUL_TOOL_SCHEMA,
      systemPrompt: SOUL_SYSTEM_PROMPT, buildUserPrompt: soulBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 150, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening", "twin flame",
      ],
    },
  },
  "hidden-feelings": {
    product: "hidden-feelings",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: HF_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: HF_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: HF_TOOL_NAME, toolSchema: HF_TOOL_SCHEMA,
      systemPrompt: HF_SYSTEM_PROMPT, buildUserPrompt: hfBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 150, maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "ex-love-reading": {
    product: "ex-love-reading",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: EX_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: EX_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: EX_TOOL_NAME, toolSchema: EX_TOOL_SCHEMA,
      systemPrompt: EX_SYSTEM_PROMPT, buildUserPrompt: exBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 150, maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening", "twin flame",
      ],
    },
  },
  // ── Blunt brand readings ──────────────────────────────────────
  "blunt-love": {
    product: "blunt-love",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: BL_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: BL_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: BL_TOOL_NAME, toolSchema: BL_TOOL_SCHEMA,
      systemPrompt: BL_SYSTEM_PROMPT, buildUserPrompt: blBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 150, maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening", "twin flame", "soulmate",
      ],
    },
  },
  "blunt-career": {
    product: "blunt-career",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: BCR_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: BCR_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: BCR_TOOL_NAME, toolSchema: BCR_TOOL_SCHEMA,
      systemPrompt: BCR_SYSTEM_PROMPT, buildUserPrompt: bcrBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 150, maxWordsPerSection: 350,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Gateway / Mini readings ───────────────────────────────────
  "big-three-mini": {
    product: "big-three-mini",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: B3_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: B3_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-haiku-4-5", maxTokens: 4096, temperature: 0.9,
      toolName: B3_TOOL_NAME, toolSchema: B3_TOOL_SCHEMA,
      systemPrompt: B3_SYSTEM_PROMPT, buildUserPrompt: b3BuildUserPrompt,
      expectedSections: 3, minWordsPerSection: 200, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Self-discovery readings ───────────────────────────────────
  "life-purpose": {
    product: "life-purpose",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: LP_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: LP_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: LP_TOOL_NAME, toolSchema: LP_TOOL_SCHEMA,
      systemPrompt: LP_SYSTEM_PROMPT, buildUserPrompt: lpBuildUserPrompt,
      expectedSections: 6, minWordsPerSection: 200, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  "personality-decoded": {
    product: "personality-decoded",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: PD_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: PD_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 8192, temperature: 0.9,
      toolName: PD_TOOL_NAME, toolSchema: PD_TOOL_SCHEMA,
      systemPrompt: PD_SYSTEM_PROMPT, buildUserPrompt: pdBuildUserPrompt,
      expectedSections: 8, minWordsPerSection: 200, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Blind / no-question reading ───────────────────────────────
  "blind-reading": {
    product: "blind-reading",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: BLIND_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: BLIND_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: BLIND_TOOL_NAME, toolSchema: BLIND_TOOL_SCHEMA,
      systemPrompt: BLIND_SYSTEM_PROMPT, buildUserPrompt: blindBuildUserPrompt,
      expectedSections: 3, minWordsPerSection: 200, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Situationship Reality Check ──────────────────────────────
  "situationship-reality-check": {
    product: "situationship-reality-check",
    blueprint: [], activeSections: [], totalChapters: 0,
    guidelines: {}, mockBodies: {}, chapterProfiles: [],
    systemPrompt: SIT_SYSTEM_PROMPT, contractReminder: "",
    readingToolName: SIT_TOOL_NAME, pipelineTier: "quick",
    quickConfig: {
      model: "claude-sonnet-4-6", maxTokens: 6144, temperature: 0.9,
      toolName: SIT_TOOL_NAME, toolSchema: SIT_TOOL_SCHEMA,
      systemPrompt: SIT_SYSTEM_PROMPT, buildUserPrompt: sitBuildUserPrompt,
      expectedSections: 5, minWordsPerSection: 150, maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening",
      ],
    },
  },
  // ── Compatibility (two-person) ───────────────────────────────
  compatibility: {
    product: "compatibility",
    blueprint: [],
    activeSections: [],
    totalChapters: 0,
    guidelines: {},
    mockBodies: {},
    chapterProfiles: [],
    systemPrompt: COMPAT_SYSTEM_PROMPT,
    contractReminder: "",
    readingToolName: COMPAT_TOOL_NAME,
    pipelineTier: "quick",
    compatConfig: {
      model: "claude-sonnet-4-6",
      maxTokens: 8192,
      temperature: 0.9,
      toolName: COMPAT_TOOL_NAME,
      toolSchema: COMPAT_TOOL_SCHEMA,
      systemPrompt: COMPAT_SYSTEM_PROMPT,
      buildUserPrompt: compatBuildUserPrompt,
      expectedSections: 7,
      minWordsPerSection: 200,
      maxWordsPerSection: 400,
      sectionField: "body",
      forbiddenWords: [
        "journey", "manifest", "universe", "soul", "empath", "abundance",
        "alignment", "authentic", "portal", "energy", "vibration", "divine",
        "sacred", "awakening", "twin flame", "soulmate",
      ],
    },
  },
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

export function getProductOrNull(product: ReadingProduct): ProductDefinition | null {
  return REGISTRY[product] ?? null;
}

export function isQuickProduct(product: ReadingProduct): boolean {
  const def = REGISTRY[product];
  return def?.pipelineTier === "quick";
}

export function isTarotProduct(product: ReadingProduct): boolean {
  const def = REGISTRY[product];
  return def?.tarotConfig != null;
}

