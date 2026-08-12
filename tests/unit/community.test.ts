import { describe, it, expect } from 'vitest';
import { COMMUNITY_NAV } from '@/lib/community-nav';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pagesDir = fileURLToPath(new URL('../../src/pages/', import.meta.url));
const footerPath = fileURLToPath(new URL('../../src/components/layout/Footer.astro', import.meta.url));

describe('Community section', () => {
  it('COMMUNITY_NAV has 7 items in expected order', () => {
    expect(COMMUNITY_NAV.map((n) => n.key)).toEqual([
      'about',
      'how-were-organized',
      'membership',
      'donate',
      'newsletters',
      'companion-theatres',
      'testimonials',
    ]);
  });

  it('every COMMUNITY_NAV href starts with /community/ and ends with /', () => {
    for (const item of COMMUNITY_NAV) {
      expect(item.href, `${item.key} href malformed`).toMatch(/^\/community\/[a-z-]+\/$/);
    }
  });

  it('every COMMUNITY_NAV item has a page file that exists', () => {
    for (const item of COMMUNITY_NAV) {
      // /community/newsletters/ → src/pages/community/newsletters/index.astro
      // /community/about/ → src/pages/community/about.astro
      const slug = item.href.slice('/community/'.length, -1);
      const flatPath = pagesDir + `community/${slug}.astro`;
      const indexPath = pagesDir + `community/${slug}/index.astro`;
      expect(
        existsSync(flatPath) || existsSync(indexPath),
        `${item.key}: expected either ${flatPath} or ${indexPath}`,
      ).toBe(true);
    }
  });

  it('community landing preserves #membership anchor', () => {
    const src = readFileSync(pagesDir + 'community/index.astro', 'utf-8');
    expect(src).toContain('id="membership"');
  });

  it('Footer Donate link points at /community/donate/', () => {
    const src = readFileSync(footerPath, 'utf-8');
    expect(src).toContain('href="/community/donate/"');
    expect(src).toContain('>Donate<');
  });
});
