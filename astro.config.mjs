import { defineConfig, passthroughImageService } from 'astro/config'
import vercel from '@astrojs/vercel'
import sitemap from '@astrojs/sitemap'

// Update this once the production URL is known. Used for canonical URLs and
// social-card og:url so LinkedIn / Twitter cards point at the right place.
const SITE = process.env.SITE ?? 'https://irdizeneli.dev'

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  output: 'server',
  adapter: vercel(),
  // Lists the prerendered pages for search engines. /api/* is never prerendered, so it stays out.
  integrations: [sitemap()],
  // The site ships ready-made images and never uses astro:assets. Without this, the /_image
  // endpoint runs sharp on request, and sharp's AVIF decoder has a remote code execution bug
  // (GHSA-26w7-cxv4-gfx2, fixed only in Astro 7.2.8). Passthrough serves files as they are.
  image: { service: passthroughImageService() },
  build: {
    format: 'directory',
  },
})
