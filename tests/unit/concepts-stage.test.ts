import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Stage entry — Cycle 10', () => {
  const raw = readFileSync(
    join(process.cwd(), 'src/content/concepts/stage.mdx'),
    'utf8',
  );

  it('declares credits to Jackie Pualani Johnson', () => {
    expect(raw).toMatch(/credits:\s*['"].*Jackie Pualani Johnson/);
  });

  it('sets desiraeReplaceable true', () => {
    expect(raw).toMatch(/desiraeReplaceable:\s*true/);
  });

  it('renders StageDiagram for all 6 variants', () => {
    const variants = ['proscenium', 'arena', 'in-the-round', 'thrust', 'unusual', 'sightlines'];
    for (const v of variants) {
      expect(raw, `variant ${v}`).toMatch(new RegExp(`<StageDiagram\\s+variant=["']${v}["']`));
    }
  });

  it('flags Theatre in the Round as DT:FC Favorite', () => {
    expect(raw).toMatch(/DT:FC Favorite/);
  });
});
