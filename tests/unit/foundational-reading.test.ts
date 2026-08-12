import { describe, expect, it } from 'vitest';
import { FOUNDATIONAL_READING } from '@/data/foundational-reading';

describe('FOUNDATIONAL_READING', () => {
  it('contains exactly the 6 works named in vision spec §3 Doc #3', () => {
    expect(FOUNDATIONAL_READING).toHaveLength(6);
  });

  it('every entry has a non-empty author', () => {
    for (const work of FOUNDATIONAL_READING) {
      expect(work.author).toBeTypeOf('string');
      expect(work.author.length).toBeGreaterThan(0);
    }
  });

  it('every entry with a year has a plausible drama-history year', () => {
    for (const work of FOUNDATIONAL_READING) {
      if (work.year !== undefined) {
        expect(work.year).toBeGreaterThanOrEqual(1900);
        expect(work.year).toBeLessThanOrEqual(2030);
      }
    }
  });

  it('is sorted alphabetically by author surname', () => {
    const surnames = FOUNDATIONAL_READING.map((w) => w.author.split(',')[0]);
    const sorted = [...surnames].sort((a, b) => a.localeCompare(b));
    expect(surnames).toEqual(sorted);
  });

  it('covers the six spec-required authors', () => {
    const required = ['Durland', 'McCaslin', 'Siks', 'Spolin', 'Tyas', 'Way'];
    for (const surname of required) {
      expect(FOUNDATIONAL_READING.some((w) => w.author.startsWith(surname))).toBe(true);
    }
  });
});
