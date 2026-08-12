import { z } from 'astro/zod';

const columnSchema = z.object({
  key: z.string(),
  label: z.string(),
  subtitle: z.string().optional(),
});

const rowSchema = z.object({
  label: z.string(),
  values: z.array(z.string()).length(5),
});

const chartSchema = z.object({
  columns: z.array(columnSchema).length(5),
  rows: z.array(rowSchema).length(11),
});

export type InfluencesColumn = z.infer<typeof columnSchema>;
export type InfluencesRow = z.infer<typeof rowSchema>;
export type InfluencesChartData = z.infer<typeof chartSchema>;

/**
 * The 11-row × 5-tradition comparison chart from Lola Wilcox’s
 * "Theatre Influences during the Invention of the Colorado Caravan"
 * essay (vision spec §3 Doc #4). Extracted from the pipe-table in
 * theatre-influences.mdx during Cycle 9 T9 so it can render responsively
 * (sticky first-column labels + horizontal scroll on narrow viewports)
 * and be reused on the /legacy/ landing (T8) without duplicating markup.
 *
 * Cell text preserved verbatim from the source MDX. Empty cells (Stage
 * Access × Theatre Games) are preserved as empty strings — do not fill.
 */
export const INFLUENCES_CHART: InfluencesChartData = chartSchema.parse({
  columns: [
    { key: 'asian', label: 'Asian', subtitle: 'U of Colo.' },
    { key: 'shakespeare', label: 'Shakespeare', subtitle: 'CSF/Globe' },
    { key: 'poor', label: 'Poor Theatre', subtitle: 'Children’s' },
    { key: 'games', label: 'Theatre Games' },
    { key: 'dtfc', label: 'DT:FC' },
  ],
  rows: [
    {
      label: 'Audience',
      values: [
        'Aesthetic distance between performers and audience',
        'Raised stage then groundlings, then balconies',
        'Bare stage',
        'Group of Players',
        'Audience',
      ],
    },
    {
      label: 'Audience Participation',
      values: [
        'Vocal commentary',
        'Vocal commentary',
        'Physical, vocal “roles” possible',
        'Actors/observers',
        'Audience',
      ],
    },
    {
      label: 'Stage',
      values: [
        'Bare — location suggested by dialogue or facial expressions',
        'Bare — location suggested by dialogue or facial expressions',
        'Bare — location suggested by dialogue or facial expressions',
        'Bare — location suggested by dialogue or facial expressions',
        'Bare — location suggested by dialogue or facial expressions',
      ],
    },
    {
      label: 'Stage Access',
      values: [
        'Hanamichi (runway), significant entry/exit aisles, processions, dance',
        'Significant entry/exit aisles, processions, dance',
        'Hanamichi (runway), significant entry/exit, processions, dance',
        '',
        'Significant entry/exit aisles, processions, dance',
      ],
    },
    {
      label: 'Movement',
      values: [
        'Highly stylized — mime, dance, clowning, acrobatics',
        'Highly stylized — mime, dance, clowning, acrobatics',
        'Highly stylized — mime, dance, clowning, acrobatics',
        'Highly stylized',
        'Physical Expression, Context Awareness',
      ],
    },
    {
      label: 'Props',
      values: [
        'None to ingenious use of minimal props',
        'None to ingenious use of minimal props',
        'None to ingenious use of minimal props',
        'None to ingenious use of minimal props',
        'None to ingenious use of minimal props',
      ],
    },
    {
      label: 'Speech',
      values: [
        'Dialogue, soliloquies, recitatives',
        'Dialogue, soliloquies, recitatives',
        'Dialogue, soliloquies, recitatives',
        'Vocal expression',
        'Vocal expression',
      ],
    },
    {
      label: 'Music',
      values: [
        'Instrumental, singing, 3 drums and a flute',
        'Instrumental, singing, 3 drums and a flute',
        'Instrumental, singing, 3 drums and a flute',
        'Drum, rhythm',
        'Singing, drums, other instruments',
      ],
    },
    {
      label: 'Themes',
      values: [
        'Love, friendship, family, ruling, societal issues',
        'Love, friendship, family, ruling, societal issues',
        'Love, friendship, family, ruling, societal issues',
        'Love, friendship, family, ruling, societal issues',
        'Archetypes — Themes',
      ],
    },
    {
      label: 'Plots',
      values: [
        'Classical situations with character development',
        'Classical situations with character development',
        'Classical situations with character development and traditional storytelling',
        'Classical situations, focus on developing skills',
        'Archetypes — Plots',
      ],
    },
    {
      label: 'Role Types / Characters',
      values: [
        'Often masked, traditional, principal characters, archetypes',
        'Traditional stories, archetypal characters and character development',
        'Traditional stories, archetype characters and character development',
        'Traditional stories, archetype characters and character development',
        'Archetypes: Roles/Characters and Character Development',
      ],
    },
  ],
});
