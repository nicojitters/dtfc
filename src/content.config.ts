import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COMPETENCIES, COHESIONS, STRUCTURES } from '@/lib/types';

const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: z.object({
    name: z.string(),
    competency: z.enum(COMPETENCIES),
    subset: z.string().optional(),
    structure: z.enum(STRUCTURES),
    cohesion: z.enum(COHESIONS),
    intent: z.string(),
    source: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    shortDefinition: z.string().max(240),
    icon: z.string().default('placeholder'),
    related: z.array(z.string()).default([]),
  }),
});

const SCRIPT_LIBRARIES = [
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
] as const;

const scripts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/scripts' }),
  schema: z
    .object({
      title: z.string(),
      library: z.enum(SCRIPT_LIBRARIES),
      play: z.string(),
      theme: z.string().optional(),
      authors: z.array(z.string()).default([]),
      copyright: z.string().optional(),
      minutes: z.number().int().positive().optional(),
      characters: z
        .array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
          }),
        )
        .default([]),
      doubling: z.string().optional(),
      stagingNotes: z.string().optional(),
      sourceDoc: z.string().optional(),
      sample: z.boolean().default(false),
    })
    .refine((s) => s.library !== 'themes' || !!s.theme, {
      message: "scripts entries with library === 'themes' must set a `theme`",
      path: ['theme'],
    }),
});

const askShakespeare = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ask-shakespeare' }),
  schema: z.object({
    columnNumber: z.number().int().positive(),
    title: z.string(),
    publishedIn: z.string(),
    asker: z.string().default('Reader'),
    excerpt: z.string().max(200),
    sample: z.boolean().default(false),
  }),
});

const colloquial = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/colloquial' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    translator: z.string(),
    /**
     * Bare filename only — e.g. "midsummah-pidgin-paka.mp4".
     * The AudioEmbed component prepends `/audio/`, and the Vitest
     * existence test looks for `public/audio/${audio}`.
     */
    audio: z.string().optional(),
    audioCaption: z.string().optional(),
    sourcePlay: z.string(),
    sample: z.boolean().default(false),
  }),
});

export const collections = { games, concepts, scripts, askShakespeare, colloquial };
