// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://outreach-ar.netlify.app',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
  },
});
