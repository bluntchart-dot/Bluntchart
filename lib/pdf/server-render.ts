/**
 * lib/pdf/server-render.ts
 *
 * Server-side PDF rendering. Takes a reading JSON + metadata,
 * picks the right PDF component, and returns a Buffer.
 *
 * Uses @react-pdf/renderer's renderToBuffer (Node.js only).
 * This file must NOT be imported from client components.
 */

import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { ReadingProduct } from "@/lib/premium/types";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface PdfRenderInput {
  product: ReadingProduct;
  customerName: string;
  reading: Record<string, unknown>;
  question?: string;
  zodiacSign?: string;
}

export interface PdfRenderResult {
  ok: boolean;
  buffer: Buffer | null;
  filename: string;
  error?: string;
}

/* ═════════════════════════════════════════════════════════════════
   PRODUCT → PDF CONFIG MAP
═════════════════════════════════════════════════════════════════ */

interface PdfConfig {
  title: string;
  variant: "birth-chart" | "three-card" | "yes-no" | "love" | "generic";
}

const PDF_CONFIGS: Partial<Record<ReadingProduct, PdfConfig>> = {
  "brutally-honest-reading": {
    title: "Your Birth Chart Reading",
    variant: "birth-chart",
  },
  "three-card-tarot": {
    title: "Three Card Tarot Reading",
    variant: "three-card",
  },
  "yes-no-tarot": {
    title: "Yes / No Tarot",
    variant: "yes-no",
  },
  "love-reading": {
    title: "Your Love Reading",
    variant: "love",
  },
  "career-reading": {
    title: "Your Career Reading",
    variant: "generic",
  },
  "shadow-reading": {
    title: "Your Shadow Reading",
    variant: "generic",
  },
  "saturn-return": {
    title: "Your Saturn Return Reading",
    variant: "generic",
  },
  "moon-reading": {
    title: "Your Moon Reading",
    variant: "generic",
  },
  "money-reading": {
    title: "Your Money Reading",
    variant: "generic",
  },
  "daily-tarot": {
    title: "Daily Tarot Card",
    variant: "generic",
  },
  "year-ahead": {
    title: "Your Year Ahead Reading",
    variant: "generic",
  },
  "gift-reading": {
    title: "Your Personal Gift Reading",
    variant: "generic",
  },
  compatibility: {
    title: "Your Compatibility Reading",
    variant: "generic",
  },
  "monthly-transit": {
    title: "Your Monthly Transit Reading",
    variant: "generic",
  },
  "soulmate-reading": {
    title: "Your Soulmate Reading",
    variant: "love",
  },
  "hidden-feelings": {
    title: "Hidden Feelings Reading",
    variant: "love",
  },
  "ex-love-reading": {
    title: "Ex-Love / Reconciliation Reading",
    variant: "love",
  },
  "blunt-love": {
    title: "Blunt Love Reality Check",
    variant: "love",
  },
  "blunt-career": {
    title: "Blunt Career Wake-Up Call",
    variant: "generic",
  },
  "big-three-mini": {
    title: "Your Big Three Reading",
    variant: "generic",
  },
  "life-purpose": {
    title: "Your Life Purpose Reading",
    variant: "generic",
  },
  "personality-decoded": {
    title: "Your Personality Decoded",
    variant: "generic",
  },
  "blind-reading": {
    title: "Your Blind Reading",
    variant: "generic",
  },
  "situationship-reality-check": {
    title: "Situationship Reality Check",
    variant: "love",
  },
};

function getPdfConfig(product: ReadingProduct): PdfConfig {
  return PDF_CONFIGS[product] ?? {
    title: "Your Reading",
    variant: "generic",
  };
}

