import { z } from 'astro/zod';

const FounderSchema = z.object({
  slug: z.string(),
  name: z.string(),
  role: z.string(),
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
    shortBio:
      'One of the four founding faculty at the University of Colorado who shaped the Colorado Caravan under NEA Title III grants in the 1970s. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'chuck-wilcox',
    name: 'Chuck Wilcox',
    role: 'Co-founder, playwright, and pedagogue',
    shortBio:
      'Wrote the Colorado Caravan’s founding manifesto and many of the children’s plays still in the DT:FC library. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'lola-wilcox',
    name: 'Lola Wilcox',
    role: 'Co-founder, director, and educator',
    shortBio:
      'Lola shaped the Caravan’s repertoire and led generations of teachers into the discipline. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'martin-cobin',
    name: 'Martin Cobin',
    role: 'Co-founder, scholar of Developmental Drama',
    shortBio:
      'Authored the field’s foundational articulation of Developmental Drama. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'laurie-obrien',
    name: 'Laurie O’Brien',
    role: 'Facilitator, Workshop Manual author',
    shortBio:
      'Carries the facilitation practice forward through workshops and the Workshop Manual. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'cherie-karo-schwartz',
    name: 'Cherie Karo Schwartz',
    role: 'Storyteller, editor, contributor',
    shortBio:
      'Storyteller and editor whose work shaped DT:FC’s children’s repertoire. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'judith-bock',
    name: 'Judith Bock',
    role: 'Contributor',
    shortBio:
      'Contribution pending client confirmation per source spec §4.5 item 4.',
    unconfirmed: true,
    sample: true,
  },
  {
    slug: 'daniel-sp-yang',
    name: 'Daniel S.P. Yang',
    role: 'Contributing faculty; Shakespeare translator (Chinese)',
    shortBio:
      'CU faculty and translator whose decades of work opened Shakespeare to Chinese audiences and shaped DT:FC’s Shakespeare pedagogy. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
    sample: true,
  },
  {
    slug: 'nils-petersen',
    name: 'Nils Petersen',
    role: 'Contributing faculty',
    shortBio:
      'CU faculty whose contributions helped shape the Caravan’s early work. Placeholder bio — real content arrives with the Drive import.',
    unconfirmed: false,
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
