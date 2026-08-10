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

export const collections = { games, concepts };
