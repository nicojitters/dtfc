import { describe, it, expect } from 'vitest';
import { conceptSchema } from '@/lib/content-schemas';

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
