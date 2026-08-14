import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('SITE_CONFIG', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('exports fallbackContactEmail as a plausible email', async () => {
    const { SITE_CONFIG } = await import('@/lib/site-config');
    expect(typeof SITE_CONFIG.fallbackContactEmail).toBe('string');
    expect(SITE_CONFIG.fallbackContactEmail).toContain('@');
  });

  it('exports ogDefaults with image, imageAlt, imageWidth, imageHeight', async () => {
    const { SITE_CONFIG } = await import('@/lib/site-config');
    expect(SITE_CONFIG.ogDefaults.image).toMatch(/^\//);
    expect(typeof SITE_CONFIG.ogDefaults.imageAlt).toBe('string');
    expect(SITE_CONFIG.ogDefaults.imageWidth).toBe(1200);
    expect(SITE_CONFIG.ogDefaults.imageHeight).toBe(630);
  });

  describe('canonicalHost resolution', () => {
    it('uses PUBLIC_SITE_URL when set to a valid URL', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', 'https://example.com');
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(SITE_CONFIG.canonicalHost).toBe('https://example.com');
    });

    it('normalizes to origin (strips path + trailing slash)', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', 'https://example.com/some/path/');
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(SITE_CONFIG.canonicalHost).toBe('https://example.com');
    });

    it('falls back when env is undefined', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', undefined as unknown as string);
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(SITE_CONFIG.canonicalHost).toBe('https://dtfc.example');
    });

    it('falls back when env is empty string (regression: Vercel build crash)', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', '');
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(SITE_CONFIG.canonicalHost).toBe('https://dtfc.example');
    });

    it('falls back when env is a bare domain (no scheme)', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', 'dtfc.example');
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(SITE_CONFIG.canonicalHost).toBe('https://dtfc.example');
    });

    it('resolved host is always a valid `new URL(...)` base', async () => {
      vi.stubEnv('PUBLIC_SITE_URL', '');
      const { SITE_CONFIG } = await import('@/lib/site-config');
      expect(new URL('/og-default.png', SITE_CONFIG.canonicalHost).href).toBe(
        'https://dtfc.example/og-default.png',
      );
    });
  });
});
