import { describe, it, expect } from 'vitest';
import { findViolations } from '../../scripts/check-prohibited-text.mjs';

describe('prohibited-text guardrail', () => {
  it('flags "Great Change" (case-insensitive)', () => {
    const hits = findViolations('In this time of Great Change we...', 'fake.txt');
    expect(hits).toHaveLength(1);
    expect(hits[0].phrase.toLowerCase()).toBe('great change');
  });

  it('flags "traditional work and ways" (case-insensitive)', () => {
    const hits = findViolations('when Traditional Work And Ways no longer exist', 'fake.txt');
    expect(hits).toHaveLength(1);
  });

  it('flags the RESILIENCEl typo (case-sensitive)', () => {
    const hits = findViolations('we nurture RESILIENCEl in players', 'fake.txt');
    expect(hits.some((h) => h.phrase === 'RESILIENCEl')).toBe(true);
  });

  it("flags the wrong-apostrophe \"Childrens' Theatre\"", () => {
    const hits = findViolations("Welcome to Childrens' Theatre!", 'fake.txt');
    expect(hits.some((h) => h.phrase.includes("Childrens'"))).toBe(true);
  });

  it('flags "THIS (crazy) time" (case-insensitive)', () => {
    const hits = findViolations('in THIS (crazy) time of upheaval', 'fake.txt');
    expect(hits).toHaveLength(1);
  });

  it('does NOT flag clean canonical text', () => {
    const canonical =
      "We train physical and vocal readiness, how to recognize new contexts, and ways to nurture RESILIENCE...";
    expect(findViolations(canonical, 'fake.txt')).toHaveLength(0);
  });

  it("does NOT flag the correct \"Children's Theatre\" (curly apostrophe)", () => {
    expect(findViolations("Welcome to Children's Theatre!", 'fake.txt')).toHaveLength(0);
  });

  it('does NOT flag "RESILIENCE" (correct spelling)', () => {
    expect(findViolations('nurture RESILIENCE in every player', 'fake.txt')).toHaveLength(0);
  });

  it('reports line and column numbers accurately', () => {
    const text = 'line one\nline two with Great Change\nline three';
    const hits = findViolations(text, 'fake.txt');
    expect(hits).toHaveLength(1);
    expect(hits[0].line).toBe(2);
    expect(hits[0].file).toBe('fake.txt');
    expect(hits[0].col).toBeGreaterThan(0);
  });
});

describe('PATTERNS — Cycle 10 PRC vision spec §7 additions', () => {
  const table: Array<[string, string]> = [
    ['DESIRAE: Alphabetical Arrangement', 'DESIRAE:'],
    ['Desirae you will need the simple line drawing', 'Desirae you will need'],
    ['Writing a Play - check this doc info is included', 'check this doc info is included'],
    ['OTHERS? One Seed Child, OCEAN?', 'OTHERS?'],
    ['(image of water molecule)', '(image of water molecule)'],
    ['Developmental Theatre - Description (LOGO)', '(LOGO)'],
    ['Warmup : ICON', '(ICON) suffix'],
    ['Theatre Games Magic Toolbox (ICON)', '(ICON) suffix'],
    ['Note: Published in September 2024 Newsletter', 'Note: Published in '],
    ['https://docs.google.com/document/d/abc/edit', 'raw docs.google.com URL'],
    ['https://drive.google.com/file/d/xyz/view', 'raw drive.google.com URL'],
  ];
  for (const [input, phraseFragment] of table) {
    it(`detects ${phraseFragment}`, () => {
      const hits = findViolations(input, 'fake.mdx');
      const found = hits.some((h) => h.phrase.toLowerCase().includes(phraseFragment.toLowerCase().replace(/[()]/g, '')));
      expect(found).toBe(true);
    });
  }
});
