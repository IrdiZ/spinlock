// Prints one line per published post for gen-og.sh: "<slug>\t<query string for og-post.html>".
// Reads the frontmatter and the painting registry directly, so cards always match the site.
// Needs Node 22.18+ (imports the .ts registry with built-in type stripping).
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { paintings } from '../src/lib/paintings.ts'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/content/posts')

// Just enough YAML for our frontmatter: scalars, quoted strings, and ["a", "b"] lists.
function frontmatter(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const data = {}
  if (!m) return data
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (!kv) continue
    const [, k, raw] = kv
    data[k] = raw.startsWith('[') ? JSON.parse(raw) : raw.replace(/^"(.*)"$/, '$1')
  }
  return data
}

for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
  const d = frontmatter(readFileSync(join(dir, file), 'utf8'))
  if (d.draft === 'true') continue
  const art = paintings[d.painting] ?? paintings.post
  const q = new URLSearchParams({
    title: d.title ?? '',
    date: String(d.date ?? ''),
    tags: (d.tags ?? []).join(' / '),
    art: art.url.replace(/^\/art\//, '').replace(/-1920\.webp$/, ''),
    credit: art.credit,
  })
  console.log(`${file.replace(/\.md$/, '')}\t${q}`)
}
