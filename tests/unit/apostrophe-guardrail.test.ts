import { describe, it, expect } from 'vitest';
import { findStraightApostropheInProse, CURLY_APOSTROPHE_ALLOWLIST } from '../../scripts/check-prohibited-text.mjs';

describe('curly-apostrophe guardrail', () => {
  it('flags a straight apostrophe in prose', () => {
    const src = `<p>Aesop's Fables are wonderful.</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(1);
    expect(hits[0].col).toBeGreaterThan(0);
  });

  it('does NOT flag a straight apostrophe in a JS import string', () => {
    const src = `import Foo from '@/components/legacy/Foo.astro';\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag getCollection() calls', () => {
    const src = `const entries = await getCollection('essays');\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag a whitelisted Cycle 3 Shakespeare verse file', () => {
    const src = `<p>Environ'd with a wilderness of sea.</p>\n`;
    for (const path of CURLY_APOSTROPHE_ALLOWLIST) {
      const hits = findStraightApostropheInProse(src, path);
      expect(hits, `whitelisted path ${path} should return no hits`).toHaveLength(0);
    }
    // Sanity: same string in a non-whitelisted file IS flagged.
    const hits = findStraightApostropheInProse(src, 'src/content/essays/other.mdx');
    expect(hits).toHaveLength(1);
  });

  it('reports line and column accurately for a multi-line file', () => {
    const src = `<p>line one</p>\n<p>Line two with Aesop's fable.</p>\n<p>line three</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/pages/legacy/example.astro');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(2);
  });

  it('flags an apostrophe used as possessive (Shakespeares) in editorial prose', () => {
    const src = `<p>Shakespeare's plays are still on stage.</p>\n`;
    const hits = findStraightApostropheInProse(src, 'src/content/essays/legacy-essay.mdx');
    expect(hits).toHaveLength(1);
  });

  it('does NOT flag straight apostrophes in .ts files (out of scope)', () => {
    const src = `const label = "Children's Theatre";\n`;
    const hits = findStraightApostropheInProse(src, 'src/lib/nav.ts');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag straight apostrophes in .tsx / .js / .jsx / .svg files', () => {
    for (const path of ['src/foo.tsx', 'src/bar.js', 'src/baz.jsx', 'public/x.svg']) {
      expect(findStraightApostropheInProse("Aesop's fables\n", path)).toHaveLength(0);
    }
  });

  it('flags a straight apostrophe in a .mdx file (in scope)', () => {
    const hits = findStraightApostropheInProse("It's a story.\n", 'src/content/essays/foo.mdx');
    expect(hits).toHaveLength(1);
  });

  it('flags a straight apostrophe in a .md file (in scope)', () => {
    const hits = findStraightApostropheInProse("Author's note.\n", 'README.md');
    expect(hits).toHaveLength(1);
  });
});
