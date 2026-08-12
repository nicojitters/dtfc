/**
 * Cross-cutting site settings that would otherwise scatter across form
 * components, Donate CTA, and meta layout code. Centralizing here makes
 * launch-time swaps a 1-3 line edit rather than a site-wide find/replace.
 *
 * `canonicalHost` derives from the `PUBLIC_SITE_URL` environment variable —
 * set it in the Vercel production dashboard to the real domain. The
 * `https://dtfc.example` fallback is used in local dev when no `.env` is
 * present. One env change flips canonical, og:url, og:image, sitemap URL,
 * and robots.txt simultaneously.
 *
 * Post-launch (Cycle 8): swap `fallbackContactEmail` to the real inbox and
 * swap `ogDefaults.image` to Desirae's real OG asset.
 */
const canonicalHost = import.meta.env.PUBLIC_SITE_URL ?? 'https://dtfc.example';

export const SITE_CONFIG = {
  fallbackContactEmail: 'hello@dtfc.example',
  canonicalHost,
  ogDefaults: {
    image: '/og-default.png',
    imageAlt: 'Developmental Theatre: Fearless Creativity',
    imageWidth: 1200,
    imageHeight: 630,
  },
} as const;
