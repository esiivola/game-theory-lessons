import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    tier: z.enum(['basic', 'intermediate', 'expert', 'applied']),
    unit: z.number(),
    unitName: z.string(),
    order: z.number(), // global position for sorting the linear map
    label: z.string().optional(), // node label override, e.g. "A8"
    kind: z.enum(['lesson', 'case', 'review']).default('lesson'),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    estMinutes: z.number().default(5),
    mvp: z.boolean().default(false),
    prereqs: z.array(z.string()).default([]),
    concepts: z.array(z.string()).default([]),
    refs: z.array(z.string()).default([]),
    placement: z.string().nullable().default(null),
    anchorEmoji: z.string().optional(),
  }),
});

export const collections = { lessons };
