import { describe, it, expect } from 'vitest';
import { TESTIMONIALS } from '@/data/testimonials';

describe('TESTIMONIALS data', () => {
  it('is an array (may be empty)', () => {
    expect(Array.isArray(TESTIMONIALS)).toBe(true);
  });

  it('every testimonial slug is unique (or array is empty)', () => {
    const slugs = TESTIMONIALS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every testimonial body is at most 600 chars', () => {
    for (const t of TESTIMONIALS) {
      expect(t.body.length, `${t.slug} body too long`).toBeLessThanOrEqual(600);
    }
  });

  it('every testimonial has slug, attribution, and body', () => {
    for (const t of TESTIMONIALS) {
      expect(t.slug, `entry missing slug`).toBeTruthy();
      expect(t.attribution, `${t.slug} missing attribution`).toBeTruthy();
      expect(t.body, `${t.slug} missing body`).toBeTruthy();
    }
  });
});
