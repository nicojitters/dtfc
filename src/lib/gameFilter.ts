import {
  COMPETENCIES,
  COHESIONS,
  STRUCTURES,
  type Competency,
  type Cohesion,
  type Structure,
} from './types';

export interface GameLite {
  slug: string;
  name: string;
  competency: Competency;
  subset?: string;
  structure: Structure;
  cohesion: Cohesion;
  intent: string;
  source?: string;
  sample: boolean;
}

export interface FilterState {
  competencies: Competency[];
  cohesions: Cohesion[];
  structures: Structure[];
  subset: string | null;
  intent: string;
  name: string;
}

export const EMPTY_STATE: FilterState = {
  competencies: [],
  cohesions: [],
  structures: [],
  subset: null,
  intent: '',
  name: '',
};

function containsCI(haystack: string, needle: string): boolean {
  if (!needle) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function filterGames(games: GameLite[], s: FilterState): GameLite[] {
  return games.filter((g) => {
    if (s.competencies.length && !s.competencies.includes(g.competency)) return false;
    if (s.cohesions.length && !s.cohesions.includes(g.cohesion)) return false;
    if (s.structures.length && !s.structures.includes(g.structure)) return false;
    if (s.subset && g.subset !== s.subset) return false;
    if (!containsCI(g.intent, s.intent)) return false;
    if (!containsCI(g.name, s.name)) return false;
    return true;
  });
}

export function stateToQuery(s: FilterState): string {
  const p = new URLSearchParams();
  s.competencies.forEach((c) => p.append('competency', c));
  s.cohesions.forEach((c) => p.append('cohesion', c));
  s.structures.forEach((c) => p.append('structure', c));
  if (s.subset) p.set('subset', s.subset);
  if (s.intent) p.set('intent', s.intent);
  if (s.name) p.set('name', s.name);
  return p.toString();
}

function pickEnum<T extends readonly string[]>(values: string[], allowed: T): T[number][] {
  return values.filter((v): v is T[number] => (allowed as readonly string[]).includes(v));
}

export function queryToState(q: URLSearchParams): FilterState {
  return {
    competencies: pickEnum(q.getAll('competency'), COMPETENCIES),
    cohesions: pickEnum(q.getAll('cohesion'), COHESIONS),
    structures: pickEnum(q.getAll('structure'), STRUCTURES),
    subset: q.get('subset'),
    intent: q.get('intent') ?? '',
    name: q.get('name') ?? '',
  };
}
