import { getCollection, type CollectionEntry } from 'astro:content'
import snapshot from '../data/project-stats.json'
import { SITE_GITHUB_URL } from '../site'

// The /projects timeline: chapters, entries joined with their git stats, and the page totals.
// Entries live in src/content/projects.yaml. Stats come from the snapshot that
// scripts/project-stats.mjs writes, keyed by entry slug, so a build never calls GitHub.

export type ChapterId = CollectionEntry<'projects'>['data']['chapter']

export const chapters: { id: ChapterId; no: string; title: string; years: string; line: string }[] = [
  {
    id: 'tirana',
    no: '01',
    title: 'tirana',
    years: '2021 to 2023',
    line: 'high school in tirana. code for albania, one summer of tiny web apps, and 2nd place at a national hackathon.',
  },
  {
    id: 'maastricht',
    no: '02',
    title: 'maastricht',
    years: '2023 to 2024',
    line: 'moved to the netherlands for computer science. a lot of java, a lot of group projects.',
  },
  {
    id: 'startup',
    no: '03',
    title: 'the startup year',
    years: '2025',
    line: 'fewer repos, bigger ones. led a team, co-founded a company.',
  },
  {
    id: 'everything',
    no: '04',
    title: 'everything at once',
    years: 'jan to sep 2026',
    line: 'a startup, a job, a hackathon win, a blog, and voice in everything.',
  },
  {
    id: 'public',
    no: '05',
    title: 'in public',
    years: 'oct 2026 to now',
    line: 'no job, €20k of debt, and the rule: ship in public until something pays.',
  },
]

interface Stats {
  private: boolean
  // my commits; `total` counts the whole team
  commits: number
  total: number
  days: number
  months: Record<string, number>
  languages: string[]
}

const stats = snapshot as Record<string, Stats>

export interface Link {
  label: string
  href: string
}

export interface TimelineEntry {
  id: string
  data: CollectionEntry<'projects'>['data']
  // my commits, and the team's when that is more
  commits?: number
  total?: number
  days?: number
  links: Link[]
  // why there is no code link: a 'private' repo, or 'local' work with nothing to link at all
  closed?: 'private' | 'local'
}

const monthOf = (d: Date) => d.toISOString().slice(0, 7)

function enrich(entry: CollectionEntry<'projects'>): TimelineEntry {
  const d = entry.data
  const s = stats[entry.id]
  if (d.repo && !s) throw new Error(`projects: no stats for "${entry.id}". Run npm run project-stats.`)

  // none of the commits are mine (a club repo): show the team's count, never "0 of 152"
  const commits = d.manual?.commits ?? (s?.commits || undefined)
  const total = d.manual?.commits !== undefined ? d.manual.total : s?.total
  // a manual count replaces git, so the git day count would not match it
  const days = d.manual?.commits !== undefined ? undefined : s?.days

  // GitHub, via the snapshot, decides what is public. A private repo never gets a link.
  const open = Boolean(d.repo && s && !s.private)
  const links: Link[] = []
  if (open) links.push({ label: 'github', href: `${SITE_GITHUB_URL}/${d.repo!.split(',')[0].trim()}` })
  if (d.source) links.push({ label: 'team repo', href: d.source })
  if (d.post) links.push({ label: 'post', href: `/posts/${d.post}` })

  // An inert stamp instead: "private repo", or "no public link" when nothing else links out.
  let closed: TimelineEntry['closed']
  if (d.type === 'project' && !open && !d.source) {
    if (d.repo) closed = 'private'
    else if (!links.length) closed = 'local'
  }

  return { id: entry.id, data: d, commits, total: total && total > (commits ?? 0) ? total : undefined, days: commits ? days : undefined, links, closed }
}

// Oldest first: the page reads like a story. Work still in progress closes it.
export async function getTimeline() {
  const entries = await getCollection('projects')
  return entries
    .sort(
      (a, b) =>
        Number(a.data.now) - Number(b.data.now) ||
        a.data.date.getTime() - b.data.date.getTime() ||
        a.data.name.localeCompare(b.data.name),
    )
    .map(enrich)
}

// My commits per month, from the first entry's month to this one. Manual counts land in the
// entry's own month, so the bars add up to the headline number.
export function monthly(entries: TimelineEntry[]) {
  const counts: Record<string, number> = {}
  const add = (m: string, n: number) => (counts[m] = (counts[m] ?? 0) + n)
  for (const e of entries) {
    if (e.data.manual?.commits !== undefined) add(monthOf(e.data.date), e.data.manual.commits)
    else for (const [m, n] of Object.entries(stats[e.id]?.months ?? {})) add(m, n)
  }
  const start = entries.reduce((a, e) => (e.data.date < a ? e.data.date : a), new Date())
  const now = new Date()
  const month = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const months: { key: string; n: number }[] = []
  while (month <= end) {
    const key = monthOf(month)
    months.push({ key, n: counts[key] ?? 0 })
    month.setUTCMonth(month.getUTCMonth() + 1)
  }
  return months
}

// Header numbers. Commits are the sum of the same bars the waveform draws.
export function totals(entries: TimelineEntry[], months: { n: number }[]) {
  const projects = entries.filter((e) => e.data.type === 'project')
  const first = entries.reduce((a, e) => (e.data.date < a ? e.data.date : a), new Date())
  const languages = new Set(projects.flatMap((e) => stats[e.id]?.languages ?? []))
  return {
    projects: projects.length,
    commits: months.reduce((n, m) => n + m.n, 0),
    years: new Date().getFullYear() - first.getFullYear(),
    languages: languages.size,
  }
}

// "2022-11-03", "2023-09" or "2023", as precise as the entry knows. Valid for <time datetime>
// and for schema.org dates.
export function when(date: Date, precision: 'day' | 'month' | 'year') {
  const iso = date.toISOString().slice(0, 10)
  return precision === 'day' ? iso : precision === 'month' ? iso.slice(0, 7) : iso.slice(0, 4)
}

export const fmt = (n: number) => n.toLocaleString('en-US')
