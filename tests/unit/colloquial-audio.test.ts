import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCollection } from 'astro:content';

describe('colloquial collection — audio file existence (Cycle 11)', () => {
  it('every entry with audio: set points to a real file in public/audio/', async () => {
    const entries = await getCollection('colloquial');
    const withAudio = entries.filter((e) => Boolean(e.data.audio));
    // NOTE: Cycle 11 ships without any audio file hosted (Drive file not
    // accessible via MCP; see client-review bundle item). When audio lands
    // later, this test enforces that any entry with `audio: 'name.mp4'`
    // frontmatter points to a file that actually exists on disk.
    for (const entry of withAudio) {
      const path = resolve(process.cwd(), 'public/audio', entry.data.audio!);
      expect(existsSync(path), `${entry.id} references audio ${entry.data.audio} which does not exist at ${path}`).toBe(true);
    }
  });

  it('one-uddah-midsummah entry has NO audio frontmatter (Cycle 11 defer)', async () => {
    const entries = await getCollection('colloquial');
    const uddah = entries.find((e) => e.id.startsWith('one-uddah-midsummah'));
    expect(uddah, 'one-uddah-midsummah entry present').toBeDefined();
    // Deliberately absent this cycle — remove this assertion when audio lands.
    expect(uddah!.data.audio).toBeUndefined();
  });
});
