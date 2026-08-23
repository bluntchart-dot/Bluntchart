# In-Depth Birth Chart + Transit Reading — Product State

## Product Identity

| Field | Value |
|---|---|
| Product key | `in-depth-reading` |
| DB product type | `in-depth-reading` |
| Reading product | `in-depth-reading` |
| Price | $24 |
| Reader URL | `/in-depth-readings?token=…` |
| Landing page | `/in-depth-birthchart-reading` (not built yet) |

## Product Positioning

**$15 Birth Chart Reading** → Understand your chart.
**$24 In-Depth Birth Chart + Transit Reading** → What your chart reveals. Why your life feels this way. What's next.
**Life Book** → A more immersive story-driven exploration of your life.

## Content Philosophy

Transit-first. More direct. More analytical. More specific. Less fluffy. More value per page.

Core experience: hook with "how does it know what's happening?" → timing/relief → forward look → deep birth chart context → takeaways.

## Chapter Structure (Transit First)

### Part I — Your Current Season (3 transit chapters)

1. **What's Happening Now** — Why life feels this way, what's activated, what's ending/beginning. Always covers love + career + one more activated area. The hook chapter.
2. **When Does It Get Better?** — When pressure eases, which area improves first, honest timing. Love + career anchored.
3. **What's Coming Next** — Opportunities, cautions, windows. Love + career anchored.

### Part II — Your Birth Chart (6 chapters)

4. **Who You Are** — Personality, hidden strengths/flaws, how others see you, what people misunderstand.
5. **Purpose & Destiny** — Life mission, natural talents, the lesson life keeps teaching.
6. **Career & Success** — Ideal career/business, success patterns, 2–4 specific fields/roles.
7. **Love, Relationships & Intimacy** — Full arc: attraction → emotional needs → sex → patterns → ideal partner → blocks → commitment. Longest chapter.
8. **Money & Wealth** — Money patterns, wealth-building approach, income/business paths.
9. **Growth & Emotional Well-being** — Blind spots, coping mechanisms, emotional patterns, what brings peace.

### Closer

10. **Takeaways** — Concise synthesis: what matters, stop, start, prioritize, look forward to.
11. Static closing note + farewell.

Total: 10 AI-authored sections (3 transit + 6 birth chart + 1 takeaways)

## Critical Transit Rule

Every transit chapter ALWAYS evaluates:
1. Love / relationships (fixed anchor)
2. Career / work / success (fixed anchor)
3. One additional area genuinely activated by the transits

Don't force equal space if activity is quiet. Lead with the strongest signal.

## Technical Astrology Layer

Superscript numbered reference system:
- Key findings marked with ¹ ² ³ in the body text
- 2–3 line technical explanations at the bottom of each chapter
- 2–4 references per chapter
- Body reads clean without references; references explain the planetary/house/aspect/transit basis

## "How Did It Know?" Moments

Up to 1–2 per transit chapter, only when genuinely supported by the evidence. Never create one just to satisfy a quota. Express the most specific possibility the astrology supports:
- Never invent specific events
- Use "maybe", "probably", "I wouldn't be surprised if" when evidence supports direction but not certainty
- State confidently only what the transit configuration strongly supports

## Current State

- Independent blueprint, guidelines, prompts, chapter profiles, mock content
- Shared V1.2 engine, UI, PDF, delivery infrastructure
- Async generation queue (same as Book)
- Email delivery reuses Book templates (Phase 1)

## Files NOT changed by this product

- V1.2 engine (generate-ai-reading.ts, anthropic-provider.ts, prompt-builder.ts)
- Astrology calculations (chart-calculator.ts, geocode-city.ts)
- Birth Chart Book product files
- $15 reading product files
- Insight scheduler infrastructure (insights/*)

## File Responsibility

| File | Role |
|---|---|
| `blueprint.ts` | Static page structure — the product |
| `chapter-profiles.ts` | Per-chapter insight scheduling config (Part II only) |
| `guidelines.ts` | Per-chapter AI emotional direction |
| `prompt-fragments.ts` | System prompt + contract reminder |
| `mock-content.ts` | Placeholder narratives for preview |
| `PRODUCT_STATE.md` | This file — product documentation |
