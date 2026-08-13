import { describe, it, expect } from 'vitest';
import { parseYear, groupByDecade, TIMELINE_EVENTS } from '@/lib/timeline';
import { timelineSchema } from '@/lib/content-schemas';

describe('parseYear', () => {
  it('parses a bare 4-digit year', () => {
    expect(parseYear('1971')).toBe(1971);
  });

  it('parses a year inside a longer date string', () => {
    expect(parseYear('March 1975')).toBe(1975);
    expect(parseYear('1980-05-12')).toBe(1980);
  });

  it('returns null for unparseable input', () => {
    expect(parseYear('undated')).toBe(null);
    expect(parseYear('')).toBe(null);
    expect(parseYear('Colorado Caravan')).toBe(null);
  });

  it('only matches 19xx or 20xx years', () => {
    expect(parseYear('1885')).toBe(null); // 18xx not matched
    expect(parseYear('2099')).toBe(2099);
  });
});

describe('groupByDecade', () => {
  it('groups events by decade correctly', () => {
    const events = [
      { date: '1971', event: 'A', organization: 'CC' as const },
      { date: '1975', event: 'B', organization: 'CC' as const },
      { date: '1985', event: 'C', organization: 'CSF' as const },
      { date: '1990', event: 'D', organization: 'ALL' as const },
      { date: '2020', event: 'E', organization: 'TEF' as const },
    ];
    const groups = groupByDecade(events);
    expect(groups.map((g) => g.decade)).toEqual([1970, 1980, 1990, 2020]);
    expect(groups[0].events).toHaveLength(2); // 1971 + 1975
    expect(groups[1].events).toHaveLength(1); // 1985
    expect(groups[2].events).toHaveLength(1); // 1990
    expect(groups[3].events).toHaveLength(1); // 2020
  });

  it('buckets unparseable dates into a trailing decade:null group (Cycle 9 T13)', () => {
    const events = [
      { date: '1971', event: 'A', organization: 'CC' as const },
      { date: 'undated', event: 'B', organization: 'CC' as const },
      { date: '197?', event: 'C', organization: 'CC' as const },
    ];
    const groups = groupByDecade(events);
    expect(groups).toHaveLength(2);
    expect(groups[0].decade).toBe(1970);
    expect(groups[0].events).toHaveLength(1);
    expect(groups[1].decade).toBe(null);
    expect(groups[1].events).toHaveLength(2);
    // The undated bucket comes AFTER all numeric decades.
    const decades = groups.map((g) => g.decade);
    const lastNumericIdx = decades.findLastIndex((d) => d !== null);
    const nullIdx = decades.indexOf(null);
    expect(nullIdx).toBeGreaterThan(lastNumericIdx);
  });

  it('omits the null-decade bucket when all events are parseable', () => {
    const events = [
      { date: '1971', event: 'A', organization: 'CC' as const },
      { date: '1985', event: 'B', organization: 'CSF' as const },
    ];
    const groups = groupByDecade(events);
    expect(groups.every((g) => g.decade !== null)).toBe(true);
  });

  it('returns empty for empty input', () => {
    expect(groupByDecade([])).toEqual([]);
  });
});

describe('TIMELINE_EVENTS', () => {
  it('parses cleanly against timelineSchema', () => {
    // Import-time IIFE would throw at build; this test is a redundant guard.
    expect(() => timelineSchema.parse(TIMELINE_EVENTS)).not.toThrow();
  });

  it('has at least one event (placeholder or real)', () => {
    expect(TIMELINE_EVENTS.length).toBeGreaterThan(0);
  });
});
