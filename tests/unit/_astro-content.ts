/**
 * Mock astro:content module for Vitest.
 * This manually loads and validates content collections without Astro's virtual module system.
 */
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { COMPETENCIES, COHESIONS, STRUCTURES } from '@/lib/types';

const SCRIPT_LIBRARIES = [
  'soliloquies',
  'scenes',
  'themes',
  'cuttings',
  'childrens-shakespeare',
] as const;

const gameSchema = z.object({
  name: z.string(),
  competency: z.enum(COMPETENCIES),
  subset: z.string().optional(),
  structure: z.enum(STRUCTURES),
  cohesion: z.enum(COHESIONS),
  intent: z.string(),
  source: z.string().optional(),
  sample: z.boolean().default(false),
});

const conceptSchema = z.object({
  name: z.string(),
  slug: z.string(),
  shortDefinition: z.string().max(240),
  icon: z.string().default('placeholder'),
  related: z.array(z.string()).default([]),
});

const scriptsSchema = z
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
  });

const askShakespeareSchema = z.object({
  columnNumber: z.number().int().positive(),
  title: z.string(),
  publishedIn: z.string(),
  asker: z.string().default('Reader'),
  excerpt: z.string().max(200),
  sample: z.boolean().default(false),
});

const colloquialSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  translator: z.string(),
  audio: z.string().optional(),
  audioCaption: z.string().optional(),
  sourcePlay: z.string(),
  sample: z.boolean().default(false),
});

// Simple YAML frontmatter parser using regex-based extraction
function parseFrontmatter(content: string): { data: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid MDX format: missing frontmatter');
  }

  const yamlStr = match[1];
  const body = match[2];
  const data: Record<string, any> = {};

  // Extract each key-value pair
  const lines = yamlStr.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.startsWith('#')) continue;

    // Check for key: value pattern (at start of line, no indent)
    if (!line.startsWith(' ')) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;

      const key = line.substring(0, colonIdx).trim();
      const valueStr = line.substring(colonIdx + 1).trim();

      if (!valueStr) {
        // Check if next line starts with array or object
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (nextLine.match(/^\s+- /)) {
            // Array follows
            const arrayItems: any[] = [];
            let j = i + 1;
            while (j < lines.length && lines[j].match(/^\s+- /)) {
              const itemLine = lines[j].trim().substring(2).trim();
              if (itemLine.startsWith('{ ')) {
                // Inline object
                const obj: Record<string, string> = {};
                const content = itemLine.slice(2, -2).trim();
                const pairs = content.split(',');
                for (const pair of pairs) {
                  const [k, v] = pair.trim().split(':').map((s) => s.trim());
                  obj[k] = v;
                }
                arrayItems.push(obj);
              } else {
                arrayItems.push(itemLine.replace(/^['"]|['"]$/g, ''));
              }
              j++;
            }
            data[key] = arrayItems;
            i = j - 1;
            continue;
          }
        }
        // Empty value, treat as empty array or null
        data[key] = [];
      } else if (valueStr === '[]') {
        data[key] = [];
      } else if (valueStr === '{}') {
        data[key] = {};
      } else if (valueStr === 'true') {
        data[key] = true;
      } else if (valueStr === 'false') {
        data[key] = false;
      } else if (/^\d+$/.test(valueStr)) {
        data[key] = parseInt(valueStr, 10);
      } else {
        // String value
        data[key] = valueStr.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return { data, body };
}

interface CollectionEntry<T = any> {
  id: string;
  slug: string;
  data: T;
  body: string;
}

async function loadCollection(name: string): Promise<CollectionEntry[]> {
  const contentDir = fileURLToPath(new URL('../../src/content', import.meta.url));
  const collectionDir = path.join(contentDir, name.replace(/([A-Z])/g, '-$1').toLowerCase());

  let schema: z.ZodSchema;
  switch (name) {
    case 'games':
      schema = gameSchema;
      break;
    case 'concepts':
      schema = conceptSchema;
      break;
    case 'scripts':
      schema = scriptsSchema;
      break;
    case 'askShakespeare':
      schema = askShakespeareSchema;
      break;
    case 'colloquial':
      schema = colloquialSchema;
      break;
    default:
      throw new Error(`Unknown collection: ${name}`);
  }

  const files = readdirSync(collectionDir).filter((f) => f.endsWith('.mdx'));
  const entries: CollectionEntry[] = [];

  for (const file of files) {
    const filePath = path.join(collectionDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(content);

    // Validate data against schema
    const validData = schema.parse(data);

    const id = file.replace(/\.mdx$/, '');
    const slug = id;

    entries.push({
      id,
      slug,
      data: validData,
      body,
    });
  }

  return entries;
}

export async function getCollection(name: string): Promise<CollectionEntry[]> {
  return loadCollection(name);
}

export type { CollectionEntry };
