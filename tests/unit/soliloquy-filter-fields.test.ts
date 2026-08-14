import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Soliloquy filter fields (Cycle 12)', () => {
  it('every non-Sonnet soliloquy has register + speakerGender', async () => {
    const all = await getCollection('scripts');
    const entries = all.filter((e) => e.data.library === 'soliloquies' && !e.data.draft);
    for (const e of entries) {
      if (e.id === 'sonnet-116') continue;
      expect(e.data.register, `${e.id}: register`).toBeTruthy();
      expect(e.data.speakerGender, `${e.id}: speakerGender`).toBeTruthy();
    }
  });

  it('filter data spans meaningful variety once library is populated', async () => {
    const all = await getCollection('scripts');
    const entries = all.filter((e) => e.data.library === 'soliloquies' && !e.data.draft);
    if (entries.length < 10) return;
    const registers = new Set(entries.map((e) => e.data.register).filter(Boolean));
    const genders = new Set(entries.map((e) => e.data.speakerGender).filter(Boolean));
    const plays = new Set(entries.map((e) => e.data.play).filter(Boolean));
    expect(registers.size).toBeGreaterThanOrEqual(3);
    expect(genders.size).toBeGreaterThanOrEqual(2);
    expect(plays.size).toBeGreaterThanOrEqual(5);
  });
});
