import { defineConfig } from 'astro/config'
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
  build: {
    format: 'directory',
  },
})
