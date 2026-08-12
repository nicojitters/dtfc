import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  gameSchema,
  conceptSchema,
  scriptsSchema,
  askShakespeareSchema,
  colloquialSchema,
  essaysSchema,
  newslettersSchema,
} from '@/lib/content-schemas';

const games = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/games' }),
  schema: gameSchema,
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: conceptSchema,
});

const scripts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/scripts' }),
  schema: scriptsSchema,
});

const askShakespeare = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ask-shakespeare' }),
  schema: askShakespeareSchema,
});

const colloquial = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/colloquial' }),
  schema: colloquialSchema,
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/essays' }),
  schema: essaysSchema,
});

const newsletters = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/newsletters' }),
  schema: newslettersSchema,
});

export const collections = { games, concepts, scripts, askShakespeare, colloquial, essays, newsletters };
