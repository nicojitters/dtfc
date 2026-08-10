import { getCollection, type CollectionEntry } from 'astro:content';
import type { GameLite } from './gameFilter';

export function toGameLite(entry: CollectionEntry<'games'>): GameLite {
  return {
    slug: entry.id.replace(/\.mdx?$/, ''),
    name: entry.data.name,
    competency: entry.data.competency,
    subset: entry.data.subset,
    structure: entry.data.structure,
    cohesion: entry.data.cohesion,
    intent: entry.data.intent,
    source: entry.data.source,
    sample: entry.data.sample,
  };
}

export async function loadGamesLite(): Promise<GameLite[]> {
  const entries = await getCollection('games');
  return entries.map(toGameLite).sort((a, b) => a.name.localeCompare(b.name));
}
