/**
 * Mock astro:content module for Vitest.
 * This manually loads and validates content collections without Astro's virtual module system.
 *
 * Schemas and SCRIPT_LIBRARIES are imported from src/lib/content-schemas.ts (single source
 * of truth) so they never drift from production. Frontmatter is parsed with the `yaml`
 * package (already a dep) so multi-line strings, quoted colons, and real Drive content
 * all parse correctly.
 */
import { fileURLToPath } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'astro/zod';
import { parse as parseYaml } from 'yaml';
import {
  gameSchema,
  conceptSchema,
  scriptsSchema,
  askShakespeareSchema,
  colloquialSchema,
} from '@/lib/content-schemas';

interface CollectionEntry<T = any> {
  id: string;
  slug: string;
  data: T;
  body: string;
}

function parseFrontmatter(raw: string, file: string): { data: Record<string, unknown>; body: string } {
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) throw new Error(`No frontmatter in ${file}`);
  const data = parseYaml(frontmatterMatch[1]) as Record<string, unknown>;
  // Body is everything after the closing ---
  const body = raw.slice(frontmatterMatch[0].length).replace(/^\n/, '');
  return { data, body };
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
    const raw = readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(raw, filePath);

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
