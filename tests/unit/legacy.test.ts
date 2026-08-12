import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('essays collection', () => {
  it('has all 5 spec-required essay slugs', async () => {
    const entries = await getCollection('essays');
    const slugs = new Set(entries.map((e) => e.id.replace(/\.mdx?$/, '')));
    for (const s of [
      'towards-a-poor-caravan',
      'theatre-influences',
      'developmental-drama',
      'why-these-plays-are-successful',
      'workshop-manual',
    ]) {
      expect(slugs.has(s), `essays collection missing ${s}`).toBe(true);
    }
  });

  it("workshop-manual is flagged sample: true (TEXT MISSING placeholder per spec §8 item 2)", async () => {
    const entries = await getCollection('essays');
    const wm = entries.find((e) => e.id.replace(/\.mdx?$/, '') === 'workshop-manual');
    expect(wm).toBeDefined();
    expect(wm!.data.sample).toBe(true);
  });

  it('every essay excerpt is at most 200 chars', async () => {
    const entries = await getCollection('essays');
    for (const e of entries) {
      expect(e.data.excerpt.length, `${e.id} excerpt too long`).toBeLessThanOrEqual(200);
    }
  });
});
