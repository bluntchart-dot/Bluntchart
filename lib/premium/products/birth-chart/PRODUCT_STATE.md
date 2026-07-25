# Birth Chart — Product State (Version 1)

Single source of truth for the Premium Birth Chart reading product.
Frozen at the end of Version 1. Every future modification should be measured
against what is documented here.

Last updated: 2026-07-24.

---

## 1. Product vision and philosophy

We are not building an astrology reading. We are building **a personal story
that just happens to be powered by astrology**.

- The reader should finish every chapter thinking **"how do you know I've
  literally done that?"** Recognition, not admiration.
- Astrology is the engine. The story is the product. The engine should be
  almost invisible in the prose. The technical explanation lives outside
  the story, in a separate "why we're saying this" UI card after each
  chapter.
- The voice is the reader's smartest, funniest friend who has known her for
  five years and is finally telling her everything she's quietly noticed.
  Not a novelist, therapist, philosopher, life coach, or astrologer.
- The whole book reads as **one continuous conversation** from cover to
  farewell, not fourteen separate essays.

Every downstream decision (architecture, prompt, UI, PDF) exists to protect
these four points.

---

## 2. Final architecture

The product is composed of six clean layers. Each layer does one job and
depends only on the layer beneath it.

```
                     ┌─────────────────────────────┐
     UI / render →   │ PremiumBook, PremiumBookPDF │
                     └─────────────┬───────────────┘
                                   │ consumes PremiumReading
                     ┌─────────────▼───────────────┐
     Orchestrator →  │ generate-ai-reading         │
                     │ build-mock-reading          │
                     └──────┬─────────────┬────────┘
                            │             │
              ┌─────────────▼──┐   ┌──────▼──────────────┐
     Product →│ blueprint      │   │ AI layer            │
              │ guidelines     │   │ ai/prompt-builder   │
              │ mock-content   │   │ ai/anthropic-provider│
              │ prompt-fragments│  │ ai/models           │
              └─────┬──────────┘   └──────┬──────────────┘
                    │                     │
              ┌─────▼─────────────────────▼─────┐
    Chart →   │ chart-calculator + chart-context│
              │ built-using                     │
              └─────────────────┬───────────────┘
                                │
                     ┌──────────▼───────────┐
     API entry →     │ /api/internal/premium│
                     └──────────────────────┘
```

Guiding contracts, all enforced today:
- **The product owns structure.** The blueprint is the source of truth for
  every heading, subtitle, chapter order, and page type. AI never invents
  or removes any of it.
- **The product owns direction.** Per-chapter emotional guidance lives in
  `guidelines.ts` and is never rendered to the reader.
- **The AI only writes bodies.** It fills the body under each pre-defined
  chapter title and does nothing else.
- **Astrology facts come from the chart engine.** The AI never computes,
  derives, or invents placements. It only writes prose around facts we
  hand it.
- **One request per reading.** The book is generated as a single Anthropic
  call using tool-use for structured output. This is deliberate: it is the
  only way the model can hold "one continuous conversation" across all
  chapters.

---

## 3. Folder structure

```
app/
  api/internal/premium/
    generate/route.ts         # POST endpoint. Cookie-gated.
    dev-login/route.ts        # Sets the premium_dev_ok cookie.
  internal/premium/
    page.tsx                  # /internal/premium playground page.

components/
  PremiumReadingApp.tsx       # Birth-details form → book preview.
  premium/
    PremiumBook.tsx           # Full book reader (swipe/scroll, resume).
    PremiumBookCover.tsx      # Cover page.
    PremiumBookPage.tsx       # Renders one page based on pageType.
    PremiumBookBuiltUsing.tsx # "Why we're saying this" card.
    PremiumBookPDF.tsx        # @react-pdf/renderer document.
    PremiumBookPDFButton.tsx  # Download button (lazy-loads the PDF module).
    PdfChartWheel.tsx         # Natal wheel drawn in react-pdf SVG.

lib/premium/
  types.ts                    # PremiumReading + every shared type.
  chart-context.ts            # Reader Portrait / Digest / Themes / Silent Ref.
  built-using.ts              # Deterministic Built Using card generator.
  build-mock-reading.ts       # Mock-body path (real chart + fake bodies).
  generate-ai-reading.ts      # Real-AI orchestrator.
  dev-auth.ts                 # premium_dev_ok cookie helpers.

  ai/
    types.ts                  # AiProvider / request / response shapes.
    models.ts                 # Registry of local model ids → provider config.
    prompt-builder.ts         # Assembles system + user prompts.
    anthropic-provider.ts     # AiProvider impl (streaming + tool use + cache).

  products/
    registry.ts               # ReadingProduct → { blueprint, guidelines, mock }.
    birth-chart/
      blueprint.ts            # Static section order + titles + subtitles.
      guidelines.ts           # Per-chapter emotional direction for the AI.
      prompt-fragments.ts     # SYSTEM_PROMPT + CONTRACT_REMINDER.
      mock-content.ts         # In-voice mock bodies for preview mode.
      PRODUCT_STATE.md        # ← this document.
```

