import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const prerender = true

const esc = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Plain RSS 2.0 feed of the posts, newest first. Built by hand to avoid a dependency.
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://irdizeneli.dev')).toString().replace(/\/$/, '')
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )
  const items = posts
    .map(
      (post) => `    <item>
      <title>${esc(post.data.title)}</title>
      <link>${base}/posts/${post.id}</link>
      <guid>${base}/posts/${post.id}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${esc(post.data.excerpt)}</description>
    </item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>vibing with irdi</title>
    <link>${base}</link>
    <description>engineering, mostly. vibes always.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
