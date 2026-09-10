import type { APIRoute } from 'astro';
import { withBase } from '@/config/site';

// Allow all crawlers and point them at the sitemap.
export const GET: APIRoute = ({ site }) => {
  const origin = (site ? site.origin : 'https://esiivola.github.io').replace(/\/$/, '');
  const body = `User-agent: *
Allow: /
Sitemap: ${origin}${withBase('sitemap.xml')}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
