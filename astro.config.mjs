import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Deployed as a GitHub Pages project site at https://<user>.github.io/game-theory-lessons/.
// site + base are inferred from esiivola.github.io; change `site` if the account differs.
export default defineConfig({
  site: 'https://esiivola.github.io',
  base: '/game-theory-lessons',
  trailingSlash: 'ignore',
  integrations: [mdx(), svelte()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
