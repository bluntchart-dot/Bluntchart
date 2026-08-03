/**
 * lib/premium/insights/selector.ts
 *
 * Rank + dedupe extracted signals before handing them to the AI
 * interpreter (or the fallback rule engine).
 *
 * Goals:
 *   - Keep the strongest signals.
 *   - Drop near-duplicates that describe the same underlying fact.
 *   - Cap at a manageable input size for the interpreter (~30).
 *   - Preserve variety across signal KINDS so the AI has room to weave.
 */

import type { Signal, SignalKind } from "./types";

const MAX_SIGNALS_FOR_INTERPRETATION = 30;

/**
 * Some signal kinds naturally emit multiple candidates. We cap per-kind
 * so a chart with 12 tight aspects doesn't crowd out the single element
 * balance signal.
 */
const PER_KIND_CAP: Record<SignalKind, number> = {
  tight_aspect: 10,
  angular_planet: 5,
  element_balance: 1,
  element_missing: 2,
  modality_balance: 1,
  modality_missing: 2,
  personal_planet_placement: 3,
  contradiction_sun_moon_element: 2,
  contradiction_venus_mars_mode: 1,
};

export function selectSignalsForInterpretation(all: Signal[]): Signal[] {
  // Sort by strength descending, stable.
  const sorted = [...all].sort((a, b) => b.strength - a.strength);

  const perKindCount: Partial<Record<SignalKind, number>> = {};
  const selected: Signal[] = [];

  for (const sig of sorted) {
    if (selected.length >= MAX_SIGNALS_FOR_INTERPRETATION) break;
    const used = perKindCount[sig.kind] ?? 0;
    const cap = PER_KIND_CAP[sig.kind];
    if (used >= cap) continue;
    selected.push(sig);
    perKindCount[sig.kind] = used + 1;
  }

  return selected;
}
