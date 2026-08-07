import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const briefs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/briefs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    breadcrumb: z.string(),
    eyebrow: z.string(),
    headline: z.string(),
    lede: z.string(),
    sectionClass: z.string().default('section'),
  }),
});

export const collections = { briefs };
