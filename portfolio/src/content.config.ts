import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    year: z.number(),
    order: z.number(),
    tags: z.array(z.enum(['agents', 'ml', 'fullstack', 'research'])),
    flag: z.string().optional(),
    metric: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    hasPage: z.boolean(),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    lede: z.string().optional(),
    facts: z.record(z.string()).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    images: z.array(z.object({
      src: z.string(), alt: z.string(), caption: z.string().optional(),
    })).optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    readingTime: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  }),
});

export const collections = { projects, writing };
