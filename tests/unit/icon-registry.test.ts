import { describe, it, expect } from 'vitest';
import { ICON_REGISTRY } from '@/data/icon-registry';

describe('ICON_REGISTRY', () => {
  it('has no duplicate prcSlug values', () => {
    const slugs = Object.values(ICON_REGISTRY).map((e) => e.prcSlug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it('every entry has a non-empty file field ending in .svg', () => {
    for (const [id, entry] of Object.entries(ICON_REGISTRY)) {
      expect(entry.file, `${id}.file`).toMatch(/\.svg$/);
      expect(entry.file.length, `${id}.file length`).toBeGreaterThan(4);
    }
  });

  it('marks exactly the six ICON-flagged concepts', () => {
    const flagged = Object.entries(ICON_REGISTRY)
      .filter(([, e]) => e.iconFlagged)
      .map(([id]) => id)
      .sort();
    expect(flagged).toEqual(
      [
        'cohesion',
        'competency',
        'continuous-assessment',
        'magic-toolbox',
        'theatre-games',
        'warmup',
      ].sort(),
    );
  });

  it('has an entry for every concept collection member (checked in T7+T8 tests)', () => {
    // Placeholder — concrete cross-check lives in tests/unit/concepts-flags.test.ts
    // once all 20 entries exist. Kept here as a signpost.
    expect(Object.keys(ICON_REGISTRY).length).toBeGreaterThanOrEqual(6);
  });
});
