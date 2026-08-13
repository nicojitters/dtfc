import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Ask Shakespeare draft flag (Cycle 12)', () => {
  it('column #5 (censorship) is flagged draft', async () => {
    const entries = await getCollection('askShakespeare');
    const col5 = entries.find((e) => e.data.columnNumber === 5);
    expect(col5, 'column #5 exists').toBeDefined();
    expect(col5?.data.draft).toBe(true);
    expect(col5?.data.publishedIn).toBe('unpublished');
  });

  it('published columns default to draft:false', async () => {
    const entries = await getCollection('askShakespeare');
    for (const e of entries) {
      if (e.data.columnNumber === 5) continue;
      expect(e.data.draft ?? false, `${e.id} not draft`).toBe(false);
    }
  });
});
