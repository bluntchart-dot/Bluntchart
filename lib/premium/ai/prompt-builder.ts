/**
 * lib/premium/ai/prompt-builder.ts
 *
 * Assembles the main-generation prompts.
 *
 * v1.2 (Insight Map): per-chapter blocks now carry ASSIGNED INSIGHTS and
 * a DOMAIN PALETTE from the scheduler. Chart placements are no longer
 * echoed per-chapter (Part I). Transit chapters keep the old per-chapter
 * chart-context field for backwards compatibility.
 *
 * The system prompt is byte-identical per readingVersion (cache-friendly).
 * The user prompt has: reader anchor at top, chapter list in reader order,
 * closing CONTRACT_REMINDER at the bottom.
 */

import type {
  AiGenerationRequest,
  AiSectionRequest,
} from "./types";
import {
  CONTRACT_REMINDER as BC_CONTRACT_REMINDER,
  SYSTEM_PROMPT as BC_SYSTEM_PROMPT,
} from "@/lib/premium/products/birth-chart/prompt-fragments";
import type {
  InsightAssignment,
} from "@/lib/premium/insights/types";
import type { SectionId } from "@/lib/premium/types";

/* ─────────────────────────────────────────────────────────────────────
   Extended per-chapter payload passed by the orchestrator. Optional
   fields let transit chapters continue to use the legacy path.
───────────────────────────────────────────────────────────────────── */

export interface ChapterPromptContext {
  /** Insight assignments from the scheduler. Empty for transit chapters. */
  readonly assignments?: readonly InsightAssignment[];
  /** Domain palette from chapter-profiles. Empty for transit chapters. */
  readonly domainPalette?: readonly string[];
  /** IDs of insights owned by other chapters, provided as read-only ledger. */
  readonly previouslyOwned?: readonly { id: string; ownedBy: SectionId; pattern: string }[];
  /** Banned images to avoid this chapter. */
  readonly bannedImages?: readonly string[];
  /**
   * Bespoke scaffolding hint. "hook" for before-we-begin, "climax" for
   * life-story. Standard chapters omit this.
   */
  readonly kind?: "standard" | "hook" | "climax";
  /**
   * Optional targeted regeneration guidance. When present, this block
   * has failed QA and is being regenerated with this specific note.
   */
  readonly regenerationGuidance?: string;
}

export interface AiGenerationRequestV2 extends AiGenerationRequest {
  /** Per-section extended context, keyed by section id. */
  readonly chapterContexts?: Partial<Record<SectionId, ChapterPromptContext>>;
}

/* ─────────────────────────────────────────────────────────────────────
   Formatting helpers
───────────────────────────────────────────────────────────────────── */

function formatAssignments(
  assignments: readonly InsightAssignment[]
): string {
  const owns = assignments.filter((a) => a.kind === "owns");
  const previews = assignments.filter((a) => a.kind === "preview");
  const consequences = assignments.filter(
    (a) => a.kind === "may-reference-consequence"
  );
  const transformed = assignments.filter((a) => a.kind === "transformed-arc");

  const parts: string[] = [];

  if (previews.length > 0) {
    parts.push(
      "Insights this chapter may PREVIEW (tease/hint at, but do NOT explain — a later chapter owns each of these and will explain it in full):"
    );
    for (const a of previews) {
      parts.push(
        `- [${a.insight.category}, ${a.insight.emotionalTone}] ${a.insight.pattern}`
      );
    }
    parts.push(
      "For each preview, land a hint that makes the reader want to keep going. Never resolve or fully name the pattern here — that is the owning chapter's job."
    );
  }
  if (owns.length > 0) {
    if (parts.length > 0) parts.push("");
    parts.push("Insights this chapter OWNS (explain these — no other chapter will):");
    for (const a of owns) {
      parts.push(
        `- [${a.insight.category}, ${a.insight.emotionalTone}] ${a.insight.pattern}`
      );
    }
  }
  if (consequences.length > 0) {
    parts.push("");
    parts.push(
      "You MAY briefly reference these insights only as NEW consequences (never re-explain them — they were already explained in an earlier chapter):"
    );
    for (const a of consequences) {
      parts.push(`- ${a.insight.pattern}`);
    }
  }
  if (transformed.length > 0) {
    parts.push("");
    parts.push(
      "You MAY transform these previously-explained insights into protagonist beats — never recap, only reframe:"
    );
    for (const a of transformed) {
      parts.push(`- ${a.insight.pattern}`);
    }
  }
  return parts.join("\n");
}

function formatDomainPalette(palette: readonly string[]): string {
  if (palette.length === 0) return "";
  return [
    `Domain palette for this chapter: ${palette.join(", ")}.`,
    `Reach only into these territories. Examples are optional — a plain observation is fine.`,
  ].join("\n");
}

function formatLedgerNote(
  previouslyOwned: readonly { id: string; ownedBy: SectionId; pattern: string }[],
  bannedImages: readonly string[]
): string {
  const parts: string[] = [];
  if (previouslyOwned.length > 0) {
    parts.push("Insights already OWNED by earlier chapters (do not re-explain):");
    for (const p of previouslyOwned) {
      parts.push(`- (owned by ${p.ownedBy}) ${p.pattern}`);
    }
  }
  if (bannedImages.length > 0) {
    parts.push("");
    parts.push(
      `Images/scenes already used or banned — do NOT reuse: ${bannedImages.join(", ")}.`
    );
  }
  return parts.join("\n");
}

/* ─────────────────────────────────────────────────────────────────────
   Bespoke scaffolding for hook + climax chapters
───────────────────────────────────────────────────────────────────── */

const HOOK_SCAFFOLDING = `Chapter-kind: HOOK.
Job: make the reader think "wait — that's me. Keep going." Do NOT explain her. Do NOT summarise. Do NOT solve anything. Create recognition plus curiosity plus a tiny emotional reveal.

Structure (invisible to the reader):
- Open on one of your assigned insights, warmly, as a friend saying: "Before we get into this, there's something I need to tell you."
- Layer in a second recognition beat.
- End on a small reveal that opens a question — cliffhanger into "Real You".

Ban list for this chapter's opener: coffee, mug, tab, unsent text, LinkedIn, Notes app, "Tuesday morning". Reach for territory beyond phone/routine.`;

const CLIMAX_SCAFFOLDING = `Chapter-kind: CLIMAX (Life Story).
Job: she should finish thinking "I know this woman better now — and I really want to see what she does next."

Structure (invisible to the reader — never label):
- SETUP: a specific tension or desire that has always been true about her, drawn from your strongest assigned insight.
- COMPLICATION: how this shows up as her life keeps meeting her — a plausible pattern, in feeling-shape, never a fabricated event.
- REALISATION: the shift life is asking of her now, drawn from a growth-oriented insight.
- DIRECTION: what she is becoming, framed as the NEXT scene — never closure.

Absolute rules:
- Second person, present tense, cinematic close. Never "a kid who". Never "she".
- NO childhood claim. NO fabricated events. Emotional territory, not biography.
- NO recap of prior chapters. Any earlier insight referenced here is REFRAMED as a protagonist beat, never restated.
- Emotional range across the chapter: playful → tender → hungry → quiet → wondering.
- End on curiosity and ownership. Cut to black before the next scene. Never close her story.`;

/* ─────────────────────────────────────────────────────────────────────
   Per-section block assembly
───────────────────────────────────────────────────────────────────── */

function formatSection(
  s: AiSectionRequest,
  i: number,
  ctx: ChapterPromptContext | undefined
): string {
  const words = `${s.approxWords[0]}–${s.approxWords[1]} words`;
  const parts: string[] = [];
  parts.push(`## Chapter ${i + 1} — id: ${s.id}`);
  parts.push(`Title: ${s.title}`);
  if (s.subtitle) parts.push(`Subtitle: ${s.subtitle}`);
  parts.push(`Narrative form (opening move only): ${s.narrativeForm}`);
  parts.push(`Target length: ${words}`);
  parts.push("");
  parts.push(`Emotional objective: ${s.emotionalObjective}`);
  parts.push(`Tone: ${s.tone}`);
  parts.push(`Desired reader feeling: ${s.desiredReaderFeeling}`);
  parts.push(`Writing style: ${s.writingStyle}`);
  parts.push(`Transition goal (into the next chapter): ${s.transitionGoal}`);
  parts.push("");

  if (ctx?.kind === "hook") {
    parts.push(HOOK_SCAFFOLDING);
    parts.push("");
  } else if (ctx?.kind === "climax") {
    parts.push(CLIMAX_SCAFFOLDING);
    parts.push("");
  }

  if (ctx?.assignments && ctx.assignments.length > 0) {
    parts.push(formatAssignments(ctx.assignments));
    parts.push("");
  }

  if (ctx?.domainPalette && ctx.domainPalette.length > 0) {
    parts.push(formatDomainPalette(ctx.domainPalette));
    parts.push("");
  }

  const ledgerNote = formatLedgerNote(
    ctx?.previouslyOwned ?? [],
    ctx?.bannedImages ?? []
  );
  if (ledgerNote) {
    parts.push(ledgerNote);
    parts.push("");
  }

  // Legacy: for transit chapters, keep the old chart-context field so
  // their prompt block reads like it did before.
  if (!ctx || (!ctx.assignments && !ctx.kind)) {
    parts.push("Emotional territory this chapter draws on:");
    parts.push(s.chartContext);
  }

  if (ctx?.regenerationGuidance) {
    parts.push("");
    parts.push("### Regeneration guidance");
    parts.push(ctx.regenerationGuidance);
  }

  return parts.join("\n");
}

/* ─────────────────────────────────────────────────────────────────────
   Public API
───────────────────────────────────────────────────────────────────── */

export function buildSystemPrompt(req?: AiGenerationRequest): string {
  return req?.productSystemPrompt ?? BC_SYSTEM_PROMPT;
}

export function buildUserPrompt(req: AiGenerationRequest): string {
  return buildUserPromptV2(req as AiGenerationRequestV2);
}

export function buildUserPromptV2(req: AiGenerationRequestV2): string {
  const header = [
    `# Reader`,
    req.readerOpener,
    "",
    `# Your task`,
    `Write every chapter below. One body per chapter. Match the opening move each chapter declares. For chapters with assigned insights, land those insights. For chapters without (transit chapters), draw on the emotional territory noted. This is one book, read start to finish.`,
    "",
    `# Chapters to fill (${req.sections.length} total)`,
  ].join("\n");

  const body = req.sections
    .map((s, i) => formatSection(s, i, req.chapterContexts?.[s.id]))
    .join("\n\n---\n\n");

  const contractReminder = req.productContractReminder ?? BC_CONTRACT_REMINDER;
  return `${header}\n\n${body}\n\n---\n\n${contractReminder}`;
}
