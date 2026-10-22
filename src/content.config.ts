import { defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'
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

// The /projects timeline. One YAML file, keyed by slug. Field notes are at the top of the file.
const projects = defineCollection({
  loader: file('src/content/projects.yaml'),
  schema: z.object({
    name: z.string(),
    date: z.coerce.date(),
    precision: z.enum(['day', 'month', 'year']).default('day'),
    chapter: z.enum(['tirana', 'maastricht', 'startup', 'everything', 'public']),
    type: z.enum(['project', 'milestone']).default('project'),
    size: z.enum(['feature', 'bside']).default('feature'),
    kind: z.string().optional(),
    stack: z.string().optional(),
    blurb: z.string(),
    // one short line for the home page panes; only the projects picked there need it
    teaser: z.string().optional(),
    repo: z.string().optional(),
    source: z.url().optional(),
    post: z.string().optional(),
    media: z
      .object({
        src: z.string().optional(),
        video: z.string().optional(),
        poster: z.string().optional(),
        // drawings in src/components/ProjectArt.astro
        art: z
          .enum(['green-routes', 'voice-cockpit', 'vox', 'albsub', 'ct-jarvis', 'tirana-events', 'control-room'])
          .optional(),
        alt: z.string(),
      })
      .optional(),
    commit: z.string().optional(),
    commitNote: z.string().optional(),
    team: z.string().optional(),
    tone: z.enum(['start', 'move', 'win', 'end']).optional(),
    now: z.boolean().default(false),
    manual: z
      .object({
        commits: z.number().optional(),
        total: z.number().optional(),
        lines: z.number().optional(),
        note: z.string().optional(),
      })
      .optional(),
  }),
})

export const collections = { posts, projects }
