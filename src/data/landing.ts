import type { NavKey } from '@/lib/nav';

export interface SectionBox {
  key: NavKey;
  label: string;
  href: string;
  summary: string;
  /** Teaser question from source spec §4.1 "Idea Two" — stored for later cycles. */
  teasers: string[];
  comingSoon?: boolean;
}

export const WELCOME_HEADING = 'COMMUNITY — Be Fearlessly Creative!';

export const WELCOME_BODY = [
  'Keep exploring! We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE that will keep you learning in unexpected and challenging situations.',
  'We provide fast access to entertaining Developmental Theatre techniques and tools for expected or challenging situations.',
];

export const SECTION_BOXES: SectionBox[] = [
  {
    key: 'community',
    label: 'Community',
    href: '/community/',
    summary: "Who we are, how we're organized, newsletters, and companion theatres.",
    teasers: ['What is a "fearlessly creative" community?', 'How can I join?'],
  },
  {
    key: 'theatre-games',
    label: 'Theatre Games',
    href: '/theatre-games/',
    summary: 'Hundreds of games organized by five competencies, searchable and ready to play.',
    teasers: ['What is a Theatre Game?', 'How do I pick the right one for my group?'],
  },
  {
    key: 'shakespeare',
    label: 'Shakespeare',
    href: '/shakespeare/',
    summary: 'Scenes, monologues, themed montages, and 40-minute cuttings for K through adult.',
    teasers: [
      "How many of Shakespeare's plays are performed now — 440+ years later?",
      "Why leave the language as Shakespeare's own?",
    ],
  },
  {
    key: 'childrens-theatre',
    label: "Children's Theatre",
    href: '/childrens-theatre/',
    summary: 'Plays, teaching modules, and storytelling — myth-driven and minimalist.',
    teasers: [
      'Why do 600 kids sit still for these plays?',
      'How can children write a play together?',
    ],
  },
  {
    key: 'legacy',
    label: 'Legacy',
    href: '/legacy/',
    summary:
      'The Colorado Caravan story, founders, essays, and the Developmental Theatre timeline.',
    teasers: ['In the 1970s what did the University of Colorado create that led to this website?'],
  },
  {
    key: 'resource-center',
    label: 'Players Resource Center',
    href: '/resource-center/',
    summary: 'Tools, vocabulary, key concepts, and definitions — the site-wide glossary.',
    teasers: ['What are the ICONS and how are they used?'],
  },
];

export const WORKSHOPS_BOX: SectionBox = {
  key: 'workshops',
  label: 'Workshops',
  href: '/workshops/',
  summary: 'In-person and online training — coming next year.',
  teasers: [],
  comingSoon: true,
};
