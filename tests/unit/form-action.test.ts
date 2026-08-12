import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('formActionFor', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns real Formspree URL when env is set to a valid id', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'abc12345');
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', 'def67890');
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', 'ghi54321');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter')).toEqual({
      action: 'https://formspree.io/f/abc12345',
      fallbackMode: false,
    });
    expect(formActionFor('askShakespeare')).toEqual({
      action: 'https://formspree.io/f/def67890',
      fallbackMode: false,
    });
    expect(formActionFor('testimonial')).toEqual({
      action: 'https://formspree.io/f/ghi54321',
      fallbackMode: false,
    });
  });

  it('returns fallback when env is the xxxxxxxx placeholder', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'xxxxxxxx');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('returns fallback when env is unset (undefined)', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', '');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('testimonial')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('returns fallback when env is an empty string', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', '');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('askShakespeare')).toEqual({
      action: '#',
      fallbackMode: true,
    });
  });

  it('each FormKey has an independent env — one set does not affect the others', async () => {
    vi.stubEnv('PUBLIC_FORMSPREE_NEWSLETTER_ID', 'realvalue');
    vi.stubEnv('PUBLIC_FORMSPREE_ASK_SHAKESPEARE_ID', '');
    vi.stubEnv('PUBLIC_FORMSPREE_TESTIMONIAL_ID', 'xxxxxxxx');
    const { formActionFor } = await import('@/lib/form-action');
    expect(formActionFor('newsletter').fallbackMode).toBe(false);
    expect(formActionFor('askShakespeare').fallbackMode).toBe(true);
    expect(formActionFor('testimonial').fallbackMode).toBe(true);
  });
});
