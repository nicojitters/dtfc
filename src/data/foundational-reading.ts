import { z } from 'astro/zod';

const FoundationalWorkSchema = z.object({
  author: z.string().min(1),
  title: z.string().min(1).optional(),
  year: z.number().int().min(1900).max(2030).optional(),
  note: z.string().max(200).optional(),
});
export type FoundationalWork = z.infer<typeof FoundationalWorkSchema>;

/**
 * Six-work bibliography per vision spec §3 Doc #3 ("Reading Materials").
 * Author surnames are the spec-required set — Durland, McCaslin, Siks,
 * Spolin, Tyas, Way — pulled from Doc #3's Founders / Legacy reading list.
 *
 * CLIENT REVIEW: titles and years reflect each author's canonical work in
 * the drama-in-education / creative dramatics tradition. Awaits client
 * confirmation of the specific editions the DT:FC founders taught from
 * (Doc #3 lists surnames only). Tyas title/year deferred pending source.
 *
 * Sorted alphabetically by surname for predictable render + testability.
 */
export const FOUNDATIONAL_READING: FoundationalWork[] = [
  {
    author: 'Durland, Frances Caldwell',
    title: 'Creative Dramatics for Children',
    year: 1952,
  },
  {
    author: 'McCaslin, Nellie',
    title: 'Creative Drama in the Classroom',
    year: 1968,
  },
  {
    author: 'Siks, Geraldine Brain',
    title: 'Creative Dramatics: An Art for Children',
    year: 1958,
  },
  {
    author: 'Spolin, Viola',
    title: 'Improvisation for the Theater',
    year: 1963,
  },
  {
    author: 'Tyas, Billy',
    note: 'Title and year pending client confirmation.',
  },
  {
    author: 'Way, Brian',
    title: 'Development through Drama',
    year: 1967,
  },
];
