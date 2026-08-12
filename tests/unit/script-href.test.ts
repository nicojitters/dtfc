import { describe, it, expect } from 'vitest';
import { scriptHref } from '@/lib/script-href';

// Minimal shape matching the parts of CollectionEntry<'scripts'> that scriptHref reads.
type FakeEntry = { id: string; data: { library: string } };
const fake = (id: string, library: string): FakeEntry => ({ id, data: { library } });

describe('scriptHref', () => {
  it('routes Shakespeare libraries under /shakespeare/scripts/', () => {
    for (const lib of ['soliloquies', 'scenes', 'themes', 'cuttings', 'childrens-shakespeare']) {
      // @ts-expect-error — FakeEntry is intentionally minimal
      expect(scriptHref(fake('romeo.mdx', lib))).toBe('/shakespeare/scripts/romeo/');
    }
  });

  it('routes Childrens Theatre libraries under /childrens-theatre/scripts/', () => {
    for (const lib of ['childrens-plays', 'teaching-modules']) {
      // @ts-expect-error — FakeEntry is intentionally minimal
      expect(scriptHref(fake('water-of-life.mdx', lib))).toBe('/childrens-theatre/scripts/water-of-life/');
    }
  });

  it('strips both .mdx and .md filename extensions', () => {
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('foo.mdx', 'scenes'))).toBe('/shakespeare/scripts/foo/');
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('bar.md', 'scenes'))).toBe('/shakespeare/scripts/bar/');
  });

  it('leaves ids without an extension untouched (safety)', () => {
    // @ts-expect-error — FakeEntry is intentionally minimal
    expect(scriptHref(fake('foo', 'scenes'))).toBe('/shakespeare/scripts/foo/');
  });
});
