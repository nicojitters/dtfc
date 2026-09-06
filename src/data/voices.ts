import { z } from 'zod';

/**
 * Nine testimonial videos scraped from the legacy site (developmentaltheatre.net)
 * home page in Cycle 15. Each voice = one YouTube video + poster still + name +
 * hyphenates (roles) + optional tag (either a Competency or a section name).
 *
 * Posters live at /public/images/voices/<slug>.webp (resized to 600px wide + WebP
 * encoded from the original WordPress uploads to keep the strip under ~200 KB).
 *
 * The strip renders on the landing (see src/components/voices/VoicesStrip.astro)
 * as a row of 9 above the LandingGrid.
 */

const voiceSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  hyphenates: z.string().min(1),
  /** Present when the legacy card had an explicit sub-label — usually a
   *  competency (\"Competency: Resilience\"), sometimes a section
   *  (\"Children's Theatre\") or theme phrase (\"Fearless Creativity\").
   *  Rendered as a small caption in the modal only (per Cycle 15 design
   *  answer #3 — omit from card). */
  tag: z.string().optional(),
  /** Duration in whole seconds. Formatted at render time. */
  durationSeconds: z.number().int().positive(),
  /** YouTube video ID (embed path suffix). Iframe src is built at open time. */
  ytId: z.string().min(1),
  posterSrc: z
    .string()
    .startsWith('/images/voices/')
    .endsWith('.webp'),
});

export type Voice = z.infer<typeof voiceSchema>;

const rawVoices: Voice[] = [
  {
    slug: 'jackie-1',
    name: 'Jackie Pualani Johnson',
    hyphenates:
      'Actor, Author, Singer; Chair, University of Hawaiʻi at Hilo Performing Arts Department (Emerita)',
    durationSeconds: 97, // 1:37
    ytId: 'b_I-XOa96gQ',
    posterSrc: '/images/voices/jackie-1.webp',
  },
  {
    slug: 'cherie',
    name: 'Cherie Karo Schwartz',
    hyphenates: 'Storyteller, Author, Educator, Docent Trainer',
    tag: 'Competency: Resilience',
    durationSeconds: 102, // 1:42
    ytId: 'b70OkJvu9Uk',
    posterSrc: '/images/voices/cherie.webp',
  },
  {
    slug: 'chuck',
    name: 'Chuck Wilcox',
    hyphenates: 'Actor, Author, Musician',
    tag: 'Competency: Context Awareness',
    durationSeconds: 155, // 2:35
    ytId: 'EnZW_WQnprg',
    posterSrc: '/images/voices/chuck.webp',
  },
  {
    slug: 'lola',
    name: 'Lola Wilcox',
    hyphenates: 'Consultant: Strategy & Conflict, Author',
    tag: 'Children’s Theatre',
    durationSeconds: 116, // 1:56
    ytId: 'h2ZhWdz7pH0',
    posterSrc: '/images/voices/lola.webp',
  },
  {
    slug: 'jackie-2',
    name: 'Jackie Pualani Johnson',
    hyphenates:
      'Actor, Author, Singer; Chair, University of Hawaiʻi at Hilo Performing Arts Department (Emerita)',
    tag: 'Competency: Physical Expression',
    durationSeconds: 39, // 0:39
    ytId: 'KmIRE8xxpoo',
    posterSrc: '/images/voices/jackie-2.webp',
  },
  {
    slug: 'steven',
    name: 'Steven Smith',
    hyphenates:
      'National Endowment for the Arts; NYC Design World Sales Trainer; Author, Actor, Manager, Singer',
    tag: 'Risk Taking and Management',
    durationSeconds: 92, // 1:32
    ytId: 'LATNS4INvCA',
    posterSrc: '/images/voices/steven.webp',
  },
  {
    slug: 'roger',
    name: 'Roger Holzberg',
    hyphenates:
      'Disney Imagineer; Founder, Reimagine Well; Entrepreneur, Author; Professor, CalArts',
    tag: 'Fearless Creativity',
    durationSeconds: 70, // 1:10
    ytId: 'msm8o0Ui3lo',
    posterSrc: '/images/voices/roger.webp',
  },
  {
    slug: 'laurie',
    name: 'Laurie O’Brien',
    hyphenates: 'Actor, Teacher, Author',
    tag: 'Competency: Vocal Expression',
    durationSeconds: 48, // 0:48
    ytId: 'QHR5HKNTzjQ',
    posterSrc: '/images/voices/laurie.webp',
  },
  {
    slug: 'linda',
    name: 'Linda Nenno Breining',
    hyphenates: 'Broadway Actor; Professor, Texas State University',
    durationSeconds: 62, // 1:02
    ytId: 'wWgkKwuRX6U',
    posterSrc: '/images/voices/linda.webp',
  },
];

export const VOICES: readonly Voice[] = z.array(voiceSchema).parse(rawVoices);

/** Slugs must be unique — enforced at import time. */
const seen = new Set<string>();
for (const v of VOICES) {
  if (seen.has(v.slug)) {
    throw new Error(`src/data/voices.ts: duplicate slug \"${v.slug}\"`);
  }
  seen.add(v.slug);
}

/** Format duration for display: 97 -> \"1:37\", 48 -> \"0:48\". */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
