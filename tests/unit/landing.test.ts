import { describe, it, expect } from 'vitest';
import {
  BoxSchema,
  ReflectiveBankSchema,
  SECTION_TILES,
  WORKSHOPS_BOX,
  COMMUNITY_CENTER,
  REFLECTIVE_BANKS,
  IDEA_TWO_ANSWERS,
  LANDING_MODE,
  pickIndex,
} from '@/data/landing';
import { NAV_ITEMS } from '@/lib/nav';

describe('landing data — Box schema', () => {
  it('SECTION_TILES has exactly 5 tiles', () => {
    expect(SECTION_TILES).toHaveLength(5);
  });

  it('every SECTION_TILE parses against BoxSchema', () => {
    for (const tile of SECTION_TILES) {
      expect(() => BoxSchema.parse(tile)).not.toThrow();
    }
  });

  it('SECTION_TILES are in nav.ts order (community excluded, workshops excluded)', () => {
    const expected = NAV_ITEMS
      .filter((n) => n.key !== 'community' && n.key !== 'workshops')
      .map((n) => n.key);
    expect(SECTION_TILES.map((t) => t.key)).toEqual(expected);
  });

  it('every standard tile has at least 1 listItem and at least 2 questions', () => {
    for (const tile of SECTION_TILES) {
      expect(tile.listItems.length).toBeGreaterThanOrEqual(1);
      expect(tile.questions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('WORKSHOPS_BOX has variant "secondary" and empty content arrays', () => {
    expect(WORKSHOPS_BOX.variant).toBe('secondary');
    expect(WORKSHOPS_BOX.listItems).toEqual([]);
    expect(WORKSHOPS_BOX.questions).toEqual([]);
  });
});

describe('landing data — Community center', () => {
  it('headline is exactly "Be Fearlessly Creative!"', () => {
    expect(COMMUNITY_CENTER.headline).toBe('Be Fearlessly Creative!');
  });

  it('body contains uppercase RESILIENCE exactly once and no source typos', () => {
    const matches = COMMUNITY_CENTER.body.match(/RESILIENCE/g) ?? [];
    expect(matches).toHaveLength(1);
    expect(COMMUNITY_CENTER.body).not.toMatch(/RESILIENCEl/);
  });

  it('extended array has exactly 2 paragraphs and both mention RESILIENCE or resilience', () => {
    expect(COMMUNITY_CENTER.extended).toHaveLength(2);
  });
});

describe('landing data — Reflective banks', () => {
  it('REFLECTIVE_BANKS has exactly 6 banks (community + 5 sections)', () => {
    expect(REFLECTIVE_BANKS).toHaveLength(6);
  });

  it('every bank has exactly 5 prompts', () => {
    for (const bank of REFLECTIVE_BANKS) {
      expect(bank.prompts).toHaveLength(5);
    }
  });

  it('every bank parses against ReflectiveBankSchema', () => {
    for (const bank of REFLECTIVE_BANKS) {
      expect(() => ReflectiveBankSchema.parse(bank)).not.toThrow();
    }
  });

  it('bank sectionKeys are unique and each matches a nav key', () => {
    const keys = REFLECTIVE_BANKS.map((b) => b.sectionKey);
    expect(new Set(keys).size).toBe(keys.length);
    const navKeys = new Set(NAV_ITEMS.map((n) => n.key));
    for (const k of keys) {
      expect(navKeys.has(k)).toBe(true);
    }
  });

  it('no bank contains superseded first-set phrasing', () => {
    // First generic set used pre-Lola section names.
    const forbidden = [
      /Acting\s*\/\s*Performance/i,
      /Technical Theater/i,
      /Community Engagement/i,
    ];
    for (const bank of REFLECTIVE_BANKS) {
      for (const prompt of bank.prompts) {
        for (const rx of forbidden) {
          expect(prompt).not.toMatch(rx);
        }
      }
    }
  });

  it('Legacy bank uses the revised set (fear/intimidating variant), not the first set', () => {
    const legacy = REFLECTIVE_BANKS.find((b) => b.sectionKey === 'legacy');
    expect(legacy).toBeDefined();
    // Revised Legacy prompt 1 begins with "What aspect of creative exploration..."
    expect(legacy!.prompts[0]).toMatch(/What aspect of creative exploration/);
  });
});

describe('landing data — Idea Two answer promise', () => {
  it('IDEA_TWO_ANSWERS has exactly 13 rows (per vision spec §6)', () => {
    expect(IDEA_TWO_ANSWERS).toHaveLength(13);
  });

  it('every §6 question appears verbatim in exactly one SECTION_TILES[i].questions array', () => {
    const allQuestions = SECTION_TILES.flatMap((t) => t.questions);
    for (const row of IDEA_TWO_ANSWERS) {
      const found = allQuestions.filter((q) => q === row.question);
      expect(found).toHaveLength(1);
    }
  });
});

describe('landing data — mode + picker', () => {
  it('LANDING_MODE default is "hybrid"', () => {
    expect(LANDING_MODE).toBe('hybrid');
  });

  it('pickIndex returns a valid index in bounds', () => {
    expect(pickIndex(['a', 'b', 'c'], 0)).toBe(0);
    expect(pickIndex(['a', 'b', 'c'], 0.99)).toBe(2);
    expect(pickIndex(['a', 'b', 'c'], 0.5)).toBe(1);
  });

  it('pickIndex returns 0 for empty bank', () => {
    expect(pickIndex([], 0.5)).toBe(0);
  });
});
