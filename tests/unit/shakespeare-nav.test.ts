import { describe, it, expect } from 'vitest';
import { SHAKESPEARE_NAV } from '@/lib/shakespeare-nav';

describe('SHAKESPEARE_NAV — Cycle 11 reorder to vision spec §2', () => {
  it('has exactly 10 items', () => {
    expect(SHAKESPEARE_NAV).toHaveLength(10);
  });

  it('items appear in spec §2 client-numbered order', () => {
    const keys = SHAKESPEARE_NAV.map((n) => n.key);
    expect(keys).toEqual([
      'alternatives',
      'honoring-our-guides',
      'soliloquies',
      'scenes',
      'themes',
      'cuttings',
      'childrens-shakespeare',
      'colloquial',
      'new-plays',
      'ask-shakespeare',
    ]);
  });

  it('every href starts with /shakespeare/ and ends with /', () => {
    for (const item of SHAKESPEARE_NAV) {
      expect(item.href, item.label).toMatch(/^\/shakespeare\/.+\/$/);
    }
  });

  it('every key matches the tail segment of its href', () => {
    for (const item of SHAKESPEARE_NAV) {
      // strip /shakespeare/ prefix and trailing slash
      const tail = item.href.replace(/^\/shakespeare\//, '').replace(/\/$/, '');
      expect(tail, `${item.key} → ${item.href}`).toBe(item.key);
    }
  });
});
