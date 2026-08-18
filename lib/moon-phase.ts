import * as Astronomy from "astronomy-engine";

/* -------------------------------------------------------------------------- */
/*                               TYPES                                        */
/* -------------------------------------------------------------------------- */

export interface MoonPhaseData {
  phaseAngle: number;          // 0-360° (0=new, 90=Q1, 180=full, 270=Q3)
  illuminationFraction: number; // 0.0–1.0
  illuminationPercent: number;  // 0–100 (rounded)
  phaseName: string;           // "New Moon", "Waxing Crescent", etc.
  isWaxing: boolean;
  phaseCategory: PhaseCategory;
}

export type PhaseCategory =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "third-quarter"
  | "waning-crescent";

export interface CompatibilityResult {
  score: number;              // 0–100 integer, equals combinedCoverage × 100
  person1: MoonPhaseData;
  person2: MoonPhaseData;
  combinedCoverage: number;   // 0.0–1.0 — fraction of disk lit by superimposed moons
  angularDistance: number;    // 0–180° between the two phase positions
  rhythmRelation: string;    // "conjunction" | "sextile" | "square" | "trine" | "opposition" | "mixed"
}

/* -------------------------------------------------------------------------- */
/*                          PHASE CALCULATION                                 */
/* -------------------------------------------------------------------------- */

const PHASE_NAMES: { maxAngle: number; name: string; category: PhaseCategory }[] = [
  { maxAngle: 11.25,  name: "New Moon",         category: "new" },
  { maxAngle: 78.75,  name: "Waxing Crescent",  category: "waxing-crescent" },
  { maxAngle: 101.25, name: "First Quarter",    category: "first-quarter" },
  { maxAngle: 168.75, name: "Waxing Gibbous",   category: "waxing-gibbous" },
  { maxAngle: 191.25, name: "Full Moon",         category: "full" },
  { maxAngle: 258.75, name: "Waning Gibbous",   category: "waning-gibbous" },
  { maxAngle: 281.25, name: "Third Quarter",    category: "third-quarter" },
  { maxAngle: 348.75, name: "Waning Crescent",  category: "waning-crescent" },
  { maxAngle: 360,    name: "New Moon",          category: "new" },
];

/**
 * Compute moon phase data for a given birth date.
 *
 * Uses astronomy-engine's MoonPhase() (geocentric ecliptic longitude
 * difference between Moon and Sun) and Illumination() for the phase
 * fraction. Birth time is fixed at noon UTC — moon phase changes slowly
 * enough (~12° per day) that exact birth time doesn't matter for phase.
 */
export function getMoonPhase(dateStr: string): MoonPhaseData {
  const d = new Date(dateStr + "T12:00:00Z");

  const phaseAngle = Astronomy.MoonPhase(d);
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, d);
  const fraction = illum.phase_fraction;

  const entry = PHASE_NAMES.find((p) => phaseAngle < p.maxAngle)!;

  return {
    phaseAngle,
    illuminationFraction: fraction,
    illuminationPercent: Math.round(fraction * 100),
    phaseName: entry.name,
    isWaxing: phaseAngle < 180,
    phaseCategory: entry.category,
  };
}

/* -------------------------------------------------------------------------- */
/*                       COMPATIBILITY FORMULA                                */
/* -------------------------------------------------------------------------- */
/*
 * Combined Moon Coverage
 *
 * Models the union of two moon crescent shapes when overlaid on the same disk.
 * The compatibility percentage equals the fraction of the full circle that would
 * be illuminated if both birth moons were superimposed.
 *
 * Geometry:
 *   Each moon's illuminated region is a crescent bounded by the disk edge and
 *   an interior elliptical terminator. For a moon at phase angle φ:
 *     - Illumination fraction: f = (1 − cos(φ)) / 2
 *     - Waxing (0° ≤ φ ≤ 180°): right side is lit
 *     - Waning (180° < φ ≤ 360°): left side is lit
 *
 *   When both moons are on the SAME side (both waxing or both waning):
 *     The lit areas overlap completely — combined coverage = max(f₁, f₂).
 *
 *   When one is waxing and one is waning (OPPOSITE sides):
 *     The crescents light different halves of the disk. They only overlap if
 *     BOTH are gibbous (more than half lit, spilling across the midline).
 *     Overlap = max(0, −(cos(φ₁) + cos(φ₂))) / 2
 *     Combined = min(1, f₁ + f₂ − overlap)
 *
 * Inputs: two dates → two phase angles from Astronomy.MoonPhase()
 * Output: 0–100 integer score
 * Deterministic: same dates always produce the same score
 */

