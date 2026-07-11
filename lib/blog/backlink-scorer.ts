import { MODELS, COMPETITOR_TERMS } from "./config";
import { generateJson, Type } from "./gemini-client";

export interface ScoreInput {
  url: string;
  submitted_context?: string;
}

export interface Score {
  relevance_score: number;
  domain_authority_estimate: number;
  outreach_worthiness: number;
  suggested_angle: string;
  scoring_notes: string;
}

export interface ScoreResult {
  ok: boolean;
  score?: Score;
  errorCode?: string;
  errorMessage?: string;
}

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    relevance_score: { type: Type.INTEGER },
    domain_authority_estimate: { type: Type.INTEGER },
    outreach_worthiness: { type: Type.INTEGER },
    suggested_angle: { type: Type.STRING },
    scoring_notes: { type: Type.STRING },
  },
  required: [
    "relevance_score",
    "domain_authority_estimate",
    "outreach_worthiness",
    "suggested_angle",
    "scoring_notes",
  ],
};

export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/**
 * Reject prospects that name a competitor (or use their app) — outreach
 * to those sites is a waste of a request slot.
 */
export function isCompetitorProspect(input: ScoreInput): boolean {
  const domain = extractDomain(input.url);
  if (!domain) return false;
  const ctxLower = (input.submitted_context ?? "").toLowerCase();
  for (const term of COMPETITOR_TERMS) {
    if (domain.includes(term.replace(/\s+/g, ""))) return true;
    if (ctxLower.includes(term)) return true;
  }
  return false;
}

function buildScoringPrompt(input: ScoreInput): string {
  const domain = extractDomain(input.url);
  return `You are BluntChart's outreach lead. Score this website as a backlink prospect from 1-10 on three axes and propose a one-line pitch angle.

BluntChart is an astrology SaaS (free birth chart, personalized readings, upcoming compatibility + transit tools). Our audience is people 22-40 interested in psychology-adjacent astrology — pattern recognition, relationships, life timing, not sun-sign horoscopes.

PROSPECT
  url: ${input.url}
  domain: ${domain}
  admin notes: ${input.submitted_context ?? "(none)"}

Score each field 1-10 (10 = best):

- relevance_score — how well the site's likely audience overlaps with ours. Astrology, self-development, relationships, therapy-adjacent, career-timing content score high. Generic lifestyle blogs score mid. Unrelated niches score low.

- domain_authority_estimate — your best guess at the site's outreach quality. Consider domain age, apparent editorial standards, whether it looks like an active publication or a defunct blog. Be honest and conservative.

- outreach_worthiness — composite: relevance × authority × how likely a "here is a free astrology tool your readers might link to" pitch actually lands. 10 means send this today. 3 means it is not worth the slot.

- suggested_angle — one sentence, plain, no marketing register. What specific pitch would work? Reference a concrete BluntChart tool if it fits.

- scoring_notes — 1-2 sentences of concrete reasoning for the operator.

Return strict JSON.`;
}

export async function scoreBacklinkProspect(
  input: ScoreInput
): Promise<ScoreResult> {
  const result = await generateJson<Score>({
    model: MODELS.backlinkScoring,
    prompt: buildScoringPrompt(input),
    schema: SCHEMA,
    temperature: 0.4,
    maxOutputTokens: 800,
  });

  if (!result.ok || !result.data) {
    return {
      ok: false,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
    };
  }

  const clamp = (n: number) => Math.max(1, Math.min(10, Math.round(n)));

  return {
    ok: true,
    score: {
      relevance_score: clamp(result.data.relevance_score),
      domain_authority_estimate: clamp(result.data.domain_authority_estimate),
      outreach_worthiness: clamp(result.data.outreach_worthiness),
      suggested_angle: result.data.suggested_angle.trim().slice(0, 240),
      scoring_notes: result.data.scoring_notes.trim().slice(0, 500),
    },
  };
}
