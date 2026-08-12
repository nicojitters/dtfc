import { z } from 'astro/zod';

const TestimonialSchema = z.object({
  slug: z.string(),
  attribution: z.string(),
  role: z.string().optional(),
  location: z.string().optional(),
  body: z.string().max(600),
  sample: z.boolean().default(false),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

/**
 * Testimonials collection ships EMPTY at Cycle 6 launch. New testimonials
 * arrive via dev commits (approve → append here) until a CMS-style
 * backend is decided in a future cycle. Client-provided testimonials
 * from Drive would be inserted here as a manual seed.
 *
 * When TESTIMONIALS.length === 0, /community/testimonials/ renders an
 * empty-state message above the share-your-story form.
 */
export const TESTIMONIALS: Testimonial[] = [];

// Build-time verification: schema + slug uniqueness (both are no-ops on
// an empty array but activate the moment entries are added).
(function verifyAtImport() {
  for (const t of TESTIMONIALS) TestimonialSchema.parse(t);
  const slugs = TESTIMONIALS.map((t) => t.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error('TESTIMONIALS slugs must be unique');
  }
})();
