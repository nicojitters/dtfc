import { describe, it, expect } from 'vitest';
import {
  EMPTY_STATE,
  filterGames,
  stateToQuery,
  queryToState,
  type GameLite,
} from '../../src/lib/gameFilter';

const puppets: GameLite = {
  slug: 'puppets',
  name: 'Puppets / Marionettes',
  competency: 'physical-expression',
  subset: 'Mime',
  structure: 'group',
  cohesion: 'low',
  intent: 'Physical readiness',
  sample: true,
};

const changingPerson: GameLite = {
  slug: 'changing-person',
  name: 'The Changing Person / Activity',
  competency: 'context-awareness',
  structure: 'group',
  cohesion: 'medium',
  intent: 'Reading and responding',
  sample: true,
};

const resilienceSolo: GameLite = {
  slug: 'x',
  name: 'Solo Bounceback',
  competency: 'resilience',
  structure: 'individual',
  cohesion: 'high',
  intent: 'Recover from missed cue',
  sample: true,
};

const games = [puppets, changingPerson, resilienceSolo];

describe('filterGames', () => {
  it('empty state returns all games', () => {
    expect(filterGames(games, EMPTY_STATE)).toEqual(games);
  });

  it('filters by competency (OR within the axis)', () => {
    const state = { ...EMPTY_STATE, competencies: ['resilience', 'context-awareness'] as const };
    const result = filterGames(games, state as any);
    expect(result.map((g) => g.slug).sort()).toEqual(['changing-person', 'x']);
  });

  it('filters by cohesion', () => {
    const state = { ...EMPTY_STATE, cohesions: ['low' as const] };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('filters by structure', () => {
    const state = { ...EMPTY_STATE, structures: ['individual' as const] };
    expect(filterGames(games, state)).toEqual([resilienceSolo]);
  });

  it('filters by subset (only within selected competency)', () => {
    const state = {
      ...EMPTY_STATE,
      competencies: ['physical-expression' as const],
      subset: 'Mime',
    };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('substring-matches intent case-insensitively', () => {
    const state = { ...EMPTY_STATE, intent: 'RESPOND' };
    expect(filterGames(games, state)).toEqual([changingPerson]);
  });

  it('substring-matches name case-insensitively', () => {
    const state = { ...EMPTY_STATE, name: 'puppet' };
    expect(filterGames(games, state)).toEqual([puppets]);
  });

  it('combines filters with AND across axes', () => {
    const state = {
      ...EMPTY_STATE,
      competencies: ['physical-expression', 'context-awareness'] as any,
      cohesions: ['medium' as const],
    };
    expect(filterGames(games, state)).toEqual([changingPerson]);
  });

  it('returns empty when nothing matches', () => {
    const state = { ...EMPTY_STATE, name: 'nonexistent' };
    expect(filterGames(games, state)).toEqual([]);
  });
});

describe('URL serialization', () => {
  it('stateToQuery omits empty axes', () => {
    expect(stateToQuery(EMPTY_STATE)).toBe('');
  });

  it('serializes multi-select axes as repeated params', () => {
    const state = {
      ...EMPTY_STATE,
      competencies: ['physical-expression', 'resilience'] as any,
      cohesions: ['low' as const, 'high' as const],
    };
    const q = stateToQuery(state);
    // Order doesn't matter, so parse.
    const params = new URLSearchParams(q);
    expect(params.getAll('competency').sort()).toEqual(['physical-expression', 'resilience']);
    expect(params.getAll('cohesion').sort()).toEqual(['high', 'low']);
  });

  it('serializes single-value fields when set', () => {
    const state = { ...EMPTY_STATE, subset: 'Mime', intent: 'ready', name: 'puppets' };
    const q = new URLSearchParams(stateToQuery(state));
    expect(q.get('subset')).toBe('Mime');
    expect(q.get('intent')).toBe('ready');
    expect(q.get('name')).toBe('puppets');
  });

  it('round-trips through URLSearchParams', () => {
    const original = {
      competencies: ['physical-expression', 'resilience'] as any,
      cohesions: ['low' as const],
      structures: ['group' as const],
      subset: 'Mime',
      intent: 'Physical',
      name: 'pup',
    };
    const restored = queryToState(new URLSearchParams(stateToQuery(original)));
    expect(restored.competencies.sort()).toEqual([...original.competencies].sort());
    expect(restored.cohesions).toEqual(original.cohesions);
    expect(restored.structures).toEqual(original.structures);
    expect(restored.subset).toBe('Mime');
    expect(restored.intent).toBe('Physical');
    expect(restored.name).toBe('pup');
  });

  it('queryToState treats missing params as empty', () => {
    expect(queryToState(new URLSearchParams(''))).toEqual(EMPTY_STATE);
  });
});
