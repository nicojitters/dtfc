# DT:FC Cycle 2 — Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the DT:FC landing page per the vision-fidelity spec (3×3 grid with Community centered, data-driven box modes with hybrid default, prohibited-text guardrail), and lightly seed the six section landing pages so the "Idea Two" answer promise is honored in-section and rotating reflective prompts render.

**Architecture:** Data lives in one Zod-validated TS module (`src/data/landing.ts`) with a single `LANDING_MODE` switch. Landing page composes small purpose-scoped Astro components (`Resilience`, `CommunityCenter`, `BoxContent`, `SectionBox`, `WorkshopsTile`, `NewsletterTile`, `LandingGrid`). Section pages import a shared `ReflectivePrompt` component that randomly picks one prompt from that section's 5-prompt bank on load via inline JS. A new prebuild script (`scripts/check-prohibited-text.mjs`) blocks the build on any occurrence of the spec's rejected phrases or source typos.

**Tech Stack:** Astro 5, Tailwind v4 (`@theme` tokens), TypeScript strict, Zod (via new direct dep) for schema validation, Vitest for unit tests, Playwright for the e2e smoke test. No new frameworks; new inline JS is ~20 lines vanilla, no Preact islands added.

## Global Constraints

- **Branch:** all work happens on `cycle-2-landing`. Merge to `main` at cycle end uses `git merge --no-ff`.
- **Package manager:** `pnpm` only. `pnpm dev` for local, `pnpm check` for type check, `pnpm build` for prebuild+build, `pnpm test` for Vitest, `pnpm test:e2e` for Playwright.
- **Node module type:** `"type": "module"` — all new scripts and configs use ESM.
- **No hex codes in components** — colors come from tokens in `src/styles/tokens.css`.
- **Vocabulary:** "Players" (never "actors"), "Facilitator" (never "leader"), "Players Resource Center" (full name). Warm, playful, encouraging voice; exclamation-friendly.
- **Naming:** `"Children's Theatre"` everywhere (curly apostrophe, "Theatre" not "Plays"). Never `"Childrens' Theatre"` (wrong apostrophe from source).
- **Prohibited landing/site copy:** "Great Change", "traditional work and ways", "THIS (crazy) time", `RESILIENCEl` (typo). Enforced by `scripts/check-prohibited-text.mjs` after Task 2.
- **Canonical Community text (verbatim):**
  - Headline: `Be Fearlessly Creative!`
  - Opener: `Keep exploring!`
  - Body: `We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE that will keep you learning in unexpected and challenging situations.`
  - Extended paragraphs (secondary weight):
    1. `This community explores how to courageously use one's voice and physical presence, recognize new contexts, manage risk, and nurture RESILIENCE.`
    2. `We provide fast access to entertaining Developmental Theatre techniques and tools for expected or challenging situations.`
