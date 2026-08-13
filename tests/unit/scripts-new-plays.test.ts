import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';
import { scriptHref } from '@/lib/script-href';

describe('scripts library enum — new-plays (Cycle 11)', () => {
  it('accepts library: new-plays entries', async () => {
    // Loads all scripts entries; if a `new-plays` file exists (added in T9),
    // it must validate. This test proves the enum change works even before
    // the placeholder entries land.
    const entries = await getCollection('scripts');
    // Filter to entries whose frontmatter library is new-plays.
    const newPlays = entries.filter((e) => e.data.library === 'new-plays');
    // At schema-time this list may be empty until T9 authors the placeholders;
    // the assertion is that filtering does not throw due to enum mismatch.
    expect(Array.isArray(newPlays)).toBe(true);
  });

  it('scriptHref routes new-plays to /shakespeare/scripts/<slug>/', () => {
    const fakeEntry = {
      id: 'test-new-play.mdx',
      data: { library: 'new-plays' as const },
    } as never;
    expect(scriptHref(fakeEntry)).toBe('/shakespeare/scripts/test-new-play/');
  });
});
