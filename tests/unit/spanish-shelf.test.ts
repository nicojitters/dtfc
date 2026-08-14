import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(
  new URL('../../src/pages/shakespeare/childrens-shakespeare.astro', import.meta.url),
);

describe("Children's Shakespeare — Spanish shelf (Cycle 12)", () => {
  const source = readFileSync(path, 'utf-8');

  it('renders the bilingual heading with lang="es"', () => {
    expect(source).toContain('lang="es"');
    expect(source).toContain('Obras de Teatro Shakespeare para Niños en Español');
  });

  it('does not contain machine-translated filler', () => {
    // Sanity check: no "Google Translate" attribution or similar.
    expect(source).not.toContain('Google Translate');
  });

  it('links to Ask Shakespeare for notification', () => {
    expect(source).toContain('/shakespeare/ask-shakespeare/#form');
  });
});
