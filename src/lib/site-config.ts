/**
 * Cross-cutting site settings that would otherwise scatter across form
 * components, Donate CTA, and meta layout code. Centralizing here makes
 * launch-time swaps a 1-3 line edit rather than a site-wide find/replace.
 *
 * Post-launch (Cycle 8): swap `fallbackContactEmail` to the real inbox,
 * swap `canonicalHost` to the real production domain, swap
 * `ogDefaults.image` to Desirae's real OG asset.
 */
export const SITE_CONFIG = {
  fallbackContactEmail: 'hello@dtfc.example',
  canonicalHost: 'https://dtfc.example',
  ogDefaults: {
    image: '/og-default.png',
    imageAlt: 'Developmental Theatre: Fearless Creativity',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;
