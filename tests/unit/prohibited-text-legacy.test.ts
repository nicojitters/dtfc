import { describe, it, expect } from 'vitest';
import { findViolations, PATTERNS } from '../../scripts/check-prohibited-text.mjs';

describe('prohibited-text guardrail — Legacy vision spec §6', () => {
  const specPhrases = [
    'Lola: I think the customers',
    'Desirae is considering',
    'record them here',
    'Steve Smith needs to confirm',
    '(pic?)',
    'For Bud Coleman',
    'VERSION #2',
    'JPJ notes',
    "I WASN'T THERE",
    'TEXT MISSING',
    'LOLA CC ARTICLE',
  ];

  it('registers all 12 vision-spec §6 patterns in PATTERNS', () => {
    // 5 pre-existing landing-spec patterns + 12 legacy §6 patterns = 17 total.
    expect(PATTERNS.length).toBeGreaterThanOrEqual(17);
  });

  it.each(specPhrases)('flags "%s" when it appears in an .astro file', (phrase) => {
    const src = `<p>preamble ${phrase} suffix</p>\n`;
    const hits = findViolations(src, 'src/pages/legacy/example.astro');
    const matched = hits.some((h) => h.phrase === phrase || h.phrase.includes(phrase));
    expect(matched, `expected a violation for "${phrase}"`).toBe(true);
  });

  it('flags a raw google.com/search URL', () => {
    const src = `<a href="https://www.google.com/search?q=daniel+sp+yang">link</a>\n`;
    const hits = findViolations(src, 'src/pages/legacy/example.astro');
    expect(hits.some((h) => /google/i.test(h.phrase))).toBe(true);
  });

  it('does NOT flag legitimate use of "Judith Bock" as a confirmed contributor', () => {
    // "JUDITH BOCK" (uppercase, as a source-doc question) is not in PATTERNS —
    // her real founder-card entry uses title-case and must not be flagged.
    const src = `<p>Judith Bock is listed as an unconfirmed contributor.</p>\n`;
    const hits = findViolations(src, 'src/pages/legacy/founders.astro');
    expect(hits).toHaveLength(0);
  });

  it('does NOT flag clean editorial prose', () => {
    const src = `<p>The Colorado Caravan launched in 1971 at CU Boulder.</p>\n`;
    const hits = findViolations(src, 'src/pages/legacy/history.astro');
    expect(hits).toHaveLength(0);
  });
});
