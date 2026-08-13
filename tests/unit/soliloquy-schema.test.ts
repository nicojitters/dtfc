import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

const REQUIRED_SLUGS = [
  'julia-two-gentlemen', 'mistress-page-merry-wives', 'titania-msnd',
  'petruchio-taming', 'macbeth-macbeth', 'edgar-poor-tom-lear',
  'edmund-lear', 'clarence-r3', 'richard-iii-1', 'richard-iii-2',
  'richard-gloucester-h6p3', 'henry-vi-longer', 'joan-la-pucelle-h6p1',
  'katherine-h8', 'romeo-rj', 'brutus-jc', 'marullus-jc',
  'ophelia-hamlet', 'claudius-hamlet', 'ulysses-troilus',
  'thersites-troilus', 'hostess-falstaff-death-h5', 'sonnet-116',
];

describe('Soliloquy library coverage (Cycle 12)', () => {
  it('all 23 required soliloquy MDXs exist', async () => {
    const entries = await getCollection('scripts', ({ data }) =>
      data.library === 'soliloquies',
    );
    const slugs = new Set(entries.map((e) => e.id));
    for (const s of REQUIRED_SLUGS) {
      expect(slugs.has(s), `missing ${s}`).toBe(true);
    }
  });

  it('Titania entry does NOT contain OCR-corrupted "To danceJ" fragment', async () => {
    const entries = await getCollection('scripts');
    const titania = entries.find((e) => e.id === 'titania-msnd');
    expect(titania?.body).not.toContain('To danceJ');
  });

  it('Sonnet 116 body does NOT contain Poetry Foundation furniture', async () => {
    const entries = await getCollection('scripts');
    const sonnet = entries.find((e) => e.id === 'sonnet-116');
    expect(sonnet?.body).not.toContain('Play Audio');
    expect(sonnet?.body).not.toContain('poetryfoundation.org');
  });

  it('Henry VI longer entry cross-links to Children\'s shorter version', async () => {
    const entries = await getCollection('scripts');
    const h6 = entries.find((e) => e.id === 'henry-vi-longer');
    expect(h6?.body).toContain('/shakespeare/scripts/henry-vi-childrens-shakespeare/');
  });
});
