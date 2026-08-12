/**
 * Single source of truth for all content collection Zod schemas.
 * Imported by both src/content.config.ts (Astro build) and
 * tests/unit/_astro-content.ts (Vitest shim) so schemas never drift.
 */
import { z } from 'astro/zod';
import { COMPETENCIES, COHESIONS, STRUCTURES } from '@/lib/types';

export const SCRIPT_LIBRARIES = [
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
  'childrens-plays',
  'teaching-modules',
] as const;

export const gameSchema = z.object({
  name: z.string(),
  competency: z.enum(COMPETENCIES),
  subset: z.string().optional(),
  structure: z.enum(STRUCTURES),
  cohesion: z.enum(COHESIONS),
  intent: z.string(),
  source: z.string().optional(),
  sample: z.boolean().default(false),
});

export const conceptSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDefinition: z.string().max(240),
  icon: z.string().default('placeholder'),
  related: z.array(z.string()).default([]),
});

export const scriptsSchema = z
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
    // Cycle 4 — Children's-Theatre-scoped optional fields
    sourceMaterials: z.string().optional(),
    authorIntentions: z.string().optional(),
    whatToWatch: z.string().optional(),
    imagery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          credit: z.string().optional(),
        }),
      )
      .default([]),
    aiPrompt: z.string().optional(),
    series: z.string().optional(),
  })
  .refine((s) => s.library !== 'themes' || !!s.theme, {
    message: "scripts entries with library === 'themes' must set a `theme`",
    path: ['theme'],
  });

export const askShakespeareSchema = z.object({
  columnNumber: z.number().int().positive(),
  title: z.string(),
  publishedIn: z.string(),
  asker: z.string().default('Reader'),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});

export const colloquialSchema = z.object({
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
});

export const TIMELINE_ORGS = ['ALL', 'CC', 'C&C', 'CSF', 'TEF', 'OSC'] as const;

export const timelineEventSchema = z.object({
  date: z.string(),
  event: z.string(),
  participants: z.string().optional(),
  presentation: z.string().optional(),
  additionalInfo: z.string().optional(),
  organization: z.enum(TIMELINE_ORGS),
});

export const timelineSchema = z.array(timelineEventSchema);

export const essaysSchema = z.object({
  title: z.string(),
  author: z.string(),
  year: z.number().int().positive().optional(),
  publishedIn: z.string().optional(),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});