/**
 * Compute the compatibility score from two phase angles (0–360°).
 * Returns the combined moon coverage as a fraction (0.0–1.0).
 */
export function combinedCoverage(phaseAngle1: number, phaseAngle2: number): number {
  const RAD = Math.PI / 180;
  const f1 = (1 - Math.cos(phaseAngle1 * RAD)) / 2;
  const f2 = (1 - Math.cos(phaseAngle2 * RAD)) / 2;

  const waxing1 = phaseAngle1 <= 180;
  const waxing2 = phaseAngle2 <= 180;

  if (waxing1 === waxing2) {
    return Math.max(f1, f2);
  }

  const overlap = Math.max(0, -(Math.cos(phaseAngle1 * RAD) + Math.cos(phaseAngle2 * RAD))) / 2;
  return Math.min(1, f1 + f2 - overlap);
}

/**
 * Compute angular distance between two phase positions (0–180°).
 */
export function phaseAngularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b);
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Classify the angular relationship between two phases.
 * Uses 15° orb for traditional aspects.
 */
export function rhythmRelation(angularDist: number): string {
  if (angularDist <= 15) return "conjunction";
  if (angularDist >= 50 && angularDist <= 70) return "sextile";
  if (angularDist >= 80 && angularDist <= 100) return "square";
  if (angularDist >= 110 && angularDist <= 130) return "trine";
  if (angularDist >= 165) return "opposition";
  return "mixed";
}

/* -------------------------------------------------------------------------- */
/*                       FULL COMPATIBILITY RESULT                            */
/* -------------------------------------------------------------------------- */

export function calculateCompatibility(date1: string, date2: string): CompatibilityResult {
  const person1 = getMoonPhase(date1);
  const person2 = getMoonPhase(date2);

  const coverage = combinedCoverage(person1.phaseAngle, person2.phaseAngle);
  const score = Math.round(coverage * 100);

  const angDist = phaseAngularDistance(person1.phaseAngle, person2.phaseAngle);
  const rhythm = rhythmRelation(angDist);

  return {
    score,
    person1,
    person2,
    combinedCoverage: coverage,
    angularDistance: angDist,
    rhythmRelation: rhythm,
  };
}

/* -------------------------------------------------------------------------- */
/*                    PIXEL-BASED COVERAGE VERIFICATION                       */
/* -------------------------------------------------------------------------- */
/*
 * Numerically computes the actual projected area of the union of two moon
 * crescents on a unit disk. Used to validate that the analytic formula
 * matches the true geometric coverage.
 *
 * For each sample point on the disk, determines whether it falls inside
 * the illuminated region of either moon (based on the elliptical terminator
 * model), then counts the fraction of lit points.
 */

/**
 * Check if a point (x, y) on the unit disk is illuminated by a moon
 * at the given phase angle.
 *
 * The terminator is modeled as an ellipse with semi-axes (1, |cos(φ)|).
 * At vertical position y, the terminator crosses at:
 *   x_t = cos(φ) · √(1 − y²)
 *
 * For waxing (0–180°): lit region is x ≥ x_t
 * For waning (180–360°): lit region is x ≤ −x_t'
 *   where x_t' = cos(360°−φ) · √(1 − y²)
 */
function isPointLit(x: number, y: number, phaseAngle: number): boolean {
  const RAD = Math.PI / 180;
  const diskEdge = Math.sqrt(1 - y * y);

  if (phaseAngle <= 180) {
    const xt = Math.cos(phaseAngle * RAD) * diskEdge;
    return x >= xt;
  } else {
    const psi = 360 - phaseAngle;
    const xt = Math.cos(psi * RAD) * diskEdge;
    return x <= -xt;
  }
}

/**
 * Numerically compute the union coverage of two moons on the unit disk.
 *
 * @param samples - number of sample points per axis (higher = more accurate)
 * @returns coverage fraction 0.0–1.0
 */
export function numericalCoverage(
  phaseAngle1: number,
  phaseAngle2: number,
  samples: number = 500
): number {
  let litCount = 0;
  let totalCount = 0;

  const step = 2 / samples;

  for (let i = 0; i < samples; i++) {
    const y = -1 + step * (i + 0.5);
    const diskEdge = Math.sqrt(Math.max(0, 1 - y * y));

    const xSamples = Math.max(1, Math.round(samples * diskEdge));
    const xStep = (2 * diskEdge) / xSamples;

    for (let j = 0; j < xSamples; j++) {
      const x = -diskEdge + xStep * (j + 0.5);
      totalCount++;

      if (isPointLit(x, y, phaseAngle1) || isPointLit(x, y, phaseAngle2)) {
        litCount++;
      }
    }
  }

  return totalCount > 0 ? litCount / totalCount : 0;
}
