import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Read PUBLIC_SITE_URL from the environment or from a local .env file.
 * This runs at config-eval time (before Vite processes .env), so we
 * parse the file ourselves when the env var is not already set.
 * Fallback: https://dtfc.example (placeholder, used in local dev with no .env).
 */
function getSiteUrl() {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL;
  try {
    const envText = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    const match = envText.match(/^PUBLIC_SITE_URL=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // No .env file — fall through to placeholder
  }
  return 'https://dtfc.example';
}

const siteUrl = getSiteUrl();

export default defineConfig({
  site: siteUrl,
  integrations: [mdx(), sitemap(), preact()],
  vite: { plugins: [tailwindcss()] },
});
