import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { withBase } from '@/config/site';

// Static sitemap of every lesson plus the top-level views, so search engines
// can discover all pages. Absolute URLs are built from the configured site origin.
export const GET: APIRoute = async ({ site }) => {
  const origin = (site ? site.origin : 'https://esiivola.github.io').replace(/\/$/, '');
  const lessons = await getCollection('lessons');
  const paths = [
    withBase(''),
    withBase('map'),
    withBase('progress'),
    ...lessons.map((l) => withBase('lessons/' + l.id)),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
