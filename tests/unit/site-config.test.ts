import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '@/lib/site-config';

describe('SITE_CONFIG', () => {
  it('exports fallbackContactEmail as a string', () => {
    expect(typeof SITE_CONFIG.fallbackContactEmail).toBe('string');
    expect(SITE_CONFIG.fallbackContactEmail.length).toBeGreaterThan(0);
  });

  it('fallbackContactEmail is a plausible email (contains @)', () => {
    expect(SITE_CONFIG.fallbackContactEmail).toContain('@');
  });

  it('exports canonicalHost as an https URL', () => {
    expect(SITE_CONFIG.canonicalHost).toMatch(/^https:\/\//);
  });

  it('exports ogDefaults with image, imageAlt, imageWidth, imageHeight', () => {
    expect(SITE_CONFIG.ogDefaults.image).toMatch(/^\//);
    expect(typeof SITE_CONFIG.ogDefaults.imageAlt).toBe('string');
    expect(SITE_CONFIG.ogDefaults.imageWidth).toBe(1200);
    expect(SITE_CONFIG.ogDefaults.imageHeight).toBe(630);
  });
});