const PRODUCT_TAGLINES: Partial<Record<ReadingProduct, [string, string]>> = {
  "love-reading": ["What your heart already knows.", "Written in your Venus."],
  "career-reading": ["Your ambition, decoded.", "The career your chart demands."],
  "shadow-reading": ["The parts you hide from everyone.", "Your chart sees everything."],
  "moon-reading": ["Your emotional blueprint, exposed.", "What your Moon truly needs."],
  "money-reading": ["Your relationship with money.", "Decoded from your chart."],
  "saturn-return": ["The reckoning you needed.", "Growth disguised as chaos."],
  "soulmate-reading": ["Who your chart is looking for.", "The connection that changes everything."],
  "hidden-feelings": ["What you won't say out loud.", "Your chart already knows."],
  "ex-love-reading": ["What really happened between you.", "The closure your chart can give."],
  "blunt-love": ["No sugarcoating your love life.", "The honest truth, finally."],
  "blunt-career": ["Your career wake-up call.", "What you've been avoiding."],
  "monthly-transit": ["What this month is bringing.", "The energy you need to know."],
  "life-purpose": ["Why you're actually here.", "Your chart has the answer."],
  "brutally-honest-reading": ["The truth you didn't ask for.", "Your chart holds nothing back."],
  "personality-decoded": ["Every layer of who you are.", "Decoded from the stars."],
  "year-ahead": ["What's coming for you.", "Your roadmap for the year."],
  "big-three-mini": ["Sun. Moon. Rising.", "The three that define you."],
  "blind-reading": ["No expectations. No filters.", "Just your chart, raw."],
  "gift-reading": ["A reading, personally gifted.", "Written in their stars."],
  compatibility: ["Two charts. One truth.", "What's really between you."],
  "daily-tarot": ["One card. One message.", "What today needs you to hear."],
  "three-card-tarot": ["Past. Present. Future.", "The cards lay it out."],
  "yes-no-tarot": ["One question. One card.", "The answer you needed."],
  "situationship-reality-check": ["Name it or leave it.", "Your chart won't let you hide."],
};

/* ═════════════════════════════════════════════════════════════════
   RENDER
═════════════════════════════════════════════════════════════════ */

export async function renderReadingPdf(
  input: PdfRenderInput
): Promise<PdfRenderResult> {
  const config = getPdfConfig(input.product);
  const safeName = (input.customerName || "reader")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "reader";
  const filename = `bluntchart-${safeName}-${input.product}.pdf`;

  try {
    let element: React.ReactElement;

    if (config.variant === "birth-chart") {
      const ReadingPDF = (await import("@/components/ReadingPDF")).default;

      const reading = input.reading as {
        letter_opener?: string;
        preview?: Array<{ planet?: string; hook?: string; truth?: string; reveal?: string }>;
        paidInsights?: Array<{ planet?: string; truth?: string; explain?: string; action?: string }>;
      };

      element = React.createElement(ReadingPDF, {
        name: input.customerName,
        letterOpener: reading.letter_opener ?? null,
        preview: reading.preview ?? [],
        paidInsights: reading.paidInsights ?? [],
      });
    } else {
      const TarotReadingPDF = (await import("@/components/TarotReadingPDF")).default;

      element = React.createElement(TarotReadingPDF, {
        name: input.customerName,
        productTitle: config.title,
        reading: input.reading,
        variant: config.variant,
        question: input.question,
        zodiacSign: input.zodiacSign,
        tagline: PRODUCT_TAGLINES[input.product],
      });
    }

    const buffer = await renderToBuffer(element as any);
    return { ok: true, buffer: Buffer.from(buffer), filename };
  } catch (err) {
    return {
      ok: false,
      buffer: null,
      filename,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Convenience: render and return as base64 string (for JSON responses).
 */
export async function renderReadingPdfBase64(
  input: PdfRenderInput
): Promise<{ ok: boolean; base64: string | null; filename: string; error?: string }> {
  const result = await renderReadingPdf(input);
  if (!result.ok || !result.buffer) {
    return { ok: false, base64: null, filename: result.filename, error: result.error };
  }
  return {
    ok: true,
    base64: result.buffer.toString("base64"),
    filename: result.filename,
  };
}
