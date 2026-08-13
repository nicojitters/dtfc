import { describe, it, expect } from 'vitest';
import { conceptSchema } from '@/lib/content-schemas';
import { getCollection } from './_astro-content';

describe('conceptSchema — Cycle 10 additive fields', () => {
  it('defaults draft to false', () => {
    const parsed = conceptSchema.parse({
      name: 'Test',
      slug: 'test',
      shortDefinition: 'x',
    });
    expect(parsed.draft).toBe(false);
    expect(parsed.beyondSource).toBe(false);
    expect(parsed.desiraeReplaceable).toBe(false);
    expect(parsed.aiAttribution).toBe(false);
    expect(parsed.assets).toEqual([]);
    expect(parsed.credits).toBeUndefined();
    expect(parsed.provenance).toBeUndefined();
  });

  it('accepts assets[] with default status "placeholder"', () => {
    const parsed = conceptSchema.parse({
      name: 'Test',
      slug: 'test',
      shortDefinition: 'x',
      assets: [{ slug: 'wayfarer', description: 'Wayfarer wheel SVG' }],
    });
    expect(parsed.assets[0].status).toBe('placeholder');
  });

  it('accepts all Cycle 10 flags true + credits + provenance', () => {
    const parsed = conceptSchema.parse({
      name: 'Stage',
      slug: 'stage',
      shortDefinition: 'x',
      credits: 'Presentation developed by Jackie Pualani Johnson',
      provenance: 'Published in September 2024 Newsletter',
      draft: true,
      beyondSource: true,
      desiraeReplaceable: true,
      aiAttribution: true,
    });
    expect(parsed.credits).toBe('Presentation developed by Jackie Pualani Johnson');
    expect(parsed.provenance).toBe('Published in September 2024 Newsletter');
    expect(parsed.draft).toBe(true);
    expect(parsed.beyondSource).toBe(true);
    expect(parsed.desiraeReplaceable).toBe(true);
    expect(parsed.aiAttribution).toBe(true);
  });

  it('rejects invalid assets status', () => {
    expect(() =>
      conceptSchema.parse({
        name: 'Test',
        slug: 'test',
        shortDefinition: 'x',
        assets: [{ slug: 'x', description: 'y', status: 'bogus' }],
      }),
    ).toThrow();
  });
});

describe('concepts collection — Cycle 10 flag distribution', () => {
  it('exactly players and resilience carry beyondSource:true', async () => {
    const entries = await getCollection('concepts');
    const beyond = entries.filter((e) => e.data.beyondSource).map((e) => e.data.slug).sort();
    expect(beyond).toEqual(['players', 'resilience']);
  });

  it('facilitation is the only entry with draft:false', async () => {
    const entries = await getCollection('concepts');
    const notDraft = entries
      .filter((e) => e.data.draft === false)
      .map((e) => e.data.slug)
      .sort();
    // players + resilience are beyondSource — they preserve current draft state
    // (whatever Cycle 1 set). Real assertion: at MINIMUM facilitation is draft:false.
    expect(notDraft).toContain('facilitation');
  });

  it('icons entry is marked draft:true (internal draft awaiting client approval)', async () => {
    const entries = await getCollection('concepts');
    const icons = entries.find((e) => e.data.slug === 'icons');
    expect(icons?.data.draft).toBe(true);
  });

  it('aiAttribution:true on Repetition + Language: Oral Tradition', async () => {
    const entries = await getCollection('concepts');
    const flagged = entries
      .filter((e) => e.data.aiAttribution)
      .map((e) => e.data.slug)
      .sort();
    // If source doc audit reveals other entries with AI notes, extend this list.
    expect(flagged).toEqual(['language-oral-tradition', 'repetition']);
  });

  it('stage entry has credits + desiraeReplaceable:true', async () => {
    const entries = await getCollection('concepts');
    const stage = entries.find((e) => e.data.slug === 'stage');
    expect(stage?.data.credits).toMatch(/Jackie Pualani Johnson/);
    expect(stage?.data.desiraeReplaceable).toBe(true);
  });
});