- **`RESILIENCE` styled emphasis:** rendered via `<Resilience>` component (`<strong>` with uppercase + `font-semibold`) — never as plain uppercase text.
- **Content collection ids:** any inline `<Concept id="…" />` reference must resolve via the existing `check-concept-refs.mjs` guardrail.
- **Copy comments:** any drafted copy that isn't verbatim from the vision spec (i.e. all new prose in Tasks 11–16) gets an `{/* CLIENT REVIEW: reason */}` JSX comment above it inside `.astro` pages, or an HTML comment inside MDX.
- **Commit granularity:** one commit per task (see each task's final step). Commits authored `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.

---

## File Map

**Create:**
- `scripts/check-prohibited-text.mjs`
- `src/components/landing/Resilience.astro`
- `src/components/landing/CommunityCenter.astro`
- `src/components/landing/BoxContent.astro`
- `src/components/landing/SectionBox.astro`
- `src/components/landing/WorkshopsTile.astro`
- `src/components/landing/NewsletterTile.astro`
- `src/components/landing/LandingGrid.astro`
- `src/components/section/ReflectivePrompt.astro`
- `src/content/concepts/icons.mdx`
- `tests/unit/landing.test.ts`
- `tests/unit/prohibited-text.test.ts`
- `docs/superpowers/plans/2026-08-10-dtfc-cycle2-landing.md` (this file)

**Modify:**
- `package.json` — add `zod` dep; add `check:prohibited` script; extend `build` script.
- `src/data/landing.ts` — full rewrite.
- `src/pages/index.astro` — full rewrite.
- `src/pages/community/index.astro` — add ReflectivePrompt + one paragraph.
- `src/pages/theatre-games/index.astro` — add ReflectivePrompt + three answer lines.
- `src/pages/shakespeare/index.astro` — add ReflectivePrompt + three paragraphs.
- `src/pages/childrens-theatre/index.astro` — add ReflectivePrompt + two paragraphs.
- `src/pages/legacy/index.astro` — add ReflectivePrompt + two paragraphs.
- `src/pages/resource-center/index.astro` — add ReflectivePrompt + ICONs callout.
- `tests/e2e/smoke.spec.ts` — extend for landing identity + one section reflective prompt.
- `CLAUDE.md` — landing data model, prohibited-text guardrail, new dirs.

**Auto-memory updates (end of cycle):** `project_dtfc_cycles.md`, `project_dtfc_followups.md`, `MEMORY.md`.

---

## Task 1: Rewrite `src/data/landing.ts` with Zod-validated schema and verbatim vision-spec content

**Files:**
- Modify: `package.json` (add `zod` dep)
- Modify: `src/data/landing.ts` (full rewrite; keep `WELCOME_HEADING`, `WELCOME_BODY` as temporary backward-compat aliases so `src/pages/index.astro` still builds until Task 9)
- Create: `tests/unit/landing.test.ts`

**Interfaces produced (used by every downstream task):**
- `export type BoxMode = 'list' | 'questions' | 'hybrid'`
- `export type BoxVariant = 'standard' | 'center' | 'secondary'`
- `export interface Box { key: NavKey; label: string; href: string; summary: string; listItems: string[]; questions: string[]; mode?: BoxMode; variant: BoxVariant }`
- `export interface ReflectiveBank { sectionKey: NavKey; prompts: [string, string, string, string, string] }`
- `export const LANDING_MODE: BoxMode`
- `export const COMMUNITY_CENTER: { headline: string; keepExploring: string; body: string; extended: readonly [string, string] }`
- `export const SECTION_TILES: Box[]` — 5 boxes: theatre-games, shakespeare, childrens-theatre, legacy, resource-center (in that order, matching nav.ts).
- `export const WORKSHOPS_BOX: Box`
- `export const REFLECTIVE_BANKS: ReflectiveBank[]` — 6 banks (5 sections above + community), each with exactly 5 prompts.
- `export const IDEA_TWO_ANSWERS: Array<{ question: string; answerAt: string }>` — 13 rows from vision spec §6, exposed so `landing.test.ts` and the section-page tasks can verify.
- `export function pickIndex(bank: string[], seed: number): number` — deterministic index picker (used by tests and by BoxContent/ReflectivePrompt at runtime with `Math.random()` as seed).

**Backward-compat aliases (removed in Task 9):**
- `export const WELCOME_HEADING` = `COMMUNITY_CENTER.headline`
- `export const WELCOME_BODY` = `[COMMUNITY_CENTER.body, ...COMMUNITY_CENTER.extended]`
- `export const SECTION_BOXES` (existing shape, existing 6 boxes) — leave in place for `src/pages/index.astro`

- [ ] **Step 1: Add zod as a direct dependency**

Run:
```bash
pnpm add zod
```

Expected: `zod` appears in `package.json` under `dependencies`. `pnpm-lock.yaml` updates.

- [ ] **Step 2: Write the failing test file `tests/unit/landing.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import {
  BoxSchema,
  ReflectiveBankSchema,
  SECTION_TILES,
  WORKSHOPS_BOX,
  COMMUNITY_CENTER,
  REFLECTIVE_BANKS,
  IDEA_TWO_ANSWERS,
  LANDING_MODE,
  pickIndex,
} from '@/data/landing';
import { NAV_ITEMS } from '@/lib/nav';

describe('landing data — Box schema', () => {
  it('SECTION_TILES has exactly 5 tiles', () => {
    expect(SECTION_TILES).toHaveLength(5);
  });

  it('every SECTION_TILE parses against BoxSchema', () => {
    for (const tile of SECTION_TILES) {
      expect(() => BoxSchema.parse(tile)).not.toThrow();
    }
  });

  it('SECTION_TILES are in nav.ts order (community excluded, workshops excluded)', () => {
    const expected = NAV_ITEMS
      .filter((n) => n.key !== 'community' && n.key !== 'workshops')
      .map((n) => n.key);
    expect(SECTION_TILES.map((t) => t.key)).toEqual(expected);
  });

  it('every standard tile has at least 1 listItem and at least 2 questions', () => {
    for (const tile of SECTION_TILES) {
      expect(tile.listItems.length).toBeGreaterThanOrEqual(1);
      expect(tile.questions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('WORKSHOPS_BOX has variant "secondary" and empty content arrays', () => {
    expect(WORKSHOPS_BOX.variant).toBe('secondary');
    expect(WORKSHOPS_BOX.listItems).toEqual([]);
    expect(WORKSHOPS_BOX.questions).toEqual([]);
  });
});

describe('landing data — Community center', () => {
  it('headline is exactly "Be Fearlessly Creative!"', () => {
    expect(COMMUNITY_CENTER.headline).toBe('Be Fearlessly Creative!');
  });

  it('body contains uppercase RESILIENCE exactly once and no source typos', () => {
    const matches = COMMUNITY_CENTER.body.match(/RESILIENCE/g) ?? [];
    expect(matches).toHaveLength(1);
    expect(COMMUNITY_CENTER.body).not.toMatch(/RESILIENCEl/);
  });

  it('extended array has exactly 2 paragraphs and both mention RESILIENCE or resilience', () => {
    expect(COMMUNITY_CENTER.extended).toHaveLength(2);
  });
});

describe('landing data — Reflective banks', () => {
  it('REFLECTIVE_BANKS has exactly 6 banks (community + 5 sections)', () => {
    expect(REFLECTIVE_BANKS).toHaveLength(6);
  });

  it('every bank has exactly 5 prompts', () => {
    for (const bank of REFLECTIVE_BANKS) {
      expect(bank.prompts).toHaveLength(5);
    }
  });

  it('every bank parses against ReflectiveBankSchema', () => {
    for (const bank of REFLECTIVE_BANKS) {
      expect(() => ReflectiveBankSchema.parse(bank)).not.toThrow();
    }
  });

  it('bank sectionKeys are unique and each matches a nav key', () => {
    const keys = REFLECTIVE_BANKS.map((b) => b.sectionKey);
    expect(new Set(keys).size).toBe(keys.length);
    const navKeys = new Set(NAV_ITEMS.map((n) => n.key));
    for (const k of keys) {
      expect(navKeys.has(k)).toBe(true);
    }
  });

  it('no bank contains superseded first-set phrasing', () => {
    // First generic set used pre-Lola section names.
    const forbidden = [
      /Acting\s*\/\s*Performance/i,
      /Technical Theater/i,
      /Community Engagement/i,
    ];
    for (const bank of REFLECTIVE_BANKS) {
      for (const prompt of bank.prompts) {
        for (const rx of forbidden) {
          expect(prompt).not.toMatch(rx);
        }
      }
    }
  });

  it('Legacy bank uses the revised set (fear/intimidating variant), not the first set', () => {
    const legacy = REFLECTIVE_BANKS.find((b) => b.sectionKey === 'legacy');
    expect(legacy).toBeDefined();
    // Revised Legacy prompt 1 begins with "What aspect of creative exploration..."
    expect(legacy!.prompts[0]).toMatch(/What aspect of creative exploration/);
  });
});

describe('landing data — Idea Two answer promise', () => {
  it('IDEA_TWO_ANSWERS has exactly 13 rows (per vision spec §6)', () => {
    expect(IDEA_TWO_ANSWERS).toHaveLength(13);
  });

  it('every §6 question appears verbatim in exactly one SECTION_TILES[i].questions array', () => {
    const allQuestions = SECTION_TILES.flatMap((t) => t.questions);
    for (const row of IDEA_TWO_ANSWERS) {
      const found = allQuestions.filter((q) => q === row.question);
      expect(found).toHaveLength(1);
    }
  });
});

describe('landing data — mode + picker', () => {
  it('LANDING_MODE default is "hybrid"', () => {
    expect(LANDING_MODE).toBe('hybrid');
  });

  it('pickIndex returns a valid index in bounds', () => {
    expect(pickIndex(['a', 'b', 'c'], 0)).toBe(0);
    expect(pickIndex(['a', 'b', 'c'], 0.99)).toBe(2);
    expect(pickIndex(['a', 'b', 'c'], 0.5)).toBe(1);
  });

  it('pickIndex returns 0 for empty bank', () => {
    expect(pickIndex([], 0.5)).toBe(0);
  });
});
```

- [ ] **Step 3: Run the test to confirm it fails**

Run:
```bash
pnpm test tests/unit/landing.test.ts
```

Expected: FAIL — module cannot be resolved, or exports are missing (`BoxSchema`, `SECTION_TILES`, `pickIndex`, etc. not exported).

- [ ] **Step 4: Rewrite `src/data/landing.ts` with the full schema and verbatim content**

Replace the entire file contents with:

```typescript
import { z } from 'zod';
import type { NavKey } from '@/lib/nav';

// -----------------------------------------------------------------------------
// Schemas
// -----------------------------------------------------------------------------

const NAV_KEYS = [
  'community',
  'theatre-games',
  'shakespeare',
  'childrens-theatre',
  'legacy',
  'resource-center',
  'workshops',
] as const satisfies readonly NavKey[];

const NavKeySchema = z.enum(NAV_KEYS);

export const BoxModeSchema = z.enum(['list', 'questions', 'hybrid']);
export type BoxMode = z.infer<typeof BoxModeSchema>;

export const BoxVariantSchema = z.enum(['standard', 'center', 'secondary']);
export type BoxVariant = z.infer<typeof BoxVariantSchema>;

export const BoxSchema = z.object({
  key: NavKeySchema,
  label: z.string().min(1),
  href: z.string().min(1),
  summary: z.string().min(1),
  listItems: z.array(z.string()),
  questions: z.array(z.string()),
  mode: BoxModeSchema.optional(),
  variant: BoxVariantSchema,
});
export type Box = z.infer<typeof BoxSchema>;

export const ReflectiveBankSchema = z.object({
  sectionKey: NavKeySchema,
  prompts: z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]),
});
export type ReflectiveBank = z.infer<typeof ReflectiveBankSchema>;

// -----------------------------------------------------------------------------
// The client-flippable mode switch
// -----------------------------------------------------------------------------

/**
 * Change this one line to change every standard box's rendering across the landing page.
 * `hybrid`  → one-line summary + rotating teaser question (default)
 * `list`    → summary hidden, Idea One list rendered
 * `questions` → summary hidden, all Idea Two questions rendered
 */
export const LANDING_MODE: BoxMode = 'hybrid';

// -----------------------------------------------------------------------------
// Canonical Community center text (vision spec §3.1, Third Revision, verbatim)
// -----------------------------------------------------------------------------

export const COMMUNITY_CENTER = {
  headline: 'Be Fearlessly Creative!',
  keepExploring: 'Keep exploring!',
  body: 'We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE that will keep you learning in unexpected and challenging situations.',
  extended: [
    "This community explores how to courageously use one's voice and physical presence, recognize new contexts, manage risk, and nurture RESILIENCE.",
    'We provide fast access to entertaining Developmental Theatre techniques and tools for expected or challenging situations.',
  ] as const,
} as const;

// -----------------------------------------------------------------------------
// Section tiles — 5 boxes surrounding Community (nav order minus community/workshops)
// Verbatim content from vision spec §4.1 (lists) and §4.2 (questions)
// -----------------------------------------------------------------------------

export const SECTION_TILES: Box[] = [
  {
    key: 'theatre-games',
    label: 'Theatre Games',
    href: '/theatre-games/',
    summary: 'Lifetime creativity, hundreds of games, and how to be in a group.',
    listItems: ['Lifetime Creativity', 'Hundreds of Games', 'How to be in a Group'],
    questions: [
      'What makes learning playful and empowering?',
      "What's the difference between resignation and resilience?",
      'What theatre game competency trains Elocution, Memorization, Declamation, Presentation?',
    ],
    variant: 'standard',
  },
  {
    key: 'shakespeare',
    label: 'Shakespeare',
    href: '/shakespeare/',
    summary: 'K through adult — oral literacy, monologues, scenes, and themed montages.',
    listItems: ['K through Adult', 'Oral literacy', 'Monologues, Scenes', 'Scenes on Themes'],
    questions: [
      "How many of Shakespeare's plays are performed now — 440+ years later?",
      "Who is translating Shakespeare's plays into Chinese?",
      'Do you have a question to Ask Shakespeare?',
    ],
    variant: 'standard',
  },
  {
    key: 'childrens-theatre',
    label: "Children's Theatre",
    href: '/childrens-theatre/',
    summary: 'Plays, theatre teaching units, and storytelling — myth-driven and minimalist.',
    listItems: ['Plays', 'Theatre Teaching Units', 'Storytelling'],
    questions: [
      'As a child did you create plays with friends?',
      'Can imagination provide all sets and props?',
      'How does putting on a play become fun for every person involved?',
    ],
    variant: 'standard',
  },
  {
    key: 'legacy',
    label: 'Legacy',
    href: '/legacy/',
    summary: 'History, foundational concepts, who — when — why, and next steps.',
    listItems: ['History', 'Foundational Concepts', 'Who/When/Why', 'Next Steps'],
    questions: [
      'In the 1970s what did the University of Colorado create that led to this website?',
      'Who founded Developmental Theatre?',
      'How do I become part of this Legacy?',
    ],
    variant: 'standard',
  },
  {
    key: 'resource-center',
    label: 'Players Resource Center',
    href: '/resource-center/',
    summary: 'Tools, vocabulary, key concepts, and definitions — the site-wide glossary.',
    listItems: ['Tools', 'Vocabulary', 'Key Concepts', 'Definitions'],
    questions: [
      'Where do I find key vocabulary and concepts?',
      'What are the ICONS and how are they used?',
    ],
    variant: 'standard',
  },
];

export const WORKSHOPS_BOX: Box = {
  key: 'workshops',
  label: 'Workshops',
  href: '/workshops/',
  summary: 'Coming Next Year',
  listItems: [],
  questions: [],
  variant: 'secondary',
};

// -----------------------------------------------------------------------------
// Reflective question banks (vision spec §5, verbatim)
// -----------------------------------------------------------------------------

export const REFLECTIVE_BANKS: ReflectiveBank[] = [
  {
    sectionKey: 'shakespeare',
    prompts: [
      'If you could play any Shakespearean character, who would you choose and why?',
      'Which Shakespeare play speaks most deeply to our current moment in history?',
      'What Shakespearean quote has stayed with you throughout your life?',
      'If Shakespeare were writing today, what modern subject would you most want him to explore?',
      "Which of Shakespeare's worlds would you most like to step into for a day?",
    ],
  },
  {
    sectionKey: 'childrens-theatre',
    prompts: [
      'What childhood story do you believe deserves to be brought to life on stage?',
      "What magical element would you include in a play to captivate a child's imagination?",
      "What lesson or value do you think is most important to convey through children's theater?",
      'What was your most memorable experience with theater or storytelling as a child?',
      'If you could create a character specifically to inspire children, what qualities would they have?',
    ],
  },
  {
    sectionKey: 'theatre-games',
    prompts: [
      "What's your favorite way to break the ice in a room full of strangers?",
      'When was the last time play or improvisation helped you solve a problem?',
      'What aspect of yourself would you most like to explore through theatrical play?',
      'Which emotion do you find most challenging to express, and would like to practice through games?',
      'If you could invent a theater game, what skill or quality would it help develop?',
    ],
  },
  {
    sectionKey: 'community',
    prompts: [
      'How has a shared artistic experience strengthened your connection to others?',
      'What story from your community deserves to be told on stage?',
      'What role do you believe theater should play in addressing local challenges?',
      'How might theater bring together different generations in your community?',
      'What community tradition would you most like to see celebrated through performance?',
    ],
  },
  {
    // REVISED SET (canonical) — the first Legacy set was replaced at Lola's request
    sectionKey: 'legacy',
    prompts: [
      'What aspect of creative exploration do you find most intimidating, and how might learning about Developmental Theatre help you overcome that fear?',
      'If you could ask the founders of Developmental Theatre one question about their creative process, what would it be?',
      'What do you believe are the essential conditions needed for people to take creative risks?',
      'Which element of theater-making do you think benefits most from the "developmental" approach?',
      'How do you think understanding the history of Developmental Theatre might transform your own creative practice?',
    ],
  },
  {
    sectionKey: 'resource-center',
    prompts: [
      'Which theatrical term or concept do you find most fascinating or mysterious?',
      'How would you describe the difference between acting and being in your own words?',
      'What aspect of theater vocabulary would you most like to understand better?',
      'If you could master one technical element of theater, which would it be and why?',
      'How do you think understanding theatrical language enhances the experience of theater?',
    ],
  },
];

// -----------------------------------------------------------------------------
// Idea Two answer promise (vision spec §6, verbatim)
// Used by tests and by section pages that need to link to their own answers.
// -----------------------------------------------------------------------------

export const IDEA_TWO_ANSWERS: Array<{ question: string; answerAt: string }> = [
  { question: 'Can imagination provide all sets and props?', answerAt: '/childrens-theatre/#imagination' },
  { question: 'How does putting on a play become fun for every person involved?', answerAt: '/childrens-theatre/#every-person' },
  { question: 'Where do I find key vocabulary and concepts?', answerAt: '/resource-center/' },
  { question: 'What are the ICONS and how are they used?', answerAt: '/resource-center/#icons' },
  { question: 'What makes learning playful and empowering?', answerAt: '/theatre-games/#playful-empowering' },
  { question: "What's the difference between resignation and resilience?", answerAt: '/theatre-games/#resignation-resilience' },
  { question: 'What theatre game competency trains Elocution, Memorization, Declamation, Presentation?', answerAt: '/theatre-games/#vocal-expression' },
  { question: "How many of Shakespeare's plays are performed now — 440+ years later?", answerAt: '/shakespeare/#four-hundred-forty' },
  { question: "Who is translating Shakespeare's plays into Chinese?", answerAt: '/shakespeare/#daniel-yang' },
  { question: 'Do you have a question to Ask Shakespeare?', answerAt: '/shakespeare/#ask-shakespeare' },
  { question: 'In the 1970s what did the University of Colorado create that led to this website?', answerAt: '/legacy/#colorado-caravan' },
  { question: 'Who founded Developmental Theatre?', answerAt: '/legacy/#founders' },
  { question: 'How do I become part of this Legacy?', answerAt: '/community/#membership' },
];

// -----------------------------------------------------------------------------
// Runtime index picker — deterministic in tests, seeded with Math.random() at runtime
// -----------------------------------------------------------------------------

/**
 * Given a bank and a seed in [0, 1), return an index in [0, bank.length).
 * Returns 0 for an empty bank so callers don't have to null-check.
 */
export function pickIndex(bank: readonly unknown[], seed: number): number {
  if (bank.length === 0) return 0;
  const clamped = Math.max(0, Math.min(0.9999999, seed));
  return Math.floor(clamped * bank.length);
}

// -----------------------------------------------------------------------------
// Build-time verification IIFE — throws (fails the build) on drift
// -----------------------------------------------------------------------------

(function verifyAtImport() {
  for (const tile of SECTION_TILES) BoxSchema.parse(tile);
  BoxSchema.parse(WORKSHOPS_BOX);
  for (const bank of REFLECTIVE_BANKS) ReflectiveBankSchema.parse(bank);
  const allQ = SECTION_TILES.flatMap((t) => t.questions);
  for (const row of IDEA_TWO_ANSWERS) {
    if (!allQ.includes(row.question)) {
      throw new Error(
        `[landing.ts] §6 answer promise broken: no SECTION_TILES entry contains the question "${row.question}"`,
      );
    }
  }
})();

// -----------------------------------------------------------------------------
// BACKWARD-COMPAT ALIASES — used by src/pages/index.astro until Task 9 rewrites it.
// Delete this block in Task 9.
// -----------------------------------------------------------------------------

export const WELCOME_HEADING = `COMMUNITY — ${COMMUNITY_CENTER.headline}`;
export const WELCOME_BODY: readonly string[] = [
  `${COMMUNITY_CENTER.keepExploring} ${COMMUNITY_CENTER.body}`,
  ...COMMUNITY_CENTER.extended,
];

export interface SectionBox {
  key: NavKey;
  label: string;
  href: string;
  summary: string;
  teasers: string[];
  comingSoon?: boolean;
}

export const SECTION_BOXES: SectionBox[] = [
  {
    key: 'community',
    label: 'Community',
    href: '/community/',
    summary: "Who we are, how we're organized, newsletters, and companion theatres.",
    teasers: [],
  },
  ...SECTION_TILES.map<SectionBox>((t) => ({
    key: t.key,
    label: t.label,
    href: t.href,
    summary: t.summary,
    teasers: t.questions,
  })),
];
```

- [ ] **Step 5: Run the test suite to confirm it passes**

Run:
```bash
pnpm test tests/unit/landing.test.ts
```

Expected: all `describe` blocks pass. If the "IDEA_TWO_ANSWERS matches" test fails, the question text in `SECTION_TILES` doesn't exactly match `IDEA_TWO_ANSWERS[i].question` — check for smart-quote drift.

- [ ] **Step 6: Verify Astro type-check still passes**

Run:
```bash
pnpm check
```

Expected: 0 errors. (Warnings about existing files are pre-existing and out of scope.)

- [ ] **Step 7: Verify `pnpm build` still succeeds**

Run:
```bash
pnpm build
```

Expected: build completes; the existing `src/pages/index.astro` still renders because backward-compat aliases (`WELCOME_HEADING`, `WELCOME_BODY`, `SECTION_BOXES`) are preserved.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml src/data/landing.ts tests/unit/landing.test.ts
git commit -m "$(cat <<'EOF'
feat(landing): add Zod-validated schema, canonical §3.1 text, §4/§5/§6 verbatim content

Introduces the Cycle 2 landing data model: BoxSchema, ReflectiveBankSchema,
LANDING_MODE switch (hybrid default), COMMUNITY_CENTER (Third Revision text),
SECTION_TILES (5 tiles, verbatim §4), REFLECTIVE_BANKS (6 banks, verbatim §5),
IDEA_TWO_ANSWERS (13-row §6 promise table), and a pickIndex helper.

Backward-compat aliases (WELCOME_HEADING, WELCOME_BODY, SECTION_BOXES) kept
temporarily so the existing home page continues to build until Task 9 rewrites
it. Removes them then.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add prohibited-text guardrail script + Vitest test + wire into prebuild

**Files:**
- Create: `scripts/check-prohibited-text.mjs`
- Create: `tests/unit/prohibited-text.test.ts`
- Modify: `package.json` (add `check:prohibited` script; extend `build` script)

**Interfaces produced:**
- `scripts/check-prohibited-text.mjs` exports (via ESM `export`) `findViolations(text: string, file: string): Array<{ file: string; line: number; col: number; phrase: string; reason: string }>` for testability. The script's default action when run directly is to scan the repo and exit 1 on any violation.

- [ ] **Step 1: Write the failing test at `tests/unit/prohibited-text.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-prohibited-text.mjs';

describe('prohibited-text guardrail', () => {
  it('flags "Great Change" (case-insensitive)', () => {
    const hits = findViolations('In this time of Great Change we...', 'fake.txt');
    expect(hits).toHaveLength(1);
    expect(hits[0].phrase.toLowerCase()).toBe('great change');
  });

  it('flags "traditional work and ways" (case-insensitive)', () => {
    const hits = findViolations('when Traditional Work And Ways no longer exist', 'fake.txt');
    expect(hits).toHaveLength(1);
  });

  it('flags the RESILIENCEl typo (case-sensitive)', () => {
    const hits = findViolations('we nurture RESILIENCEl in players', 'fake.txt');
    expect(hits.some((h) => h.phrase === 'RESILIENCEl')).toBe(true);
  });

  it("flags the wrong-apostrophe \"Childrens' Theatre\"", () => {
    const hits = findViolations("Welcome to Childrens' Theatre!", 'fake.txt');
    expect(hits.some((h) => h.phrase.includes("Childrens'"))).toBe(true);
  });

  it('flags "THIS (crazy) time" (case-insensitive)', () => {
    const hits = findViolations('in THIS (crazy) time of upheaval', 'fake.txt');
    expect(hits).toHaveLength(1);
  });

  it('does NOT flag clean canonical text', () => {
    const canonical =
      "We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE...";
    expect(findViolations(canonical, 'fake.txt')).toHaveLength(0);
  });

  it("does NOT flag the correct \"Children's Theatre\" (curly apostrophe)", () => {
    expect(findViolations("Welcome to Children's Theatre!", 'fake.txt')).toHaveLength(0);
  });

  it('does NOT flag "RESILIENCE" (correct spelling)', () => {
    expect(findViolations('nurture RESILIENCE in every player', 'fake.txt')).toHaveLength(0);
  });

  it('reports line and column numbers accurately', () => {
    const text = 'line one\nline two with Great Change\nline three';
    const hits = findViolations(text, 'fake.txt');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(2);
    expect(hits[0].file).toBe('fake.txt');
    expect(hits[0].col).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test — confirm it fails (module not found)**

Run:
```bash
pnpm test tests/unit/prohibited-text.test.ts
```

Expected: FAIL — `scripts/check-prohibited-text.mjs` not found.

- [ ] **Step 3: Create `scripts/check-prohibited-text.mjs`**

```javascript
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import fg from 'fast-glob';

/**
 * Vision-spec-prohibited phrases and source typos. Editing this list is the
 * only supported way to tune the guardrail.
 *
 * Each entry: { phrase, regex, reason }
 *   - phrase: canonical human-readable string (used in error output)
 *   - regex: MUST have the `g` flag; MAY have `i`
 *   - reason: short explanation shown in the error output
 */
export const PATTERNS = [
  {
    phrase: 'Great Change',
    regex: /great change/gi,
    reason: 'Rejected slide-3 phrasing (Pua: dates the work; site copy stays timeless)',
  },
  {
    phrase: 'traditional work and ways',
    regex: /traditional work and ways/gi,
    reason: 'Rejected slide-3 phrasing (same rationale)',
  },
  {
    phrase: 'RESILIENCEl',
    regex: /RESILIENCEl/g,
    reason: 'Source typo — canonical spelling is RESILIENCE',
  },
  {
    phrase: "Childrens' Theatre",
    regex: /Childrens[’']\s+Theatre/g,
    reason: "Wrong-apostrophe form from slides — canonical is \"Children's Theatre\"",
  },
  {
    phrase: 'THIS (crazy) time',
    regex: /\bTHIS\s+\(crazy\)\s+time\b/gi,
    reason: 'Explicitly rejected by Pua',
  },
];

/**
 * Scan `text` (originating from `file`) for prohibited phrases.
 * Returns [] when clean.
 */
export function findViolations(text, file) {
  const hits = [];
  for (const { phrase, regex, reason } of PATTERNS) {
    const rx = new RegExp(regex.source, regex.flags); // fresh instance per call (regex state)
    let match;
    while ((match = rx.exec(text)) !== null) {
      const before = text.slice(0, match.index);
      const line = before.split('\n').length;
      const lastNewline = before.lastIndexOf('\n');
      const col = match.index - (lastNewline + 1) + 1;
      hits.push({ file, line, col, phrase, reason });
    }
  }
  return hits;
}

/**
 * Scan the repo. Called when the script runs directly.
 */
async function main() {
  const patterns = [
    'src/**/*.{astro,mdx,md,ts,tsx,js,jsx}',
    'src/content/**/*.mdx',
    'src/data/**/*.ts',
    'public/**/*.svg',
  ];
  // Explicitly EXCLUDE the design / plan docs — they legitimately contain the
  // forbidden phrases for reference.
  const ignore = [
    'docs/**',
    'node_modules/**',
    '.astro/**',
    'dist/**',
  ];
  const files = await fg(patterns, { ignore, absolute: false });
  const allHits = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const hits = findViolations(text, relative(process.cwd(), file));
    allHits.push(...hits);
  }
  if (allHits.length > 0) {
    console.error('\nProhibited-text guardrail failed. Occurrences:\n');
    for (const h of allHits) {
      console.error(`  ${h.file}:${h.line}:${h.col}  "${h.phrase}"  — ${h.reason}`);
    }
    console.error('\nEdit the offending files, or update PATTERNS in scripts/check-prohibited-text.mjs.\n');
    process.exit(1);
  }
  console.log(`✓ Checked ${files.length} file(s) for prohibited text; all clean.`);
}

// Run main() only when invoked directly, not when imported by the test.
const invokedDirectly = import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main();
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:
```bash
pnpm test tests/unit/prohibited-text.test.ts
```

Expected: all `it` blocks pass.

- [ ] **Step 5: Run the script directly against the repo — expect clean**

Run:
```bash
node scripts/check-prohibited-text.mjs
```

Expected: `✓ Checked N file(s) for prohibited text; all clean.` If it flags anything, investigate — the design assumes the current tree is clean of these phrases (they don't appear in Cycle 1 content). Fix the source file, then re-run.

- [ ] **Step 6: Wire the script into `package.json`**

Modify `package.json` — add the new script and extend the build chain:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "pnpm check:concepts && pnpm check:prohibited && astro build",
    "preview": "astro preview",
    "check": "astro check",
    "check:concepts": "node scripts/check-concept-refs.mjs",
    "check:prohibited": "node scripts/check-prohibited-text.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 7: Run the full build to verify the guardrail runs inside it**

Run:
```bash
pnpm build
```

Expected: both `check:concepts` and `check:prohibited` print a `✓` line before `astro build` starts; build succeeds.

- [ ] **Step 8: Commit**

```bash
git add scripts/check-prohibited-text.mjs tests/unit/prohibited-text.test.ts package.json
git commit -m "$(cat <<'EOF'
feat(landing): add prohibited-text prebuild guardrail

New scripts/check-prohibited-text.mjs mirrors the check-concept-refs pattern.
Fails the build on any occurrence of vision-spec-rejected phrases ("Great
Change", "traditional work and ways", "THIS (crazy) time") or source typos
(RESILIENCEl, wrong-apostrophe "Childrens' Theatre"). Design/plan docs under
docs/** are excluded — they cite these phrases for reference.

Wired into pnpm build via a new check:prohibited script.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: `Resilience.astro` + `CommunityCenter.astro`

**Files:**
- Create: `src/components/landing/Resilience.astro`
- Create: `src/components/landing/CommunityCenter.astro`

**Interfaces produced:**
- `<Resilience />` — no props; renders `<strong class="font-semibold uppercase tracking-[0.08em]">RESILIENCE</strong>`.
- `<CommunityCenter />` — no props; imports `COMMUNITY_CENTER` from `@/data/landing`.

**Interfaces consumed:**
- `COMMUNITY_CENTER` from `@/data/landing` (Task 1).

- [ ] **Step 1: Create `src/components/landing/Resilience.astro`**

```astro
---
// Renders the source's uppercase RESILIENCE emphasis as a semantic <strong>
// with typographic styling. Used inside the Community center body and
// anywhere else the source text emphasizes the word.
---
<strong class="font-semibold uppercase tracking-[0.08em]">RESILIENCE</strong>
```

- [ ] **Step 2: Create `src/components/landing/CommunityCenter.astro`**

```astro
---
import { COMMUNITY_CENTER } from '@/data/landing';
import Resilience from './Resilience.astro';

// The Community center tile. Placed in the middle cell of LandingGrid.
// Uses the identity headline as the page's h1 (a11y: only h1 on the landing).
// The body contains RESILIENCE as a <strong>, rendered via <Resilience/>.
// Body text is split so we can insert the <Resilience/> component
// exactly where the source has the word.
const bodyBefore = 'We train physical and vocal readiness, how to recognize new contexts, and ways to nurture ';
const bodyAfter = ' that will keep you learning in unexpected and challenging situations.';
---

<article class="bg-clay-500 text-ivory-50 rounded-[var(--radius-card)] p-8 shadow-[var(--shadow-soft)] md:p-10">
  <h1 class="font-display m-0 text-3xl md:text-4xl">
    {COMMUNITY_CENTER.headline}
  </h1>
  <p class="text-clay-50/90 mt-4 text-lg font-medium">
    {COMMUNITY_CENTER.keepExploring}
  </p>
  <p class="text-clay-50/90 mt-2 text-base leading-relaxed">
    {bodyBefore}<Resilience />{bodyAfter}
  </p>
  <div class="text-clay-50/70 mt-6 space-y-2 text-sm leading-relaxed">
    {COMMUNITY_CENTER.extended.map((p) => <p>{p}</p>)}
  </div>
  <p class="mt-6">
    <a href="/community/" class="text-ivory-50 border-ivory-50/40 hover:border-ivory-50 inline-block border-b-2 pb-0.5 font-medium no-underline">
      Enter Community →
    </a>
  </p>
</article>
```

- [ ] **Step 3: Verify with a type-check**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/Resilience.astro src/components/landing/CommunityCenter.astro
git commit -m "$(cat <<'EOF'
feat(landing): add Resilience and CommunityCenter components

<Resilience> renders the source-verbatim RESILIENCE emphasis as a
semantic <strong> with uppercase + weight styling.

<CommunityCenter> renders the center tile: h1 identity line ("Be Fearlessly
Creative!"), "Keep exploring!" opener, canonical body with <Resilience>
inline, and the two secondary "extended" paragraphs.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `BoxContent.astro` — render list / questions / hybrid modes with inline rotation

**Files:**
- Create: `src/components/landing/BoxContent.astro`

**Interfaces produced:**
- `<BoxContent box={box} mode={mode} />` — renders the mode-specific body inside a section tile.
  - `box: Box` (from `@/data/landing`)
  - `mode: BoxMode` (already resolved — either the per-box override or the global default)

**Rotation strategy (must be documented in the file):**
- `hybrid` mode: renders `summary` paragraph followed by a `<ul data-teaser>` of all questions, each `<li>` after the first has `hidden` attribute. Inline script randomly reveals ONE `<li>` on `DOMContentLoaded` and hides the rest. No-JS fallback: all questions visible (still valuable, just verbose).
- `questions` mode: renders all questions as a `<ul>`, no rotation.
- `list` mode: renders `listItems` as a `<ul>`, no `summary`, no questions.
- If `box.questions.length === 0` in hybrid mode, renders only the summary — no `<ul>`, no script.
- Inline script uses one shared IIFE that finds all `[data-teaser]` on the page and rotates each independently. Registered once per page; safe to include in every `BoxContent` invocation because the script has a guard.

- [ ] **Step 1: Create `src/components/landing/BoxContent.astro`**

```astro
---
import type { Box, BoxMode } from '@/data/landing';

interface Props {
  box: Box;
  mode: BoxMode;
}
const { box, mode } = Astro.props;

const showSummary = mode === 'hybrid' || (mode === 'list' && box.listItems.length === 0);
const showList = mode === 'list' && box.listItems.length > 0;
const showAllQuestions = mode === 'questions' && box.questions.length > 0;
const showTeaser = mode === 'hybrid' && box.questions.length > 0;
---

{showSummary && <p class="text-ink-700 mt-2 text-sm leading-relaxed">{box.summary}</p>}

{
  showList && (
    <ul class="text-ink-700 mt-3 space-y-1 text-sm">
      {box.listItems.map((item) => (
        <li>· {item}</li>
      ))}
    </ul>
  )
}

{
  showAllQuestions && (
    <ul class="text-ink-700 mt-3 space-y-2 text-sm">
      {box.questions.map((q) => (
        <li class="italic">{q}</li>
      ))}
    </ul>
  )
}

{
  showTeaser && (
    <ul class="text-clay-700 mt-3 space-y-2 text-sm" data-teaser>
      {box.questions.map((q, i) => (
        <li class="italic" hidden={i > 0}>
          {q}
        </li>
      ))}
    </ul>
  )
}

<script is:inline>
  (function initTeaserRotation() {
    if (window.__dtfcTeaserInit) return;
    window.__dtfcTeaserInit = true;
    const banks = document.querySelectorAll('[data-teaser]');
    banks.forEach((bank) => {
      const items = bank.querySelectorAll('li');
      if (items.length === 0) return;
      const pick = Math.floor(Math.random() * items.length);
      items.forEach((li, i) => {
        if (i === pick) li.removeAttribute('hidden');
        else li.setAttribute('hidden', '');
      });
    });
  })();
</script>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/BoxContent.astro
git commit -m "$(cat <<'EOF'
feat(landing): add BoxContent with list/questions/hybrid modes

Renders per-box body according to the resolved mode. In hybrid mode
(default), the box shows its summary line plus one rotating teaser
question — a single shared inline IIFE picks one <li> per [data-teaser]
group at DOMContentLoaded and hides the rest via the `hidden` attribute.
No-JS fallback: all questions visible.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: `SectionBox.astro` — the tile shell for a section box

**Files:**
- Create: `src/components/landing/SectionBox.astro`

**Interfaces produced:**
- `<SectionBox box={box} mode={mode} />` — a linked `<li>` tile whose body is a `<BoxContent>`.

**Interfaces consumed:**
- `Box`, `BoxMode` from `@/data/landing`
- `<BoxContent>` from Task 4

- [ ] **Step 1: Create `src/components/landing/SectionBox.astro`**

```astro
---
import type { Box, BoxMode } from '@/data/landing';
import BoxContent from './BoxContent.astro';

interface Props {
  box: Box;
  mode: BoxMode;
}
const { box, mode } = Astro.props;
---

<li class="list-none">
  <a
    href={box.href}
    class="border-ivory-200 bg-ivory-50 hover:border-clay-500/60 focus-visible:ring-clay-500 block h-full rounded-[var(--radius-card)] border p-6 no-underline transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    <h2 class="font-display text-ink-900 text-xl">{box.label}</h2>
    <BoxContent box={box} mode={mode} />
  </a>
</li>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/SectionBox.astro
git commit -m "$(cat <<'EOF'
feat(landing): add SectionBox tile shell

Linked <li> tile with h2 heading; delegates body to BoxContent.
Provides border, hover translation, focus-visible ring — no color
literals (uses tokens).

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: `WorkshopsTile.astro` — smaller dashed-border secondary tile

**Files:**
- Create: `src/components/landing/WorkshopsTile.astro`

**Interfaces produced:**
- `<WorkshopsTile />` — no props; imports `WORKSHOPS_BOX` from `@/data/landing`.

- [ ] **Step 1: Create `src/components/landing/WorkshopsTile.astro`**

```astro
---
import { WORKSHOPS_BOX } from '@/data/landing';
---

<aside class="list-none">
  <a
    href={WORKSHOPS_BOX.href}
    class="border-clay-500/40 hover:border-clay-500 bg-ivory-100/60 focus-visible:ring-clay-500 block h-full rounded-[var(--radius-card)] border border-dashed p-6 no-underline transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
  >
    <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 class="font-display text-ink-700 text-xl">{WORKSHOPS_BOX.label}</h2>
      <span class="text-mustard-600 text-[0.625rem] font-semibold tracking-widest uppercase">
        Coming Next Year
      </span>
    </div>
    <p class="text-ink-500 mt-2 text-sm">
      Interested? Sign up for the launch list.
    </p>
  </a>
</aside>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/WorkshopsTile.astro
git commit -m "$(cat <<'EOF'
feat(landing): add WorkshopsTile secondary variant

Dashed-border tile with "Coming Next Year" small-caps label. Links to
/workshops/ for interest capture. Uses <aside> semantics.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: `NewsletterTile.astro` — compact grid-cell newsletter signup

**Files:**
- Create: `src/components/landing/NewsletterTile.astro`

**Interfaces produced:**
- `<NewsletterTile />` — no props. Form submits to the same placeholder handler as the footer `NewsletterSignup`.

**Note on the ESP TODO:** the existing footer `NewsletterSignup` component wires its submit handler to a `TODO(esp)` placeholder that logs to the console. `NewsletterTile` uses the same placeholder — do NOT wire real submission here. The `TODO(esp)` marker is preserved for a later cycle.

- [ ] **Step 1: Create `src/components/landing/NewsletterTile.astro`**

```astro
---
// Compact newsletter tile for the landing grid's spare cell.
// Same submit-handler placeholder as src/components/ui/NewsletterSignup.astro.
// TODO(esp): wire to real provider when the client picks one; see CLAUDE.md.
---

<form
  class="border-teal-600/30 bg-teal-600/5 focus-within:border-teal-600 flex h-full flex-col justify-between rounded-[var(--radius-card)] border p-6"
  data-newsletter="landing-tile"
  onsubmit="event.preventDefault(); console.log('[TODO(esp)] newsletter submit', new FormData(event.target).get('email'));"
>
  <div>
    <h2 class="font-display text-ink-900 text-lg">Stay in touch</h2>
    <p class="text-ink-500 mt-1 text-xs">Monthly DT:FC news, new games, new plays. We won't share your email.</p>
  </div>
  <label class="mt-3 flex flex-col gap-2">
    <span class="sr-only">Email address</span>
    <input
      type="email"
      name="email"
      required
      autocomplete="email"
      placeholder="you@example.com"
      class="border-ink-500/30 focus:border-teal-600 focus:ring-teal-600 rounded border bg-white px-3 py-2 text-sm focus:ring-2 focus:outline-none"
    />
    <button
      type="submit"
      class="bg-teal-600 hover:bg-teal-700 text-ivory-50 focus-visible:ring-teal-600 rounded px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      Notify me
    </button>
  </label>
</form>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/NewsletterTile.astro
git commit -m "$(cat <<'EOF'
feat(landing): add NewsletterTile for the landing grid spare cell

Compact single-input newsletter signup that fits one grid cell. Reuses
the same TODO(esp) placeholder submit handler as the footer signup; do
not wire real submission until the client picks a provider.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: `LandingGrid.astro` — assemble all tiles in the 3×3 desktop grid

**Files:**
- Create: `src/components/landing/LandingGrid.astro`

**Interfaces produced:**
- `<LandingGrid />` — no props; reads `SECTION_TILES`, `LANDING_MODE` from `@/data/landing`, and composes `CommunityCenter`, `SectionBox`, `WorkshopsTile`, `NewsletterTile`.

**Grid geometry (from spec §7):**
Desktop 3×3:
```
[Theatre Games ] [Shakespeare ] [Children's Theatre]
[Legacy        ] [COMMUNITY   ] [Players Resource  ]
[Newsletter    ] [Workshops   ] [ornament          ]
```
- Community occupies the center via CSS `grid-column: 2; grid-row: 2` on desktop.
- Mobile: single column, order via DOM: Community → Theatre Games → Shakespeare → Children's Theatre → Legacy → PRC → Workshops → Newsletter. The ornament cell is skipped in the mobile stack.

- [ ] **Step 1: Create `src/components/landing/LandingGrid.astro`**

```astro
---
import { SECTION_TILES, LANDING_MODE, type BoxMode } from '@/data/landing';
import CommunityCenter from './CommunityCenter.astro';
import SectionBox from './SectionBox.astro';
import WorkshopsTile from './WorkshopsTile.astro';
import NewsletterTile from './NewsletterTile.astro';

// Resolve per-tile mode (per-box override wins over global LANDING_MODE).
const resolveMode = (override?: BoxMode): BoxMode => override ?? LANDING_MODE;

// Grid cell assignments — desktop only. On mobile the grid collapses to
// a single column and the DOM order below determines reading order.
// (See CSS below for the cell-position classes.)
const findTile = (key: string) => {
  const t = SECTION_TILES.find((s) => s.key === key);
  if (!t) throw new Error(`LandingGrid: missing tile ${key}`);
  return t;
};
const theatreGames = findTile('theatre-games');
const shakespeare = findTile('shakespeare');
const childrens = findTile('childrens-theatre');
const legacy = findTile('legacy');
const prc = findTile('resource-center');
---

<section aria-label="Explore DT:FC" class="mx-auto max-w-6xl">
  {/* Desktop 3x3; mobile single-column stack (DOM order = reading order) */}
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-3">
    {/* Row 1 */}
    <div class="md:col-start-1 md:row-start-1">
      <ul class="contents">
        <SectionBox box={theatreGames} mode={resolveMode(theatreGames.mode)} />
      </ul>
    </div>
    <div class="md:col-start-2 md:row-start-1">
      <ul class="contents">
        <SectionBox box={shakespeare} mode={resolveMode(shakespeare.mode)} />
      </ul>
    </div>
    <div class="md:col-start-3 md:row-start-1">
      <ul class="contents">
        <SectionBox box={childrens} mode={resolveMode(childrens.mode)} />
      </ul>
    </div>

    {/* Row 2 — Legacy | COMMUNITY (center) | PRC */}
    <div class="md:col-start-1 md:row-start-2">
      <ul class="contents">
        <SectionBox box={legacy} mode={resolveMode(legacy.mode)} />
      </ul>
    </div>
    <div class="order-first md:order-none md:col-start-2 md:row-start-2">
      <CommunityCenter />
    </div>
    <div class="md:col-start-3 md:row-start-2">
      <ul class="contents">
        <SectionBox box={prc} mode={resolveMode(prc.mode)} />
      </ul>
    </div>

    {/* Row 3 — Newsletter | Workshops | ornament (ornament hidden on mobile) */}
    <div class="md:col-start-2 md:row-start-3">
      <WorkshopsTile />
    </div>
    <div class="md:col-start-1 md:row-start-3">
      <NewsletterTile />
    </div>
    <div
      class="hidden md:col-start-3 md:row-start-3 md:block"
      aria-hidden="true"
    >
      <div class="bg-ivory-100 h-full rounded-[var(--radius-card)] p-6 opacity-70">
        <p class="text-ink-500 font-display text-center text-sm italic">
          Developmental Theatre: Fearless Creativity
        </p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/LandingGrid.astro
git commit -m "$(cat <<'EOF'
feat(landing): assemble LandingGrid with 3x3 desktop + mobile stack

Composes CommunityCenter (center cell), 5 SectionBoxes, WorkshopsTile,
NewsletterTile, and one decorative ornament cell. Desktop: 3x3 CSS grid;
mobile: single column with Community first, followed by nav-order
sections, Workshops, then Newsletter. Ornament cell hidden on mobile.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Rewrite `src/pages/index.astro` to use LandingGrid; remove backward-compat exports

**Files:**
- Modify: `src/pages/index.astro` (full rewrite)
- Modify: `src/data/landing.ts` (remove backward-compat block at bottom)

**Interfaces consumed:**
- `<LandingGrid />` from Task 8.

- [ ] **Step 1: Rewrite `src/pages/index.astro`**

Replace the entire file contents with:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import Container from '@/components/layout/Container.astro';
import LandingGrid from '@/components/landing/LandingGrid.astro';
---

<BaseLayout
  title="Home"
  description="Developmental Theatre: Fearless Creativity — theatre games, Shakespeare scripts, children's plays, Legacy history, and a Players Resource Center. Be Fearlessly Creative!"
>
  <Container class="py-8 md:py-12">
    <LandingGrid />
  </Container>
</BaseLayout>
```

- [ ] **Step 2: Remove backward-compat block from `src/data/landing.ts`**

Delete everything below and including the comment banner:

```
// -----------------------------------------------------------------------------
// BACKWARD-COMPAT ALIASES — used by src/pages/index.astro until Task 9 rewrites it.
// Delete this block in Task 9.
// -----------------------------------------------------------------------------
```

through the end of file (the block that exports `WELCOME_HEADING`, `WELCOME_BODY`, `SectionBox` interface, and `SECTION_BOXES`).

- [ ] **Step 3: Verify type-check has no dangling references**

Run:
```bash
pnpm check
```

Expected: 0 errors. If it flags any file still importing `WELCOME_HEADING` / `WELCOME_BODY` / the old `SECTION_BOXES`, grep for the import and fix (nothing outside `index.astro` should be using them, but confirm).

Run:
```bash
grep -rn "WELCOME_HEADING\|WELCOME_BODY\|from '@/data/landing'" src/ | grep -v "SECTION_TILES\|COMMUNITY_CENTER\|WORKSHOPS_BOX\|REFLECTIVE_BANKS\|LANDING_MODE\|IDEA_TWO_ANSWERS\|Box\b\|BoxMode\|BoxVariant\|BoxSchema\|ReflectiveBank\|pickIndex"
```

Expected: empty output.

- [ ] **Step 4: Run the landing data tests**

Run:
```bash
pnpm test tests/unit/landing.test.ts
```

Expected: all pass (no test referenced the backward-compat exports).

- [ ] **Step 5: Build and preview manually**

Run:
```bash
pnpm build
```

Expected: build succeeds. Then:

```bash
pnpm dev
```

Open `http://localhost:4321/` in a browser. Verify:
- 8 tiles visible on desktop (Community center + 5 sections + Workshops + Newsletter + 1 ornament panel).
- "Be Fearlessly Creative!" is the h1.
- Each section tile shows summary + one rotating question.
- Refreshing changes the rotated question on each tile.
- Shrink to mobile — single column, Community first.

Now verify the mode switch (success criterion #6):

1. Open `src/data/landing.ts` and change `export const LANDING_MODE: BoxMode = 'hybrid';` to `'list'`. Save.
2. Reload the browser. Verify every section tile now shows the Idea One list (no summary, no rotating question).
3. Change it to `'questions'`. Reload. Verify every tile now shows all questions (no summary, no list).
4. Change it back to `'hybrid'`. Save. Verify hybrid renders again.
5. Do NOT commit the temporary mode changes — the file must ship with `'hybrid'`.

Stop the dev server (`Ctrl-C`) before committing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/data/landing.ts
git commit -m "$(cat <<'EOF'
feat(landing): rewrite home page around LandingGrid; drop compat exports

src/pages/index.astro now renders <LandingGrid> — the 3x3 grid with
Community centered, 5 section tiles, Workshops, Newsletter, and one
ornament panel.

Removes the temporary backward-compat exports from src/data/landing.ts
(WELCOME_HEADING, WELCOME_BODY, old SectionBox interface, old
SECTION_BOXES). Nothing else consumes them.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: `ReflectivePrompt.astro` — rotating section-page prompt

**Files:**
- Create: `src/components/section/ReflectivePrompt.astro`

**Interfaces produced:**
- `<ReflectivePrompt sectionKey="theatre-games" />` — renders a small header block with a "Take a moment…" label and one rotating prompt from `REFLECTIVE_BANKS[sectionKey]`. Throws at build if `sectionKey` doesn't match a bank.

**Interfaces consumed:**
- `REFLECTIVE_BANKS`, `NavKey` from `@/data/landing` + `@/lib/nav`.

**Rotation strategy:** identical pattern to `BoxContent` teaser, but with a distinct `data-reflective` marker so the two scripts don't collide.

- [ ] **Step 1: Create `src/components/section/ReflectivePrompt.astro`**

```astro
---
import { REFLECTIVE_BANKS } from '@/data/landing';
import type { NavKey } from '@/lib/nav';

interface Props {
  sectionKey: NavKey;
}
const { sectionKey } = Astro.props;

const bank = REFLECTIVE_BANKS.find((b) => b.sectionKey === sectionKey);
if (!bank) {
  throw new Error(
    `<ReflectivePrompt sectionKey="${sectionKey}"> has no matching bank in REFLECTIVE_BANKS. Add one to src/data/landing.ts.`,
  );
}
---

<aside class="border-teal-600/25 bg-teal-600/5 mt-6 rounded-[var(--radius-card)] border-l-4 p-4 md:p-5">
  <p class="text-teal-600 text-xs font-semibold tracking-widest uppercase">
    Take a moment…
  </p>
  <ul class="mt-2 space-y-2" data-reflective>
    {bank.prompts.map((prompt, i) => (
      <li class="text-ink-700 text-base leading-relaxed italic md:text-lg" hidden={i > 0}>
        {prompt}
      </li>
    ))}
  </ul>
</aside>

<script is:inline>
  (function initReflectiveRotation() {
    if (window.__dtfcReflectiveInit) return;
    window.__dtfcReflectiveInit = true;
    const banks = document.querySelectorAll('[data-reflective]');
    banks.forEach((bank) => {
      const items = bank.querySelectorAll('li');
      if (items.length === 0) return;
      const pick = Math.floor(Math.random() * items.length);
      items.forEach((li, i) => {
        if (i === pick) li.removeAttribute('hidden');
        else li.setAttribute('hidden', '');
      });
    });
  })();
</script>
```

- [ ] **Step 2: Verify type-check passes**

Run:
```bash
pnpm check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/section/ReflectivePrompt.astro
git commit -m "$(cat <<'EOF'
feat(section): add ReflectivePrompt with rotating question banks

<ReflectivePrompt sectionKey="…"> renders a "Take a moment…" callout
seeded from that section's 5-prompt bank in REFLECTIVE_BANKS. Inline
IIFE picks one <li> per [data-reflective] group at DOMContentLoaded and
hides the rest. Falls back to full list without JS. Never gates page
content. Throws at build if sectionKey has no matching bank.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Community page — add ReflectivePrompt + membership teaser paragraph

**Files:**
- Modify: `src/pages/community/index.astro`

**Idea Two answer covered:** #13 "How do I become part of this Legacy?" (routes here from Legacy page in Task 15).

- [ ] **Step 1: Read the current `src/pages/community/index.astro` to know what's there**

Run:
```bash
cat src/pages/community/index.astro
```

Expected: the Cycle 1 stub with a `<SectionLayout>` and placeholder body. Note its current imports.

- [ ] **Step 2: Rewrite `src/pages/community/index.astro`**

Replace the entire file contents with:

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
---

<SectionLayout
  title="Community"
  section="community"
  eyebrow="Be Fearlessly Creative!"
  description="Who we are, how we're organized, and how you can be part of Developmental Theatre: Fearless Creativity."
>
  <ReflectivePrompt sectionKey="community" />

  <div class="max-w-2xl space-y-4 pt-8">
    {/* CLIENT REVIEW: drafted this paragraph for Cycle 2 to resolve Idea Two #13
        ("How do I become part of this Legacy?") from Legacy → Community. Confirm
        wording before launch. */}
    <section id="membership">
      <h2>Become part of this Legacy</h2>
      <p>
        Everyone who explores this site is already part of DT:FC's living community. If you'd like
        to go further — receive our monthly notes, be invited to open sessions, or offer your own
        work as part of the archive — start with the newsletter below. Full membership tiers and a
        direct-sponsorship path are landing in the next content release.
      </p>
    </section>

    <section>
      <h2>What is DT:FC?</h2>
      <p>
        Developmental Theatre: Fearless Creativity is a fiscally sponsored nonprofit that trains
        physical and vocal readiness, teaches how to recognize new contexts, and nurtures the
        resilience players carry into every kind of learning. We do it through Theatre Games,
        Shakespeare, children's plays, and the practitioner tools in the Players Resource Center.
      </p>
    </section>
  </div>
</SectionLayout>
```

- [ ] **Step 3: Verify build passes (guardrail + concept-refs + astro)**

Run:
```bash
pnpm build
```

Expected: builds cleanly.

- [ ] **Step 4: Manually verify the page in dev**

Run:
```bash
pnpm dev
```

Open `http://localhost:4321/community/`. Verify:
- A "Take a moment…" callout with one Community reflective prompt is visible in the header area.
- Refreshing changes the prompt.
- The `#membership` anchor is present (test: `http://localhost:4321/community/#membership` scrolls to the section).

Stop the dev server before committing.

- [ ] **Step 5: Commit**

```bash
git add src/pages/community/index.astro
git commit -m "$(cat <<'EOF'
feat(community): add ReflectivePrompt + membership answer paragraph

Resolves Idea Two question #13 ("How do I become part of this Legacy?")
via a new #membership section that Legacy's answer links to. Drafted
copy flagged CLIENT REVIEW.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 12: Theatre Games page — add ReflectivePrompt + three §6 answer anchors

**Files:**
- Modify: `src/pages/theatre-games/index.astro`

**Idea Two answers covered:**
- #5 "What makes learning playful and empowering?" → `#playful-empowering` (write a short sentence)
- #6 "What's the difference between resignation and resilience?" → `#resignation-resilience` (write a short paragraph inside the existing Cohesion / Resilience block area)
- #7 "What theatre game competency trains Elocution, Memorization, Declamation, Presentation?" → `#vocal-expression` (write a mapping line pointing to Vocal Expression)

**Approach:** wrap the existing "What are Theatre Games?" section with an `id="playful-empowering"` and add one preface sentence; add a new `id="vocal-expression"` mapping line near the five-competencies grid; add a new `id="resignation-resilience"` section after the cohesion rungs. No structural changes to the existing content.

- [ ] **Step 1: Read the current file to know where to inject**

Run:
```bash
cat src/pages/theatre-games/index.astro
```

Expected: Cycle 1's Theatre Games landing (~153 lines).

- [ ] **Step 2: Modify the file**

At the top of the frontmatter (right after existing imports), add:

```astro
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
```

Directly after `<SectionLayout ...>` opens (before the existing `<div class="grid gap-10 lg:grid-cols-3">`), insert:

```astro
<ReflectivePrompt sectionKey="theatre-games" />
```

Wrap the existing "What are Theatre Games?" `<section>` so it has an id — change:
```astro
      <section>
        <h2>What are <Concept id="theatre-games" />?</h2>
```
to:
```astro
      <section id="playful-empowering">
        {/* CLIENT REVIEW: added one-sentence preface to resolve Idea Two #5
            ("What makes learning playful and empowering?") */}
        <p class="text-ink-500 mt-0 text-sm italic">
          Learning becomes playful and empowering when it happens through
          action, not lecture — that's what Theatre Games are for.
        </p>
        <h2 class="mt-3">What are <Concept id="theatre-games" />?</h2>
```

Change the "five competencies" section to have an id and add the mapping line — change:
```astro
      <section>
        <h2>The five competencies</h2>
```
to:
```astro
      <section id="vocal-expression">
        <h2>The five competencies</h2>
        {/* CLIENT REVIEW: added mapping line to resolve Idea Two #7
            ("Which competency trains Elocution, Memorization, Declamation, Presentation?") */}
        <p class="text-ink-500 mt-3 max-w-prose text-sm">
          Elocution, Memorization, Declamation, and Presentation all train under the
          <strong>Vocal Expression</strong> competency below.
        </p>
```

After the existing "Cohesion" section (the one containing the three `cohesionRungs`), insert a new section:

```astro
      <section id="resignation-resilience">
        <h2>Resignation vs. Resilience</h2>
        {/* CLIENT REVIEW: added to resolve Idea Two #6
            ("What's the difference between resignation and resilience?") */}
        <p class="mt-4 max-w-prose">
          Resignation says "there's nothing I can do — the situation has decided for me."
          Resilience says "the situation has changed, and so can I." Theatre Games train the
          second reflex: players rehearse noticing what's shifted, adjusting on the fly, and
          re-entering the moment without freezing. Every game in the Resilience competency
          strengthens that switch.
        </p>
      </section>
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
pnpm build
```

Expected: builds cleanly. Concept-refs check still passes (the `<Concept id="theatre-games" />` is unchanged).

- [ ] **Step 4: Manually verify in dev**

Run:
```bash
pnpm dev
```

Open `http://localhost:4321/theatre-games/`. Verify:
- ReflectivePrompt visible at top.
- Anchors resolve: `/theatre-games/#playful-empowering`, `/theatre-games/#vocal-expression`, `/theatre-games/#resignation-resilience` all scroll to the correct section.
- The Concept popover for "theatre-games" still opens (regression check).

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/theatre-games/index.astro
git commit -m "$(cat <<'EOF'
feat(theatre-games): add ReflectivePrompt + three §6 answer anchors

Resolves Idea Two questions #5, #6, #7 with in-section answers:
- #5 playful/empowering — preface sentence to the definition section
- #6 resignation vs. resilience — new short section after cohesion
- #7 elocution/memorization mapping — annotation on the five-competencies grid

All drafted copy flagged CLIENT REVIEW.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 13: Shakespeare page — add ReflectivePrompt + three §6 answer paragraphs

**Files:**
- Modify: `src/pages/shakespeare/index.astro`

**Idea Two answers covered:**
- #8 "How many of Shakespeare's plays are performed now — 440+ years later?" → `#four-hundred-forty`
- #9 "Who is translating Shakespeare's plays into Chinese?" → `#daniel-yang`
- #10 "Do you have a question to Ask Shakespeare?" → `#ask-shakespeare` (concept intro; form ships in Cycle 3)

- [ ] **Step 1: Read the current file**

Run:
```bash
cat src/pages/shakespeare/index.astro
```

Expected: Cycle 1's Shakespeare stub.

- [ ] **Step 2: Replace `src/pages/shakespeare/index.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
---

<SectionLayout
  title="Shakespeare"
  section="shakespeare"
  eyebrow="Coming soon"
  description="Scenes, monologues, themed montages, and 40-minute cuttings for K through Adult players."
>
  <ReflectivePrompt sectionKey="shakespeare" />

  <div class="max-w-2xl space-y-6 pt-8">
    {/* CLIENT REVIEW: drafted the three answer paragraphs below for Cycle 2. */}
    <section id="four-hundred-forty">
      <h2>440+ years, and still on stage</h2>
      <p>
        Shakespeare left roughly 37 plays; every one of them is still being performed somewhere in
        the world, more than four centuries after they were written. DT:FC's Shakespeare section
        works with that living body of scripts — scenes, monologues, themed montages, and 40-minute
        cuttings — so players of any age can step into the language directly.
      </p>
    </section>

    <section id="daniel-yang">
      <h2>Translating Shakespeare into Chinese</h2>
      <p>
        Daniel S.P. Yang, one of Developmental Theatre's honored guides, has spent decades
        translating Shakespeare's plays into Chinese. His work is one of the reasons DT:FC treats
        Shakespeare not as a museum object but as a script that keeps finding new audiences on new
        continents.
      </p>
    </section>

    <section id="ask-shakespeare">
      <h2>Ask Shakespeare</h2>
      <p>
        Players and audiences send questions to "Shakespeare" — about lines, characters, choices,
        or their own moment of stage fright — and we publish the answers here. Have a question in
        mind? The submission form is opening in the next release; in the meantime, notes about the
        archive live below.
      </p>
    </section>
  </div>
</SectionLayout>
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
pnpm build
```

Expected: builds cleanly.

- [ ] **Step 4: Manually verify**

Run:
```bash
pnpm dev
```

Open `http://localhost:4321/shakespeare/`. Verify ReflectivePrompt visible; three anchors resolve; refresh changes the prompt.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/shakespeare/index.astro
git commit -m "$(cat <<'EOF'
feat(shakespeare): add ReflectivePrompt + three §6 answer paragraphs

Resolves Idea Two #8 (440+ years / ~37 plays), #9 (Daniel S.P. Yang),
and #10 (Ask Shakespeare concept intro; form ships Cycle 3) with in-
section teaser paragraphs. Copy flagged CLIENT REVIEW.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 14: Children's Theatre page — add ReflectivePrompt + two §6 answer paragraphs

**Files:**
- Modify: `src/pages/childrens-theatre/index.astro`

**Idea Two answers covered:**
- #1 "Can imagination provide all sets and props?" → `#imagination`
- #2 "How does putting on a play become fun for every person involved?" → `#every-person`

- [ ] **Step 1: Read the current file**

Run:
```bash
cat src/pages/childrens-theatre/index.astro
```

- [ ] **Step 2: Replace `src/pages/childrens-theatre/index.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
---

<SectionLayout
  title="Children's Theatre"
  section="childrens-theatre"
  eyebrow="Coming soon"
  description="Plays, teaching modules, and storytelling — myth-driven, minimalist, and designed so that every child in the room has a real part to play."
>
  <ReflectivePrompt sectionKey="childrens-theatre" />

  <div class="max-w-2xl space-y-6 pt-8">
    {/* CLIENT REVIEW: drafted the two answer paragraphs below for Cycle 2. */}
    <section id="imagination">
      <h2>Imagination provides everything</h2>
      <p>
        Our plays are written for the bare stage: no built sets, no elaborate props. A cloak
        becomes a castle wall, a chair becomes a throne, a broom becomes a horse. Children step
        into that convention immediately — and once they have, the whole imaginative apparatus of
        the play becomes theirs, not the production designer's.
      </p>
    </section>

    <section id="every-person">
      <h2>A part for every player</h2>
      <p>
        Each script is written with <strong>versatile casting</strong> — every role can be split,
        shared, or doubled so no child sits out. Rehearsal isn't a competition for the leads;
        it's an ensemble that grows every player's confidence at the same time. See the
        Players Resource Center's casting entry for the full principle.
      </p>
    </section>
  </div>
</SectionLayout>
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
pnpm build
```

Expected: builds cleanly.

- [ ] **Step 4: Manually verify in dev, then commit**

Run `pnpm dev` and open `http://localhost:4321/childrens-theatre/`. Verify prompt + anchors. Stop dev.

```bash
git add src/pages/childrens-theatre/index.astro
git commit -m "$(cat <<'EOF'
feat(childrens-theatre): add ReflectivePrompt + two §6 answer paragraphs

Resolves Idea Two #1 (imagination provides sets/props — bare-stage
principle) and #2 (every child has a part — versatile casting). Copy
flagged CLIENT REVIEW.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 15: Legacy page — add ReflectivePrompt + two §6 answer sections

**Files:**
- Modify: `src/pages/legacy/index.astro`

**Idea Two answers covered:**
- #11 "In the 1970s what did the University of Colorado create that led to this website?" → `#colorado-caravan`
- #12 "Who founded Developmental Theatre?" → `#founders`
- Cross-link for #13: "How do I become part of this Legacy?" → link to `/community/#membership` (answer lives on Community page, added in Task 11).

The Cycle 1 stub already has the Colorado Caravan / Founders paragraphs; this task just adds ids, the ReflectivePrompt, and the membership cross-link.

- [ ] **Step 1: Replace `src/pages/legacy/index.astro`**

```astro
---
import SectionLayout from '@/layouts/SectionLayout.astro';
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
---

<SectionLayout
  title="Legacy"
  section="legacy"
  eyebrow="Coming soon"
  description="History, foundational concepts, who — when — why, and next steps."
>
  <ReflectivePrompt sectionKey="legacy" />

  <div class="max-w-2xl space-y-6 pt-8">
    <section id="colorado-caravan">
      <h2>The Colorado Caravan</h2>
      <p>
        DT:FC descends from the <strong>Colorado Caravan</strong>, a touring theatre created in
        the 1970s by the University of Colorado Theatre Department and the Colorado Shakespeare
        Festival under NEA Title III grants. It's the direct answer to the landing-page question:
        what did CU create in the 1970s that led to this site?
      </p>
    </section>

    <section id="founders">
      <h2>The Founders</h2>
      <p>
        Developmental Theatre was founded by Richard Knaub, Chuck Wilcox, Lola Wilcox, and
        Martin Cobin. That work produced an M.A. program in Developmental Theatre/Drama, successor
        companies on three continents, and audiences totaling over six million.
      </p>
    </section>

    <section>
      <h2>Become part of this Legacy</h2>
      {/* CLIENT REVIEW: cross-link resolves Idea Two #13 to the Community
          membership paragraph (see /community/#membership). */}
      <p>
        The Legacy is a working one — anyone who plays, teaches, watches, or supports the work
        adds to it. Start on the <a href="/community/#membership">Community page</a> to learn
        how to join.
      </p>
    </section>

    <section>
      <h2>Full history — coming next</h2>
      <p>
        Founder profiles, essays, and an interactive 1971–present timeline are landing in an
        upcoming release.
      </p>
    </section>
  </div>
</SectionLayout>
```

- [ ] **Step 2: Verify build + dev preview, then commit**

Run `pnpm build`, then `pnpm dev`, open `http://localhost:4321/legacy/`. Verify anchors + the membership link works. Stop dev.

```bash
git add src/pages/legacy/index.astro
git commit -m "$(cat <<'EOF'
feat(legacy): add ReflectivePrompt + §6 answer anchors + Community cross-link

Resolves Idea Two #11 (Colorado Caravan) and #12 (Founders) with named
anchors on the existing paragraphs; cross-links #13 to
/community/#membership.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 16: PRC — write `icons.mdx` concept + update landing page

**Files:**
- Create: `src/content/concepts/icons.mdx`
- Modify: `src/pages/resource-center/index.astro`

**Idea Two answers covered:**
- #3 "Where do I find key vocabulary and concepts?" → PRC landing already answers this via existing content.
- #4 "What are the ICONS and how are they used?" → new callout on landing + new concept entry.

- [ ] **Step 1: Read the current PRC landing to understand structure**

Run:
```bash
cat src/pages/resource-center/index.astro
```

Note: pay attention to how concepts are enumerated. Confirm the file imports from `astro:content` and uses `getCollection('concepts')`. Also read one existing concept file for the frontmatter shape:

Run:
```bash
ls src/content/concepts/ && cat src/content/concepts/cohesion.mdx 2>/dev/null | head -20 || cat src/content/concepts/*.mdx | head -20
```

- [ ] **Step 2: Create `src/content/concepts/icons.mdx`**

Frontmatter must match the existing concept schema (see `src/content.config.ts`): `name`, `slug`, `shortDefinition` (max 240), `icon` (default `placeholder`), `related` (default `[]`).

```mdx
---
name: ICONs
slug: icons
shortDefinition: The visual symbols used across DT:FC to name the small essential concepts of the work — a picture, a name, and a definition together.
icon: placeholder
related: []
---

## What an ICON is

An **ICON** is one of the small visual symbols used across the DT:FC site to
mark a concept that matters. Each ICON pairs a picture, a name, and a short
definition — a landing spot for a term the work relies on.

## How ICONs are used

Wherever an ICON name appears in the copy — for example, <Concept id="cohesion" /> or
<Concept id="resilience" /> — you can click the icon (or press Enter with the
keyboard) to see the short definition without leaving the page. A "Read more →"
link inside the popover takes you here, to the Players Resource Center, for
the full explanation.

## Why ICONs exist

Developmental Theatre uses a specific vocabulary — words like *cohesion*,
*resilience*, *warmup*, *facilitation* — that don't always mean what a
newcomer expects. Rather than defining them once and hoping readers remember,
ICONs let a definition travel with the term: every time you see one, the
definition is a click away.

## Where you'll see them

- On every game page, marking the game's competency, cohesion, and other
  properties.
- In the Theatre Games landing copy, wherever a term is introduced.
- On section landing pages when a key concept is named.
- In the alphabetical concept list on this page.
```

- [ ] **Step 3: Modify `src/pages/resource-center/index.astro` — add ReflectivePrompt + a landing-page callout for the ICONs question**

Read the current file to know its structure, then add:

- Import at the top: `import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';`
- Insert `<ReflectivePrompt sectionKey="resource-center" />` at the top of the page body (before the existing content).
- Add a callout section with id `icons` that answers "What are the ICONS?" — a short paragraph plus a link to the `/resource-center/icons/` detail page.

Example diff (adapt to the existing file structure):

```astro
---
// existing imports…
import ReflectivePrompt from '@/components/section/ReflectivePrompt.astro';
---

<SectionLayout ...>
  <ReflectivePrompt sectionKey="resource-center" />

  <section id="icons" class="border-teal-600/20 bg-teal-600/5 mt-6 rounded-[var(--radius-card)] border p-5">
    {/* CLIENT REVIEW: landing-page callout answering Idea Two #4
        ("What are the ICONS and how are they used?") */}
    <h2 class="font-display text-xl">What are the ICONS?</h2>
    <p class="text-ink-700 mt-2 max-w-prose text-sm">
      The small visual symbols throughout the site — pictures paired with a name and a short
      definition — are called <strong>ICONs</strong>. Click any one to see its definition without
      leaving the page. <a href="/resource-center/icons/">Read the full ICONs entry →</a>
    </p>
  </section>

  {/* … existing PRC content … */}
</SectionLayout>
```

- [ ] **Step 4: Verify build (concept-refs check must resolve the new `icons` slug)**

Run:
```bash
pnpm build
```

Expected: builds cleanly. `check:concepts` must recognize the new `icons` slug (from the frontmatter) and the `<Concept id="cohesion" />` / `<Concept id="resilience" />` references inside `icons.mdx` must resolve.

- [ ] **Step 5: Manually verify in dev**

Run `pnpm dev`. Visit:
- `http://localhost:4321/resource-center/` — ReflectivePrompt visible, "What are the ICONS?" callout visible with working link.
- `http://localhost:4321/resource-center/icons/` — concept detail page renders the new MDX.
- `http://localhost:4321/resource-center/#icons` — anchor scrolls to the callout.

Stop dev.

- [ ] **Step 6: Commit**

```bash
git add src/content/concepts/icons.mdx src/pages/resource-center/index.astro
git commit -m "$(cat <<'EOF'
feat(prc): add ICONs concept entry + landing callout + ReflectivePrompt

Writes the ICONs explainer concept (flagged as a content gap in the
vision spec §6) and adds a small callout on the PRC landing that answers
"What are the ICONS?" with a link to the full entry. Also seeds the
Players Resource Center reflective bank into the page header.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 17: Era-bound-copy audit sweep

**Files:**
- Modify: any file that surfaces era-bound framing (report inline; commit any fixes).

- [ ] **Step 1: Run the audit grep**

Run:
```bash
grep -rniE "\b(crisis|unprecedented|these times|pandemic|AI age|current moment|our era)\b" src/pages src/content src/data 2>/dev/null | grep -v node_modules
```

Expected: enumerate findings. Note that the Shakespeare reflective bank contains the phrase "current moment in history" — this is a VERBATIM vision-spec reflective prompt, so it stays. Any other hit needs review.

- [ ] **Step 2: For each finding, decide: keep, rewrite, or defer**

- Verbatim vision-spec text stays (e.g. reflective prompts in `landing.ts`).
- Client-authored existing copy that reads era-bound → open the file, rewrite the offending phrase into timeless language, add a `{/* CLIENT REVIEW: era-bound copy softened per vision spec §3.2 */}` comment.
- Anything ambiguous → defer with a follow-up entry (see Task 19).

- [ ] **Step 3: If any files were modified, run the guardrail and build**

```bash
pnpm build
```

Expected: clean.

- [ ] **Step 4: Commit only if files changed**

```bash
git add [modified files]
git commit -m "$(cat <<'EOF'
chore(copy): soften era-bound framing per vision spec §3.2

Sweeps landing / section-page copy for era-bound phrasing. Verbatim
vision-spec text (reflective prompts) is intentionally preserved.
Other hits rewritten into timeless language; flagged CLIENT REVIEW.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

If no files needed changes, skip the commit and note that in the follow-up log (Task 19).

---

## Task 18: Extend Playwright smoke test for landing identity + section reflective prompt

**Files:**
- Modify: `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Read the current smoke test**

Run:
```bash
cat tests/e2e/smoke.spec.ts
```

- [ ] **Step 2: Add new assertions to the existing test at the top (landing) and add one for the Legacy section**

Replace the first `// Landing page` block with:

```typescript
  // Landing page — identity + grid + rotating teaser + no prohibited text
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Be Fearlessly Creative!' })).toBeVisible();
  await expect(page.getByText("nurture", { exact: false })).toBeVisible();
  const grid = page.getByRole('region', { name: 'Explore DT:FC' });
  await expect(grid).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Theatre Games' }).first()).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Players Resource Center' }).first()).toBeVisible();
  await expect(grid.getByRole('link', { name: 'Workshops' }).first()).toBeVisible();
  // A rotating teaser question is visible on at least one tile (one <li> revealed per bank).
  const visibleTeasers = grid.locator('[data-teaser] li:not([hidden])');
  await expect(visibleTeasers.first()).toBeVisible();
```

Then, after the existing Theatre Games / concept popover checks, add:

```typescript
  // Section reflective prompt — Legacy
  await page.goto('/legacy/');
  const reflective = page.locator('[data-reflective]');
  await expect(reflective).toBeVisible();
  const visiblePrompts = reflective.locator('li:not([hidden])');
  await expect(visiblePrompts).toHaveCount(1);
```

- [ ] **Step 3: Run the smoke test**

Run:
```bash
pnpm test:e2e
```

Expected: full smoke test passes. If the "grid renders" assertion fails, ensure `LandingGrid` renders `aria-label="Explore DT:FC"`.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/smoke.spec.ts
git commit -m "$(cat <<'EOF'
test(e2e): extend smoke test for landing identity + reflective prompt

Adds assertions for the Cycle 2 landing rebuild: canonical
"Be Fearlessly Creative!" h1, the Explore DT:FC grid region with
Theatre Games / PRC / Workshops links, at least one visible rotating
teaser, and the Legacy page's reflective prompt collapsing to exactly
one visible <li>.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Task 19: Update memory + CLAUDE.md, log follow-ups

**Files:**
- Modify: `CLAUDE.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/MEMORY.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md`
- Modify: `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`

- [ ] **Step 1: Update `CLAUDE.md`**

Under **Stack**, ensure the new landing data model is mentioned. Under **Key conventions**, add a paragraph:

```markdown
**Landing page data.** All landing-page copy — Community center text, section
tiles, reflective banks, and the Idea Two answer map — lives in
`src/data/landing.ts`, Zod-validated at import. The single line
`export const LANDING_MODE: BoxMode = 'hybrid'` toggles every section tile's
render mode (`list` | `questions` | `hybrid`). Per-box overrides go on the
tile's `mode` field.
```

Under **Commands**, add:

```markdown
- `pnpm check:prohibited` — runs the prohibited-text guardrail (fails build on any occurrence of the vision-spec-rejected phrases; runs automatically in `pnpm build`)
```

Under repo structure or Key conventions, mention:

```markdown
Landing components live under `src/components/landing/`; the shared reflective
prompt component lives under `src/components/section/`.
```

Under **Deferred / TODO markers**, add:

```markdown
- `TODO(esp)` in `src/components/landing/NewsletterTile.astro` — inherits the same ESP integration TODO as the footer signup.
```

- [ ] **Step 2: Update the cycle memory**

Rewrite `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_cycles.md` to reflect the re-sequencing:

```markdown
---
name: project-dtfc-cycles
description: Multi-cycle roll-out plan for the DT:FC website; landing page graduated to Cycle 2, Shakespeare shifted to Cycle 3.
metadata:
  type: project
---

Cycle 1 shipped 2026-08-10 (site skeleton, Theatre Games flagship, ICON system, Players Resource Center, stubs for the other sections).

Cycle 2 shipped 2026-08-10 (landing page rebuild per vision-fidelity spec: 3×3 grid with Community centered, data-driven box modes, rotating reflective prompts on all six section pages, prohibited-text guardrail).

**Why:** the vision-fidelity spec at `/Users/cnote/Downloads/dtfc-landing-page-vision-spec.md` re-scoped the landing page as an identity-critical deliverable — worth ahead-of-schedule to lock the site's promise before deeper section builds.

**How to apply:** the remaining cycles are re-sequenced:
- Cycle 3 — Shakespeare (Ask Shakespeare archive, side-by-side Colloquial, Pidgin audio)
- Cycle 4 — Children's Theatre (script pages, print emphasis, Wayfarer's Journey SVG)
- Cycle 5 — Legacy (founders, essays, interactive Timeline)
- Cycle 6 — Community + forms + newsletter ESP wiring
- Cycle 7 — Cross-site search (Pagefind) + analytics + launch checklist
- Cycle N — Web 2.0 items (deferred per source spec §5)

See `docs/superpowers/specs/2026-08-10-dtfc-cycle2-landing-design.md` for the Cycle 2 design.
```

- [ ] **Step 3: Append to the follow-ups memory**

Edit `/Users/cnote/.claude/projects/-Users-cnote-projects-dtfc/memory/project_dtfc_followups.md`. Add:

```markdown
**Cycle 2 (2026-08-10) added follow-ups:**
- Naming decision still open: "Children's Theatre" vs "Children's Plays". Currently using "Children's Theatre" everywhere; awaiting client confirmation.
- Newsletter tile in landing grid uses TODO(esp) placeholder — same wiring as footer signup.
- Section landing copy for Community / Shakespeare / Children's Theatre / Legacy / PRC includes CLIENT REVIEW markers on drafted paragraphs — bundle for Lola/Laurie review.
- Vision-spec §12 open questions #1, #4, #5 to send client after preview URL is ready (draft language in cycle-2 design spec §12).
```

- [ ] **Step 4: Update `MEMORY.md` index if any new memory files were created (none in this cycle)**

No new memory files this cycle. `MEMORY.md` unchanged.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "$(cat <<'EOF'
docs: update CLAUDE.md for Cycle 2 landing data model + guardrail

Documents the src/data/landing.ts data model, the LANDING_MODE switch,
the new prohibited-text prebuild guardrail, the new landing/ and section/
component directories, and the NewsletterTile ESP TODO.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Memory files live outside the git repo; commit is CLAUDE.md only.

---

## Final Verification (not a separate commit — the executing session runs these)

After Task 19, before offering to merge to `main`, run:

- `pnpm check` — 0 errors.
- `pnpm build` — succeeds; `check:concepts` and `check:prohibited` both print `✓`.
- `pnpm test` — all Vitest suites green.
- `pnpm test:e2e` — Playwright smoke test green.
- Manual pass in `pnpm dev` at 375×667 (mobile) and 1440×900 (desktop): landing page, then each of the 6 section pages.

When all clean, offer the user the merge command:
```bash
git checkout main && git merge --no-ff cycle-2-landing -m "Merge cycle-2-landing (landing page + section seeding per vision-fidelity spec)"
```

---