---

## 4. Reading blueprint and sections

The book is a fixed ordered sequence of pages. Every page has a `pageType`
that tells the renderer which layout to use. Only pages with
`pageType: "chapter"` get an AI body — everything else is static content
owned by the product.

Full list, in reader order (see `blueprint.ts` for authoritative content):

| # | Section id | pageType | AI-authored? | Notes |
|---|---|---|---|---|
| 1 | cover | cover | no | Reader name + reading time. |
| 2 | welcome | welcome | no | Static hook. |
| 3 | natal-chart | chart | no | Real wheel from the chart engine. |
| 4 | how-we-read-your-chart | education | no | Static explainer + Built Using table. |
| 5 | part-one-title | part-title | no | Hero page. |
| 6 | before-we-begin | chapter | **yes** | Sun / Moon / Rising. |
| 7 | real-you | chapter | **yes** | Sun / Moon / Rising. |
| 8 | inner-fighter | chapter | **yes** | Mars / Sun / aspects. |
| 9 | blind-spot | chapter | **yes** | Saturn / 12H / aspects. |
| 10 | love-patterns | chapter | **yes** | Venus / Mars / 5H / 7H. |
| 11 | shadow | chapter | **yes** | Pluto / Saturn / 12H. |
| 12 | growth-lesson | chapter | **yes** | Saturn / North Node / Chiron. |
| 13 | career | chapter | **yes** | Midheaven / Saturn / Jupiter / 10H. |
| 14 | hidden-gift | chapter | **yes** | Jupiter / Sun / aspects. |
| 15 | safe-place | chapter | **yes** | Moon / IC / 2H. |
| 16 | life-story | chapter | **yes** | Combined — the whole chart. |
| 17 | transition-part-two | transition | no | Static bridge. |
| 18 | part-two-title | part-title | no | Hero page. |
| 19 | transit-season | chapter | **yes** | Current transits + Saturn. |
| 20 | transit-life-areas | chapter | **yes** | Transits + Venus/MC/Jupiter/2H. |
| 21 | transit-timing | chapter | **yes** | Transits + aspects. |
| 22 | final-note | closing | no | Static closer. |
| 23 | farewell | farewell | no | Signed-off "we'll meet again." |

Chapter guidelines (`guidelines.ts`) declare, per chapter:
- `narrativeForm` — the **opening move** shape (see §5 palette).
- `emotionalObjective` — the one "why do I…" question this chapter
  quietly answers. Encoded as a felt problem the chapter solves, not a
  personality description.
- `tone` — the emotional register.
- `desiredReaderFeeling` — the target reaction.
- `writingStyle` — emotional camera direction (opening image, middle
  beat, closing beat). Never astrology scaffolding.
- `approxWords` — tight targets (400–500 for most; 450–550 for career;
  500–600 for transit-life-areas; 550–650 for shadow and life-story).
- `transitionGoal` — an emotional **drift** into the next chapter, not
  a hand-off.
