# spinlock

Systems nerd vs. student debt. Shipping indie products until one wins. Building in public.

The personal blog of Irdi Zeneli, live at [irdizeneli.dev](https://irdizeneli.dev).
On X as [@spinlock_01](https://x.com/spinlock_01).

The design is a 1991 photocopied Berlin rave flyer: true black, grain, stacked uppercase type,
and one Claude Monet painting per page. The terminal block and the debt bar copy the X banner.
Every post is typed by hand. No model drafts it and no model polishes it.

Built with [Astro](https://astro.build) 5 and one stylesheet. Hosted on Vercel.

## structure

```
src/
  site.ts                # site name, bio, links, debt numbers (the only place for these)
  lib/paintings.ts       # the Monet painting registry (url, size, credit, alt, crop)
  lib/posts.ts           # published posts, newest first (drafts show in dev only)
  lib/stats.ts           # Upstash Redis counters for views and likes
  content/posts/         # markdown posts (one .md per post)
  content.config.ts      # frontmatter schema
  components/            # Nav, Footer, ArtPanel, Wordmark, Terminal, DebtTracker, FollowBar
  layouts/Layout.astro   # base layout, fonts, OG / Twitter meta, Vercel Analytics
  pages/index.astro      # home: painting split, terminal, projects, posts
  pages/posts/[...slug]  # post page: sticky painting, views, likes, share on linkedin
  pages/404.astro
  pages/rss.xml.ts       # hand-built RSS 2.0 feed
  pages/api/             # views, likes, stats, linkedin share redirect
  styles/global.css      # all styling lives here
scripts/
  og-default.html        # OG card template (1200x630)
  gen-og.sh              # renders OG cards to public/og-*.png with headless Chrome
public/
  og-default.png, favicon.svg, me.jpg
```

## dev

```sh
npm install
npm run dev          # http://localhost:4321
npx astro check      # type check
npm run build
```

## writing a new post

1. Add a markdown file at `src/content/posts/<slug>.md`. The slug must be lowercase letters,
   digits and dashes.
2. Frontmatter (`subtitle`, `tags`, `ogImage` and `draft` are optional):
   ```yaml
   ---
   title: my new post
   subtitle: a short one-line hook
   date: 2026-06-01
   excerpt: shows on the home page and as og:description
   tags: [whatever, you, want]
   ogImage: /og-mypost.png   # falls back to /og-spinlock.jpg
   draft: true               # shows in npm run dev only, never in a build
   ---
   ```
3. Optional: add a per-post OG card. Copy `scripts/og-default.html` to `scripts/og-mypost.html`,
   edit it, add `render og-mypost` to `scripts/gen-og.sh`, then run `npm run og`.

## updating the debt tracker

Edit `DEBT_PAID` in `src/site.ts` when a payment lands. Also edit `PAID` in the X banner
script (`make_banner.py`) so the site and the banner show the same number.

## paintings

All paintings are by Claude Monet (died 1926) and are in the public domain. The files come from
Wikimedia Commons and are self-hosted in `public/art/` as WebP at 640, 1280 and 1920 px wide.
`src/lib/paintings.ts` holds each painting's file name, size, credit line, alt text and crop
point. To change a painting, add the three files and edit only that registry.

| page | painting | museum |
|---|---|---|
| home | San Giorgio Maggiore at Dusk, 1908 | Fondation Beyeler |
| post | The Houses of Parliament, Sunset, 1903 | National Gallery of Art, Washington |
| 404 | The Magpie, 1868-69 | Musée d'Orsay, Paris |

## Open Graph images

```sh
npm run og
```

Renders every listed `scripts/og-*.html` template into `public/<name>.png` at 1200x630 with
headless Chrome. It finds Chrome on macOS, Linux (`google-chrome`, `chromium`) and Windows
(Git Bash). No npm dependencies.

## views and likes

Each post counts unique views and likes in Upstash Redis (free tier). Copy `.env.example` to
`.env.local` for local dev and fill in `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
On Vercel, add the same variables in Project Settings. Without them the counters show 0.

A per-browser id in `localStorage` (`vw_uid`) dedupes views and likes. Do not rename the key.

## share on linkedin

The share button on each post goes to `/api/linkedin/start`, which redirects to LinkedIn's
standard share dialog with the post URL. The reader writes the caption in LinkedIn. No OAuth,
no API keys.

## deploy

Hybrid build: pages are prerendered, `/api/*` routes run as Vercel serverless functions.
Connect the GitHub repo in Vercel, or run `vercel` with the Vercel CLI.

## license

[MIT](LICENSE). Copyright (c) 2025-2026 Irdi Zeneli. The paintings are public domain.
