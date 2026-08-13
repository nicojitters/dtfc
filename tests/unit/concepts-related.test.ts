import { describe, it, expect } from 'vitest';
import { getCollection } from './_astro-content';

describe('concepts collection — related slug resolution', () => {
  it('every related[] slug resolves to another concept entry', async () => {
    const entries = await getCollection('concepts');
    const validSlugs = new Set(entries.map((e) => e.data.slug));
    const problems: string[] = [];
    for (const e of entries) {
      for (const relSlug of e.data.related) {
        if (!validSlugs.has(relSlug)) {
          problems.push(`${e.data.slug} → related: '${relSlug}' (unknown)`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('has no self-references in related[]', async () => {
    const entries = await getCollection('concepts');
    for (const e of entries) {
      expect(e.data.related, `${e.data.slug} related`).not.toContain(e.data.slug);
    }
  });

  it('slug field matches file basename for every entry', async () => {
    const entries = await getCollection('concepts');
    for (const e of entries) {
      const basename = e.id.replace(/\.mdx?$/, '');
      expect(e.data.slug).toBe(basename);
    }
  });
});