- `astrologyInputs` — declared inputs (currently used only as
  documentation; runtime uses the blueprint's `chartInputs`).

---

## 5. Prompt philosophy and writing rules

The prompt lives in `prompt-fragments.ts` as two exports:
`SYSTEM_PROMPT` and `CONTRACT_REMINDER`.

### The one test that overrides every other rule
The reader should finish every chapter thinking:
**"How do you know I've literally done that?"**

Not "beautifully written." Not "psychologically astute." Recognition, not
admiration.

Priority hierarchy:
1. Observation beats philosophy.
2. Specificity beats abstraction.
3. Relatability beats beautiful writing.

### Voice
Smartest, funniest friend who has known the reader for five years. She
gossips about the reader to the reader, doing a bit while also being
completely serious. She calls the reader out warmly. She uses situations
the reader will recognise (the reread text, the impulse-bought domain,
the cancelled brunch, the LinkedIn refresh). She interrupts herself.
She teases warmly.

Never a novelist, therapist, philosopher, life coach, horoscope writer,
astrologer, or AI. Every voice has example phrases the prompt tells the
model to detect and delete.

### Ten permanent contracts inside the SYSTEM_PROMPT

1. **Real-life vocabulary** — a whitelist (loyalty, boundaries, ghosting,
   people-pleasing, overthinking, validation, burnout, etc.) and four
   blacklists (psychology-textbook, literary, life-coach, horoscope).
2. **Real-life behaviour bank** — sixteen digital-age shapes the writer
   should reach for (Notes app entries, replaying a conversation in the
   car, doom-scrolling after an argument, adding to cart for three
   weeks then buying in one click, etc.).
3. **Behavioural translation — mandatory** — every abstract observation
   must translate into a specific behaviour in the same paragraph.
   "You move fast" is never allowed to stand alone; it must be
   accompanied by "fast in what."
4. **Observation Contract** — every chapter must contain at least one
   concrete behavioural observation that feels like something only a
   close friend would notice. Rotate framings — never overuse
   "You're the kind of person who…"
5. **Warm humour — only when it fits.** No per-chapter minimum.
   Authenticity beats consistency. Grief / shadow / hurt chapters may
   have zero humour.
6. **Astrology Invisibility Contract** — the chapter must be readable
   and emotionally intact if every planet, house, degree, and aspect
   were deleted. At most one placement mention per chapter, only if the
   sentence is genuinely stronger with it.
7. **One realization per chapter. No repetition across chapters.**
   Themes in the reader anchor are raw material, not chapter topics.
   Overlapping insights must be replaced with a new angle.
8. **Continuity Contract** — every chapter after the first contains a
   specific callback (a phrase, image, habit) from an earlier chapter.
   Chapters drift into each other. Never name the earlier chapter.
9. **Opening Move Contract** — `narrativeForm` names the shape of the
   first few sentences only, never the genre of the whole chapter.
   Palette: `confession`, `scene`, `guess`, `observation`,
   `quiet-question`, `challenge`, `dialogue`, `memory`. Never
   consecutive duplicates. Explicit ban on personality-analysis
   openings and horoscope words.
10. **Ending palette** — six rotating shapes (practical takeaway,
    uncomfortable truth, funny observation, best-friend advice, teaser,
    specific image). Explicit ban on "trust the process," "give
    yourself permission," aphorisms, and "try this once this week."

Also: dialogue every three chapters (brain/heart shape); one screenshot
line per chapter; short paragraphs; no em/en dashes; word target
400–500 with named exceptions.

### The reader anchor
`chart-context.ts` builds one large per-user anchor read once at the top
of the user prompt:

- **Reader Portrait** — 100–150 words of prose sketch drawn from Sun /
  Moon / Rising. Written as a friend describing the reader.
- **Personality Digest** — 2–3 sentences on the surface-vs-underneath
  gap.
- **Core Emotional Themes** — behavioural through-lines drawn from Sun
  and Moon signs. Written as "keeps [doing X]" behaviours, not
  aphorisms.
- **Silent Chart Reference** — the raw placement facts, explicitly
  labelled as a reference block the model may consult for accuracy but
  must not narrate.

Per-chapter blocks in the user prompt now carry only *emotional
territory* labels (via `buildSectionChartContext`), never coordinates.
This is deliberate — the last thing the model reads before writing a
chapter is emotional direction, never astrology.

---

## 6. UI decisions

- **`PremiumBook`** is a horizontal swipe reader built on native CSS
  `scroll-snap`. No swipe library. Keyboard navigation (← →) is bound.
- **Position is persisted** to `localStorage` under
  `bluntchart_book_position_v1`, keyed by a stable reading signature
  (`name|dob|birthTime|birthPlace|readingVersion`). Reopening the same
  reading resumes; different readings restart at the cover.
- **Page rendering is polymorphic on `pageType`**. Adding a new
  page type = code change in the renderer, never a silent behaviour
  change.
- **Page backgrounds** are picked from `renderHints.pageBackground`
  (`starfield` / `gradient` / `plain` / `warm-glow`), themed off the
  blueprint's `pageTheme`.
- **The Built Using card** appears at the bottom of every AI chapter,
  populated by `buildBuiltUsing()` from real chart data. AI never
  authors it and never gestures at it in the prose.
- **The download PDF button lazy-loads** the whole `@react-pdf/renderer`
  bundle so the library only lands in the client on demand.
- **The chapter progress header** shows part name and "Chapter N of M"
  based on the blueprint's `chapterNumber` — quiet, non-intrusive.

---

## 7. PDF decisions

- **`@react-pdf/renderer` v4**, dynamically imported.
- **Fonts must be system-safe** — react-pdf uses its own StyleSheet
  subset (no CSS variables, no `display: grid`, flex only).
- **The PDF is a separate `PremiumBookPDF` document**, not a screenshot
  of the reader. Layout is authored specifically for print.
- **The natal wheel is drawn in react-pdf SVG** by `PdfChartWheel`
  (currently has pre-existing tsc noise about `fontSize` on `Text`
  elements — non-blocking, see §13).
- **The static explainer table** (`CHAPTER_BUILT_USING_TABLE`) is
  imported directly from the blueprint so the PDF and the interactive
  book always show identical trust content.

---

## 8. Technical decisions

- **Runtime: Next.js (custom fork).** `AGENTS.md` at repo root warns:
  *"This is NOT the Next.js you know. APIs, conventions, and file
  structure may all differ from training data. Read
  `node_modules/next/dist/docs/` before writing new code."* Take that
  warning literally.
- **Chart engine: `astronomy-engine`**, via `lib/chart-calculator.ts`.
  Deterministic and offline. No third-party ephemeris service call.
- **Geo resolution** prefers stored coordinates from the birth-details
  form's `LocationPicker`, falls back to `geocodeCity()`.
- **AI SDK: `@anthropic-ai/sdk` ^0.113**. Streaming used because Haiku
  4.5 at `max_tokens ≥ 24k` will otherwise HTTP-timeout.
- **Tool-use for structured output.** The provider registers one tool
  (`submit_birth_chart_reading`) whose `input_schema` declares exactly
  the section ids we requested. The model is forced to call it. Any
  missing id is a hard failure with telemetry.
- **Prompt caching.** Both the system prompt and the user prompt carry
  `cache_control: { type: "ephemeral" }`. After the first reading in a
  5-minute window, subsequent calls hit the cache for ~90% of input
  tokens.
- **The mock path is a first-class code path**, not a debug flag. It
  uses the real chart engine and the real renderer with static fake
  bodies. This is what lets us iterate on UI/PDF without spending on
  AI calls.
- **Post-processing on AI bodies** — em/en dashes stripped, trailing
  whitespace normalised, triple-newlines collapsed. Guards against the
  model slipping past the punctuation rule.
- **Estimated reading time** = total body words / 240 WPM, rounded to
  the nearest 5 minutes (minimum 5).
- **`READING_VERSION`** in `types.ts` is bumped by hand whenever the
  shape of `PremiumReading` changes so older stored readings can
  degrade gracefully.

---

## 9. AI generation flow

Entry point: `POST /api/internal/premium/generate`.

```
1. Auth
   - Read premium_dev_ok cookie from next/headers.
   - Compare against PREMIUM_DEV_PASSWORD env var.
   - 401 if missing or mismatched.

2. Validate body
   - name, dob (YYYY-MM-DD), birth_time (HH:mm), city all required.
   - email optional but validated if present.
   - model optional. Resolved as:
       "mock"    → mock path
       ""        → DEFAULT_MODEL if ANTHROPIC_API_KEY set, else "mock"
       known id  → that model
       unknown   → "mock" (safe fallback)

3. Mock branch
   - buildMockPremiumReading(birth) — real chart + mock bodies.
   - Returns PremiumReading tagged generationSource: "mock".

4. AI branch (generate-ai-reading.ts)
   a. resolveGeo — stored coords or geocode fallback.
   b. calculateChart(birthData) via astronomy-engine.
   c. Build AiGenerationRequest:
      - readerName
      - readerOpener = buildReaderOpener(chart, name)
        → the full anchor (Portrait + Digest + Themes + Silent Reference).
      - sections[] = one AiSectionRequest per chapter blueprint entry,
        carrying its guideline + emotional-territory chartContext.
   d. AnthropicProvider.generate:
      - Streams client.messages.stream with tool_choice forcing our tool.
      - Awaits final message, extracts the tool_use block.
      - Validates every requested section id is present and non-empty.
      - Returns bodies + telemetry.
   e. renderSectionsFromBodies:
      - Walk activeSections in blueprint order.
      - For each chapter: cleanBody(bodies[id]).
      - For each static page: use blueprint.staticBody.
      - Attach builtUsing from buildBuiltUsing(chart, chartInputs).
   f. Wrap in PremiumReading with meta (readingVersion, generationSource,
      estimatedReadingMinutes, totalChapters, etc.).

5. Response
   - { ok: true, reading: PremiumReading, telemetry?, source }
   - Or { ok: false, error, telemetry? } on failure.
```

**The reading is generated in one call.** This was a deliberate choice
over per-chapter generation. It is the only way to hold "one continuous
conversation" across all fourteen chapters.

---

## 10. Files responsible for each part of the product

| Concern | File |
|---|---|
| API entry point | `app/api/internal/premium/generate/route.ts` |
| Dev login route | `app/api/internal/premium/dev-login/route.ts` |
| Playground page | `app/internal/premium/page.tsx` |
| Birth-details form | `components/PremiumReadingApp.tsx` |
| Book reader shell | `components/premium/PremiumBook.tsx` |
| Cover page | `components/premium/PremiumBookCover.tsx` |
| Page renderer | `components/premium/PremiumBookPage.tsx` |
| Built Using card | `components/premium/PremiumBookBuiltUsing.tsx` |
| PDF document | `components/premium/PremiumBookPDF.tsx` |
| PDF button | `components/premium/PremiumBookPDFButton.tsx` |
| PDF chart wheel | `components/premium/PdfChartWheel.tsx` |
| Shared types (source of truth) | `lib/premium/types.ts` |
| Reader anchor builder | `lib/premium/chart-context.ts` |
| Built Using generator | `lib/premium/built-using.ts` |
| Mock reading builder | `lib/premium/build-mock-reading.ts` |
| AI reading orchestrator | `lib/premium/generate-ai-reading.ts` |
| Dev-auth helpers | `lib/premium/dev-auth.ts` |
| AI provider contract | `lib/premium/ai/types.ts` |
| Model registry | `lib/premium/ai/models.ts` |
| Prompt assembly | `lib/premium/ai/prompt-builder.ts` |
| Anthropic provider | `lib/premium/ai/anthropic-provider.ts` |
| Product registry | `lib/premium/products/registry.ts` |
| Birth-chart blueprint | `lib/premium/products/birth-chart/blueprint.ts` |
| Birth-chart guidelines | `lib/premium/products/birth-chart/guidelines.ts` |
| Birth-chart prompts | `lib/premium/products/birth-chart/prompt-fragments.ts` |
| Birth-chart mock bodies | `lib/premium/products/birth-chart/mock-content.ts` |
| Chart calculation | `lib/chart-calculator.ts` |
| Geocoding | `lib/geocode-city.ts` |
| Chart types | `lib/types.ts` |

---

## 11. Environment variables used

Only two, both server-side only:

| Var | Required for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | AI generation | If missing, the API silently prefers mock. Missing key + explicit model request returns 503. |
| `PREMIUM_DEV_PASSWORD` | Auth gate | Compared against the `premium_dev_ok` cookie value set at `/api/internal/premium/dev-login`. If unset, all requests are unauthorised. |

No env-var-driven feature flags. No third-party services beyond
Anthropic.

---

## 12. Features intentionally postponed

- **Real transit engine.** Part II chapters (`transit-season`,
  `transit-life-areas`, `transit-timing`) are shipped as chapters in
  the blueprint but the underlying `current-transits` chart input is
  not computed by our chart engine yet. The mock bodies fill in for
  now. AI generation of transit chapters will produce weaker output
  until the engine ships.
- **North Node, South Node, Chiron.** Declared in the `ChartInput`
  union and referenced in blueprints/guidelines, but not currently
  computed by `chart-calculator.ts`. `built-using.ts` silently drops
  them. `chart-context.ts` silently drops them too.
- **Payment + customer-facing routes.** Today the product only lives
  under `/internal/premium`, behind a shared password. There is no
  checkout, no user account, no email delivery, no post-purchase
  storage. The reading is generated per request and never persisted.
- **Compatibility, Year-Ahead, Gift-Reading products.** Declared as
  reserved slots in the product registry (`registry.ts`) and in the
  `ReadingProduct` union. Implementations return `null` and the
  registry throws if requested — deliberate, so no caller silently
  degrades.
- **Post-generation astrology-jargon audit.** Discussed as a nice-to-
  have (regex/keyword scan with a soft ceiling on planet/house/degree
  mentions per chapter). Not built. Prompt-level enforcement handles
  it today.
- **Two-pass editing.** Discussed as a way to guarantee callbacks and
  screenshot lines. Not built — single-pass generation is the
  shipping design.

---

## 13. Known limitations

- **`SectionId` union in `lib/premium/types.ts` is out of sync with
  the blueprint.** Five ids that the blueprint uses today are missing
  from the union: `part-one-title`, `part-two-title`, `farewell`,
  `transit-season`, `transit-life-areas`. Ten legacy `transit-*` ids
  in the union are no longer referenced by any blueprint. This causes
  ~7 pre-existing tsc errors in `blueprint.ts`, `guidelines.ts`, and
  `mock-content.ts`. Runtime is unaffected. A task chip was spawned
  earlier to reconcile the union — safe to do at any time.
- **`PdfChartWheel.tsx` has pre-existing tsc noise** about `fontSize`
  not existing on react-pdf `Text` (~6 errors). Also non-blocking.
- **The guideline `astrologyInputs` field is effectively dead data.**
  Runtime uses `blueprint.chartInputs` for both Built Using and chart
  context. The field is kept in the interface for documentation only.
- **The `formatSection` label in `prompt-builder.ts`** still reads
  `"Chart placements this chapter draws on:"` even though the content
  under it is now emotional-territory prose, not placements. Cosmetic;
  the model handles both fine.
- **Prompt cache is 5-minute ephemeral.** Rapid iteration during
  testing benefits; scheduled generation more than 5 minutes apart
  pays the full input-token cost each time.
- **Auth is a single shared password.** Cookie is httpOnly, `sameSite:
  lax`, path `/`, 30-day expiry. Adequate for internal dev usage; not
  a customer-facing security model.
- **No rate limiting on the API route.** Internal auth is the only
  gate. Anyone with the password can generate unlimited readings and
  spend the Anthropic budget.
- **Reading is not persisted server-side.** If the browser drops the
  response, the reading is gone. `localStorage` on the client is the
  only durable state (and only for reader position, not the reading
  itself).
- **AI generation is not idempotent.** Each call to the endpoint is a
  fresh generation. No caching of prior readings for the same birth
  details.
- **The mock bodies are frozen in an earlier voice era** (pre the
  friend-voice rewrite in V1.1). They are still coherent, but they do
  not reflect the shipping voice contract. Do not use them as a
  reference for what real AI output should read like.

---

## 14. Future improvements (Version 2 ideas only, do not implement)

Ideas surfaced across V1 conversations. Ordered by rough leverage, not
priority. Do not implement without a fresh discussion.

- **Ship the transit engine.** Real `current-transits` computation
  unlocks the three Part II chapters and moves them from mock to real
  AI output.
- **Add North Node, South Node, Chiron to the chart calculator.** Two
  chapters (growth-lesson, life-story) declare inputs the engine
  currently drops. Adding them upgrades those chapters' Built Using
  cards without any prompt change.
- **Post-generation quality audit.**
  - Astrology-jargon regex ceiling (planet/house/degree mentions per
    chapter and per book).
  - Callback ledger check (each chapter after the first contains at
    least one specific string from an earlier chapter).
  - Screenshot-line detector (heuristic on paragraph endings).
  Any failure could either flag for review or trigger a targeted
  regeneration of that chapter.
- **Two-pass generation.** First pass writes all fourteen bodies.
  Second pass edits with the whole draft in context to enforce
  callbacks, kill repeated insights, and add screenshot lines where
  missing. Roughly doubles cost per reading.
- **Per-chapter regeneration.** Today generation is all-or-nothing.
  A "regenerate this chapter" flow keyed by section id (with prior
  chapters in context) would help both dev iteration and future
  customer flows.
- **Idempotent reading cache.** Cache readings keyed by birth details
  + `readingVersion` + model id. Two purchases of the same reading
  do the same math and pay the AI cost once.
- **Server-side reading persistence.** Store `PremiumReading` in a
  database on generation. Unblocks email delivery, revisits without
  regenerating, share links.
- **Payment + customer flow.** Checkout, delivery, share links,
  post-purchase account. This is a much bigger surface — probably its
  own project.
- **Second product: Compatibility reading.** Slot already reserved in
  the registry. Would follow the same blueprint / guidelines / prompt
  pattern with a partner chart as a second input.
- **Prompt-level A/B**. Swap `prompt-fragments.ts` behind a variant
  flag so we can measure engagement per voice iteration on real
  users, not on our own reads.
- **Author-supplied opening bank per chapter.** Small palette of
  approved opening moves per chapter that the model rotates through,
  never repeating a specific shape twice. Structurally kills the
  "every chapter sounds the same" risk.
- **Sonnet/Opus escalation for specific chapters.** Some chapters
  (Shadow, Life Story) may benefit disproportionately from a bigger
  model. Selective per-chapter model choice would balance cost.
- **Richer PDF layout.** The current PDF is minimally styled; there
  is room to invest in typography, ornament, and cover art without
  changing the underlying data.

---

## 15. Important things another developer should know before modifying this product

Read this list before touching anything.

1. **Do not treat this as a generic Next.js app.** `AGENTS.md` at repo
   root warns that this version of Next has breaking changes vs public
   docs. Consult `node_modules/next/dist/docs/` before adding routes,
   middleware, or config.
2. **The blueprint is the contract.** Every renderer walks the same
   ordered `activeSections` list and asks for the page's `pageType`.
   Do not rearrange chapters, rename ids, or invent new page types
   without walking every renderer.
3. **The `SectionId` union in `types.ts` is authoritative — but
   currently out of sync with the blueprint (see §13).** Add missing
   ids before adding new chapters. Do not "just add a new key" to
   `guidelines` or `mock-content` — the type will silently reject it.
4. **The AI never writes anything the product can compute.** Chart
   facts, Built Using cards, transitions between parts, static pages,
   the cover, the closer — all deterministic, all owned by the
   product. If you find yourself wanting the AI to derive a number
   or name a placement, that is a signal to move the logic upstream.
5. **The prompt is the product.** `SYSTEM_PROMPT` and
   `CONTRACT_REMINDER` are frozen at the end of V1.1. Do not tweak
   them speculatively — every rule earned its place across several
   real-output test cycles. Change them only on the back of concrete
   customer feedback or a specific failure case, and expect a
   regression test cycle after any edit.
6. **`READING_VERSION`** in `types.ts` must be bumped by hand
   whenever the shape of `PremiumReading` changes. Old stored
   readings should keep rendering.
7. **Generation is one call.** Do not split chapters into separate
   requests for "efficiency" — you will lose continuity, which is the
   product. If cost is the driver, look at model choice or
   prompt caching before touching the shape.
8. **Prompt cache breakpoints matter.** The `cache_control` markers
   in `anthropic-provider.ts` sit exactly where the constant/varying
   boundary is. Moving them without thinking will silently torch the
   cost model.
9. **`/internal/premium` is not customer-facing.** Do not link to it
   from public pages. Do not remove the cookie gate.
10. **The mock path is production code.** It ships in every build and
    is used every time `ANTHROPIC_API_KEY` is absent or `model: "mock"`
    is passed. Keep it working.
11. **Voice iteration history matters.** V1.0 was "novelist / literary."
    V1.1 shifted to "friend voice." Multiple rules in the prompt exist
    specifically to prevent regression back to V1.0. If you find a rule
    that looks redundant, it is probably guarding against a specific
    past failure. Ask before deleting.
12. **The Reader Portrait anchor is the single biggest lever on tone.**
    Almost every prompt outcome traces back to what the model sees at
    the top of the user prompt. If output feels wrong, start by
    inspecting `chart-context.ts` output for that reader before
    touching the SYSTEM_PROMPT.
13. **The Built Using card is the contract that keeps astrology out of
    the story.** It exists so the reader can see the technical
    grounding without the story having to mention it. Do not weaken
    the invisibility contract in the prompt without a plan for what
    replaces this trust device.
14. **Pre-existing tsc noise is not new work.** Any changes to the
    premium module should leave the `SectionId` union drift and
    `PdfChartWheel` `fontSize` errors exactly as they are — those are
    tracked separately. New tsc errors introduced by a change ARE
    your responsibility.
15. **Test with real generations, not with reasoning.** The prompt is
    long and the model is opinionated. Reason about the change, but
    always verify by generating at least two full readings across
    different birth charts before declaring a change good.

---

_This document is the contract. Any drift between the code and this
document should be resolved in favour of the code, and this document
updated._
