import { describe, it, expect } from 'vitest';
import { FOUNDERS } from '@/data/founders';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

describe('FOUNDERS data', () => {
  it('has 11 entries after Cycle 9 vision-spec expansion (Melinda Scott + Marta Barnard added per vision-spec §3 Doc #3)', () => {
    expect(FOUNDERS.length).toBe(11);
  });

  it('every founder slug is unique', () => {
    const slugs = FOUNDERS.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every founder with photoSrc set has a matching file under public/', () => {
    for (const f of FOUNDERS) {
      if (f.photoSrc) {
        const rel = f.photoSrc.startsWith('/') ? f.photoSrc.slice(1) : f.photoSrc;
        expect(
          existsSync(publicDir + rel),
          `${f.photoSrc} referenced by ${f.slug} not found under public/`,
        ).toBe(true);
      }
    }
  });

  it("Judith Bock is flagged unconfirmed per spec §4.5 item 4", () => {
    const bock = FOUNDERS.find((f) => f.slug === 'judith-bock');
    expect(bock).toBeDefined();
    expect(bock!.unconfirmed).toBe(true);
  });

  it('all 11 vision-spec-required founders/contributors are present', () => {
    const slugs = new Set(FOUNDERS.map((f) => f.slug));
    for (const s of [
      'richard-knaub',
      'chuck-wilcox',
      'lola-wilcox',
      'martin-cobin',
      'laurie-obrien',
      'cherie-karo-schwartz',
      'judith-bock',
      'daniel-sp-yang',
      'nils-petersen',
      'melinda-scott',
      'marta-barnard',
    ]) {
      expect(slugs.has(s), `FOUNDERS missing ${s}`).toBe(true);
    }
  });

  it('category enum groups founders correctly for /legacy/founders/ page layout', () => {
    const byCategory = (cat: string) => FOUNDERS.filter((f) => f.category === cat).map((f) => f.slug);
    expect(byCategory('founder').sort()).toEqual(
      ['chuck-wilcox', 'lola-wilcox', 'martin-cobin', 'richard-knaub'].sort(),
    );
    expect(byCategory('origin-witness').sort()).toEqual(
      ['cherie-karo-schwartz', 'laurie-obrien'].sort(),
    );
    expect(byCategory('faculty').sort()).toEqual(['daniel-sp-yang', 'nils-petersen'].sort());
    expect(byCategory('contributor').sort()).toEqual(
      ['judith-bock', 'marta-barnard', 'melinda-scott'].sort(),
    );
  });
});
