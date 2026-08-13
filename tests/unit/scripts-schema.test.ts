import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('existing entries survive Cycle 12 schema extension', () => {
  it('validates all shipped scripts entries', async () => {
    const entries = await getCollection('scripts');
    // getCollection would have thrown at import if any entry failed schema.
    expect(entries.length).toBeGreaterThan(10);
  });
});
