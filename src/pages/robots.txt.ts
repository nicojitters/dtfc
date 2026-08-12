import type { APIRoute } from 'astro';
import { SITE_CONFIG } from '@/lib/site-config';

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_CONFIG.canonicalHost}/sitemap-index.xml
`;
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
