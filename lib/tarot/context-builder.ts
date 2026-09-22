/**
 * lib/tarot/context-builder.ts
 *
 * Formats drawn cards + spread positions into a prompt context
 * string for the AI to interpret.
 */

import type { DrawnCard } from "./draw";
import type { SpreadLayout } from "./spreads";
import { SUIT_THEMES } from "./deck";

export function buildTarotContext(
  drawn: readonly DrawnCard[],
  spread: SpreadLayout,
  question?: string
): string {
  const lines: string[] = [];

  lines.push(`=== TAROT READING: ${spread.name.toUpperCase()} ===`);
  lines.push(`Spread: ${spread.description}`);
  if (question) {
    lines.push(`Question: "${question}"`);
  }
  lines.push("");

  for (let i = 0; i < drawn.length; i++) {
    const { card, orientation, position } = drawn[i];
    const posLabel = position ?? spread.positions[i]?.label ?? `Card ${i + 1}`;
    const posMeaning = spread.positions[i]?.meaning ?? "";

    lines.push(`── Position ${i + 1}: ${posLabel} ──`);
    if (posMeaning) lines.push(`  (This position represents: ${posMeaning})`);
    lines.push(`  Card: ${card.name} (${orientation.toUpperCase()})`);
    lines.push(`  Arcana: ${card.arcana === "major" ? "Major Arcana" : `Minor Arcana, Suit of ${capitalize(card.suit!)}`}`);

    if (card.suit && SUIT_THEMES[card.suit]) {
      lines.push(`  Suit energy: ${SUIT_THEMES[card.suit].element} element, governs ${SUIT_THEMES[card.suit].domain}`);
    }

    lines.push(`  Keywords: ${card.keywords.join(", ")}`);

    if (orientation === "upright") {
      lines.push(`  Meaning: ${card.upright}`);
    } else {
      lines.push(`  Meaning (reversed): ${card.reversed}`);
    }

    lines.push("");
  }

  lines.push("READING INSTRUCTIONS:");
  lines.push("Interpret these cards together as a cohesive narrative, not as isolated readings.");
  lines.push("Connect the cards to each other. Show how the story flows from one position to the next.");
  lines.push("Be specific and direct. No vague platitudes.");
  if (drawn.some((d) => d.card.arcana === "major")) {
    lines.push("Major Arcana cards carry extra weight. They point to significant life themes, not small daily matters.");
  }
  if (drawn.some((d) => d.orientation === "reversed")) {
    lines.push("Reversed cards are not automatically negative. They often point to internalized energy, blocked potential, or something being worked through privately.");
  }

  return lines.join("\n");
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
