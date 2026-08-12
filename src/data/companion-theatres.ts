import { z } from 'astro/zod';

const CompanionTheatreSchema = z.object({
  slug: z.string(),
  name: z.string(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  website: z.string().url().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  blurb: z.string().max(300),
  sample: z.boolean().default(false),
  unconfirmed: z.boolean().default(false),
});
export type CompanionTheatre = z.infer<typeof CompanionTheatreSchema>;

export const COMPANION_THEATRES: CompanionTheatre[] = [
  {
    slug: 'we-tell-stories',
    name: 'We Tell Stories',
    city: 'California',
    state: 'CA',
    website: 'https://wetellstories.org',
    blurb:
      'We Tell Stories is the fiscal sponsor of DT:FC. Closely aligned in purpose, they make it possible for DT:FC to operate and grow as a nonprofit arts organization.',
    sample: false,
    unconfirmed: false,
  },
  {
    slug: 'vanaver-caravan',
    name: 'Vanaver Caravan',
    city: 'Rosendale',
    state: 'NY',
    website: 'https://vanavercaravan.org',
    blurb:
      'Founded in 1972 by Bill and Livia Drapkin Vanaver, The Vanaver Caravan brings world dance and music to stages and classrooms across the globe, spanning continents, cultures, and generations.',
    sample: false,
    unconfirmed: false,
  },
  {
    slug: 'university-of-hawaii-hilo-drama',
    name: 'University of Hawaii at Hilo — Drama',
    city: 'Hilo',
    state: 'HI',
    website: 'http://www.uhh.hawaii.edu/academics/perfarts/',
    contactName: 'Jacquelyn P. Johnson',
    contactEmail: 'jpjohnso@hawaii.edu',
    blurb:
      'The UH Hilo Performing Arts program, led by Professor Jackie Johnson, shares a commitment to developmental and community-centered approaches to theatre.',
    sample: false,
    unconfirmed: false,
  },
  {
    slug: 'international-playback-theatre-network',
    name: 'International Playback Theatre Network',
    website: 'http://www.playbacknet.org/iptn/aboutplayback.htm',
    blurb:
      'Playback Theatre, rooted in the work of Jacob Moreno and Jonathan Fox, invites audience members to share personal stories that performers immediately play back. A worldwide network of imagination-centered theatre.',
    sample: false,
    unconfirmed: false,
  },
  {
    slug: 'center-for-playback-theatre',
    name: 'Center for Playback Theatre',
    website: 'http://playbackschool.org/',
    blurb:
      'The Center for Playback Theatre offers training and resources for practitioners of Playback Theatre worldwide.',
    sample: false,
    unconfirmed: false,
  },
];

// Build-time verification: schema + slug uniqueness.
(function verifyAtImport() {
  for (const t of COMPANION_THEATRES) CompanionTheatreSchema.parse(t);
  const slugs = COMPANION_THEATRES.map((t) => t.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('COMPANION_THEATRES slugs must be unique');
  }
})();
