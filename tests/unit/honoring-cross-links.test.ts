import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HONORING_PATH = resolve(
  process.cwd(),
  'src/pages/shakespeare/honoring-our-guides.astro',
);

describe('Shakespeare Honoring Our Guides — cross-links (Cycle 11)', () => {
  const source = readFileSync(HONORING_PATH, 'utf-8');

  it('links to /legacy/founders', () => {
    expect(source).toMatch(/href=["']\/legacy\/founders["']/);
  });

  it('links to /legacy/founders/#chuck-wilcox (Chuck section)', () => {
    expect(source).toMatch(/href=["']\/legacy\/founders\/#chuck-wilcox["']/);
  });

  it('links to /legacy/essays/theatre-influences/#asian-theatre (Yang section)', () => {
    expect(source).toMatch(
      /href=["']\/legacy\/essays\/theatre-influences\/#asian-theatre["']/,
    );
  });

  it('has an anchor for #chuck-wilcox on this page', () => {
    expect(source).toMatch(/id=["']chuck-wilcox["']/);
  });

  it('has an anchor for #marta-barnard on this page', () => {
    expect(source).toMatch(/id=["']marta-barnard["']/);
  });
});
