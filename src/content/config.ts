import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const archives = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/archives" }),
  schema: z.object({}).optional()
});

export const collections = { archives };
