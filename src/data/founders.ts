import { z } from 'astro/zod';

/**
 * `category` drives page-layout grouping on /legacy/founders/:
 *   founder         — the four institutional founders (Knaub, Chuck, Lola, Cobin)
 *   origin-witness  — first-person testimony (Cherie, Laurie) rendered via TestimonyPullQuote
 *   faculty         — contributing CU faculty (Yang, Petersen)
 *   contributor     — critical early contributors (Melinda Scott, Marta Barnard, Judith Bock)
 *
 * `role` is free-form job-title prose for the FounderCard display line
 * (e.g., "Co-founder, Colorado Caravan"). Distinct from `category`.
 */
const FounderSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
  category: z.enum(['founder', 'origin-witness', 'faculty', 'contributor']).default('founder'),
  years: z.string().optional(),
  photoSrc: z.string().optional(),
  shortBio: z.string(),
  unconfirmed: z.boolean().default(false),
  sample: z.boolean().default(false),
});
export type Founder = z.infer<typeof FounderSchema>;

export const FOUNDERS: Founder[] = [
  {
    slug: 'richard-knaub',
    name: 'Richard Knaub',
    role: 'Co-founder, Colorado Caravan',
    category: 'founder',
    shortBio:
      'One of the four founding faculty at the University of Colorado who shaped the Colorado Caravan under NEA Title III grants in the 1970s. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'chuck-wilcox',
    name: 'Chuck Wilcox',
    role: 'Co-founder, playwright, and pedagogue',
    category: 'founder',
    shortBio:
      'Wrote the Colorado Caravan&rsquo;s founding manifesto and many of the children&rsquo;s plays still in the DT:FC library. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'lola-wilcox',
    name: 'Lola Wilcox',
    role: 'Co-founder, director, and educator',
    category: 'founder',
    shortBio:
      'Lola shaped the Caravan&rsquo;s repertoire and led generations of teachers into the discipline. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'martin-cobin',
    name: 'Martin Cobin',
    role: 'Co-founder, scholar of Developmental Drama',
    category: 'founder',
    shortBio:
      'Authored the field&rsquo;s foundational articulation of Developmental Drama. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'cherie-karo-schwartz',
    name: 'Cherie Karo Schwartz',
    role: 'Storyteller, editor, Theatre Games compiler',
    category: 'origin-witness',
    years: '1976–7 troupe',
    shortBio:
      'Troupe member whose later compilation of the games and warm-ups from the Caravan floor became the base for the Theatre Games section of this site.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'laurie-obrien',
    name: 'Laurie O’Brien',
    role: 'Facilitator, Workshop Manual author',
    category: 'origin-witness',
    shortBio:
      'Facilitator whose workshops-after-performances discipline is being written down as the Workshop Manual, published in both Legacy and Theatre Games when the text is ready.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'daniel-sp-yang',
    name: 'Daniel S.P. Yang',
    role: 'Contributing faculty; Shakespeare translator (Chinese)',
    category: 'faculty',
    shortBio:
      'CU faculty and translator whose decades of work opened Shakespeare to Chinese audiences and shaped DT:FC&rsquo;s Shakespeare pedagogy. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'nils-petersen',
    name: 'Nils Petersen',
    role: 'Contributing faculty',
    category: 'faculty',
    shortBio:
      'CU faculty whose contributions helped shape the Caravan&rsquo;s early work. Placeholder bio &mdash; real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'melinda-scott',
    name: 'Melinda Scott',
    role: 'CSF Education Director',
    category: 'contributor',
    years: '2001–2010',
    shortBio:
      'Oversaw Shakespeare in the Schools, Shakespeare in the Community, and Shakespeare in the Summer at the Colorado Shakespeare Festival, and helped shape the Will Power outreach programme that Chuck Wilcox toured as Will Shakespeare.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'marta-barnard',
    name: 'Marta Barnard',
    role: 'Caravan tour actor, Overland Stage Company',
    category: 'contributor',
    shortBio:
      'Ten years of Caravan tours and residencies; a founding force in the Overland Stage Company; contributed extensively to this website&rsquo;s development.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'judith-bock',
    name: 'Judith Bock',
    role: 'Contributor',
    category: 'contributor',
    shortBio:
      'Contribution pending client confirmation per source spec §4.5 item 4.',
    unconfirmed: true,
    sample: true,
  },
];

// Build-time verification: schema + slug uniqueness.
(function verifyAtImport() {
  for (const f of FOUNDERS) FounderSchema.parse(f);
  const slugs = FOUNDERS.map((f) => f.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('FOUNDERS slugs must be unique');
  }
})();
