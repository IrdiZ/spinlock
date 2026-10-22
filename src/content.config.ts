import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    // Optional per-post OG image override. Falls back to the default card.
    ogImage: z.string().optional(),
    // Optional painting key from src/lib/paintings.ts. Falls back to the default post painting.
    painting: z.string().optional(),
    // Draft posts render in `astro dev` only. See src/lib/posts.ts.
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts }
