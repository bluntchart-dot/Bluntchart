/**
 * lib/premium/ai/prompt-builder.ts
 *
 * Assembles the two constant blocks that go into a generation request:
 *
 *   1. The system prompt (voice + rhythm + depth contracts) — comes from
 *      products/birth-chart/prompt-fragments.ts and is byte-identical for
 *      every reader, so it caches cleanly.
 *
 *   2. The user prompt — a slot-by-slot list of every chapter the model
 *      must fill, with its title, subtitle, narrativeForm, target length,
 *      transition goal, and prose chart context. Ends with a closing
 *      CONTRACT reminder.
 *
 * The per-user chart context is at the end of the user prompt so most of
 * the payload stays stable across readings and hits prompt cache.
 */

import type { AiGenerationRequest, AiSectionRequest } from "./types";
import {
  CONTRACT_REMINDER,
  SYSTEM_PROMPT,
} from "@/lib/premium/products/birth-chart/prompt-fragments";

function formatSection(s: AiSectionRequest, i: number): string {
  const words = `${s.approxWords[0]}–${s.approxWords[1]} words`;
  const parts: string[] = [];
  parts.push(`## Chapter ${i + 1} — id: ${s.id}`);
  parts.push(`Title: ${s.title}`);
  if (s.subtitle) parts.push(`Subtitle: ${s.subtitle}`);
  parts.push(`Narrative form: ${s.narrativeForm}`);
  parts.push(`Target length: ${words}`);
  parts.push("");
  parts.push(`Emotional objective: ${s.emotionalObjective}`);
  parts.push(`Tone: ${s.tone}`);
  parts.push(`Desired reader feeling: ${s.desiredReaderFeeling}`);
  parts.push(`Writing style: ${s.writingStyle}`);
  parts.push(`Transition goal (into the next chapter): ${s.transitionGoal}`);
  parts.push("");
  parts.push("Chart placements this chapter draws on:");
  parts.push(s.chartContext);
  return parts.join("\n");
}

export function buildSystemPrompt(): string {
  return SYSTEM_PROMPT;
}

export function buildUserPrompt(req: AiGenerationRequest): string {
  const header = [
    `# Reader`,
    req.readerOpener,
    "",
    `# Your task`,
    `Write every chapter below. One body per chapter. Match the narrative form each chapter declares. Obey the depth, rhythm, and voice contracts from the system message. Call each other's chapters back when it feels honest. This is one book, read start to finish.`,
    "",
    `# Chapters to fill (${req.sections.length} total)`,
  ].join("\n");

  const body = req.sections.map((s, i) => formatSection(s, i)).join("\n\n---\n\n");

  return `${header}\n\n${body}\n\n---\n\n${CONTRACT_REMINDER}`;
}
