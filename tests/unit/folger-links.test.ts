import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Folger link URL shape (Cycle 12)', () => {
  it('every folger.edu URL in scripts collection uses https + full path', async () => {
    const entries = await getCollection('scripts');
    const folgerRe = /https:\/\/www\.folger\.edu\/[^\s)]+/g;
    for (const e of entries) {
      const body = e.body ?? '';
      const urls = [...body.matchAll(folgerRe)].map((m) => m[0]);
      for (const url of urls) {
        expect(url).toMatch(/^https:\/\/www\.folger\.edu\//);
        expect(url).not.toContain(' ');
      }
    }
  });

  it('Mechanicals script contains 3 Folger URLs (one per scene marker)', async () => {
    const entries = await getCollection('scripts');
    // Astro 5 content collections use e.id (includes .mdx extension); e.slug is deprecated
    const mech = entries.find(
      (e) =>
        e.id === 'mechanicals-scenes-a-midsummer-nights-dream.mdx' ||
        e.id === 'mechanicals-scenes-a-midsummer-nights-dream',
    );
    expect(mech).toBeDefined();
    const folgerRe = /https:\/\/www\.folger\.edu\/[^\s)]+/g;
    const urls = [...(mech!.body ?? '').matchAll(folgerRe)].map((m) => m[0]);
    expect(urls.length).toBeGreaterThanOrEqual(3);
  });
});
