import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('scripts collection', () => {
  it('has at least one entry per library', async () => {
    const entries = await getCollection('scripts');
    const libraries = new Set(entries.map((e) => e.data.library));
    for (const lib of ['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare'] as const) {
      expect(libraries.has(lib), `no scripts entry has library="${lib}"`).toBe(true);
    }
  });

  it('every themes entry has a theme field', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries.filter((e) => e.data.library === 'themes')) {
      expect(e.data.theme, `themes entry ${e.id} missing theme`).toBeTruthy();
    }
  });

  it('every entry with minutes has a positive integer value', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries) {
      if (e.data.minutes !== undefined) {
        expect(e.data.minutes).toBeGreaterThan(0);
        expect(Number.isInteger(e.data.minutes)).toBe(true);
      }
    }
  });
});

describe('askShakespeare collection', () => {
  it('has at least one entry', async () => {
    const entries = await getCollection('askShakespeare');
    expect(entries.length).toBeGreaterThan(0);
  });

  it('columnNumber values are unique across the collection', async () => {
    const entries = await getCollection('askShakespeare');
    const numbers = entries.map((e) => e.data.columnNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it('every excerpt is ≤ 200 characters', async () => {
    const entries = await getCollection('askShakespeare');
    for (const e of entries) {
      expect(e.data.excerpt.length).toBeLessThanOrEqual(200);
    }
  });
});

describe('colloquial collection', () => {
  it('has at least one entry', async () => {
    const entries = await getCollection('colloquial');
    expect(entries.length).toBeGreaterThan(0);
  });

  it('every entry with audio set has the file present under public/audio/', async () => {
    const { existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const audioDir = fileURLToPath(new URL('../../public/audio/', import.meta.url));
    const entries = await getCollection('colloquial');
    for (const e of entries) {
      if (e.data.audio) {
        // Convention: `audio` is a bare filename (see Task 1 schema comment).
        expect(
          existsSync(audioDir + e.data.audio),
          `${e.data.audio} referenced by ${e.id} not found in public/audio/`,
        ).toBe(true);
      }
    }
  });
});

describe('scripts collection — Cycle 4 extensions', () => {
  it('has at least one entry for each new library', async () => {
    const entries = await getCollection('scripts');
    const libraries = new Set(entries.map((e) => e.data.library));
    for (const lib of ['childrens-plays', 'teaching-modules'] as const) {
      expect(libraries.has(lib), `no scripts entry has library="${lib}"`).toBe(true);
    }
  });

  it("existing Shakespeare entries parse unchanged (regression check)", async () => {
    const entries = await getCollection('scripts');
    const shakespeareLibs = new Set(['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare']);
    const shakespeareEntries = entries.filter((e) => shakespeareLibs.has(e.data.library));
    expect(shakespeareEntries.length).toBeGreaterThan(0);
    for (const e of shakespeareEntries) {
      // If Cycle 3 entries broke, this collection wouldn't have loaded at all
      expect(e.data.title).toBeTruthy();
    }
  });

  it('every imagery entry with src set has a matching file under public/', async () => {
    const { existsSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));
    const entries = await getCollection('scripts');
    for (const e of entries) {
      for (const img of e.data.imagery) {
        // Convention: src starts with "/images/" — strip the leading slash for fs check.
        const rel = img.src.startsWith('/') ? img.src.slice(1) : img.src;
        expect(
          existsSync(publicDir + rel),
          `${img.src} referenced by ${e.id} not found under public/`,
        ).toBe(true);
      }
    }
  });

  it('imagery entries require alt text', async () => {
    const entries = await getCollection('scripts');
    for (const e of entries) {
      for (const img of e.data.imagery) {
        expect(img.alt, `${e.id} imagery entry missing alt text`).toBeTruthy();
      }
    }
  });
});
