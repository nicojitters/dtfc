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
export const WELCOME_BODY: readonly string[] = [COMMUNITY_CENTER.body, ...COMMUNITY_CENTER.extended];

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
