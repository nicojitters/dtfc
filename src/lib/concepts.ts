import { getCollection, type CollectionEntry } from 'astro:content';

export type ConceptEntry = CollectionEntry<'concepts'>;

let cache: Map<string, ConceptEntry> | null = null;

async function loadIndex(): Promise<Map<string, ConceptEntry>> {
  if (cache) return cache;
  const entries = await getCollection('concepts');
  cache = new Map(entries.map((e) => [e.data.slug, e]));
  return cache;
}

export async function getConcept(slug: string): Promise<ConceptEntry> {
  const index = await loadIndex();
  const found = index.get(slug);
  if (!found) {
    const known = Array.from(index.keys()).sort().join(', ');
    throw new Error(`Concept "${slug}" not found. Known slugs: ${known}`);
  }
  return found;
}

export async function listConcepts(): Promise<ConceptEntry[]> {
  const index = await loadIndex();
  return Array.from(index.values()).sort((a, b) => a.data.name.localeCompare(b.data.name));
}
