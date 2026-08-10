import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://dtfc.example.org',
  integrations: [mdx(), sitemap(), preact()],
});
