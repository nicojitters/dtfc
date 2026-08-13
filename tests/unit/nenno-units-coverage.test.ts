import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

const REQUIRED_NENNO_SLUGS = [
  'nurse-juliet-rj-nenno',
  'hermia-helena-lysander-msnd-nenno',
  'olivia-viola-twelfth-night-nenno',
  'richard-lady-anne-r3-nenno',
  'quickly-falstaff-page-ford-merry-wives-nenno',
  'angelo-isabella-lucio-measure-nenno',
  'brutus-cassius-jc-nenno',
  'hamlet-horatio-nenno',
] as const;

describe('Nenno units — coverage (Cycle 12)', () => {
  it('all 8 required Nenno unit MDXs exist', async () => {
    const all = await getCollection('scripts');
    const entries = all.filter((e) => Boolean(e.data.nennoUnit));
    const ids = new Set(entries.map((e) => e.id));
    for (const required of REQUIRED_NENNO_SLUGS) {
      expect(ids.has(required), `missing ${required}`).toBe(true);
    }
  });

  it('Hamlet/Horatio unit has Horatio-correct description (not Falstaff)', async () => {
    const entries = await getCollection('scripts');
    const horatio = entries.find((e) => e.id === 'hamlet-horatio-nenno');
    expect(horatio).toBeDefined();
    const oneLiners = JSON.stringify(horatio!.data.characterOneLiners ?? {});
    expect(oneLiners).toContain('Wittenberg');
    expect(oneLiners).not.toContain('Prince Hal alter-father');
    expect(oneLiners).not.toContain('Large Person in every way');
  });
});
