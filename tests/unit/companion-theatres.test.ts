import { describe, it, expect } from 'vitest';
import { COMPANION_THEATRES } from '@/data/companion-theatres';

describe('COMPANION_THEATRES data', () => {
  it('has at least 3 entries', () => {
    expect(COMPANION_THEATRES.length).toBeGreaterThanOrEqual(3);
  });

  it('every theatre slug is unique', () => {
    const slugs = COMPANION_THEATRES.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every theatre has required fields (slug, name, blurb)', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.slug, `${t.name} missing slug`).toBeTruthy();
      expect(t.name, `${t.slug} missing name`).toBeTruthy();
      expect(t.blurb, `${t.slug} missing blurb`).toBeTruthy();
    }
  });

  it('every blurb is at most 300 chars', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.blurb.length, `${t.slug} blurb too long`).toBeLessThanOrEqual(300);
    }
  });

  it('slugs are ASCII kebab-case', () => {
    for (const t of COMPANION_THEATRES) {
      expect(t.slug, `${t.slug} not kebab-case`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('international entries have optional city/state', () => {
    const international = COMPANION_THEATRES.find(
      (t) => t.slug === 'international-playback-theatre-network',
    );
    expect(international).toBeDefined();
    expect(international?.city).toBeUndefined();
    expect(international?.state).toBeUndefined();
  });
});
