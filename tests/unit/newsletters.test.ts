import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('newsletters collection', () => {
  it('is registered and returns an array (may be empty)', async () => {
    const entries = await getCollection('newsletters');
    expect(Array.isArray(entries)).toBe(true);
  });

  it('every newsletter excerpt is at most 200 chars', async () => {
    const entries = await getCollection('newsletters');
    for (const e of entries) {
      expect(e.data.excerpt.length, `${e.id} excerpt too long`).toBeLessThanOrEqual(200);
    }
  });

  it('every newsletter has a positive integer issueNumber', async () => {
    const entries = await getCollection('newsletters');
    for (const e of entries) {
      expect(Number.isInteger(e.data.issueNumber), `${e.id} issueNumber not int`).toBe(true);
      expect(e.data.issueNumber, `${e.id} issueNumber not positive`).toBeGreaterThan(0);
    }
  });
});
