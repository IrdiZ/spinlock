// Snapshots my git stats for every entry in src/content/projects.yaml into
// src/data/project-stats.json, keyed by entry slug. The /projects page reads the snapshot, so a
// build never calls GitHub. Run by hand after a project moves: `npm run project-stats`.
//
// The snapshot also records whether GitHub says a repo is private. The page links to GitHub only
// when it is not, so a private repo can never get a link by mistake.
// Needs the GitHub CLI, logged in as the owner.
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const OWNER = 'IrdiZ'
// Commits count as mine when GitHub links them to my login, or the author name is one of mine:
// my university accounts (I6350932, "Zeneli, Irdi (Stud. DACS)"), and `root`, the coding VM I push from.
const MY_LOGINS = new Set(['IrdiZ'])
const MY_NAMES = new Set(['irdi zeneli', 'irdi', 'irdiz', 'i6350932', 'zeneli, irdi (stud. dacs)', 'root'])
// Machine syncs between my two computers, not work. They would fake activity.
const SYNC = /^WIP: sync from/
// A language under this share of a repo is noise (a stray script, a generated file).
const MIN_LANGUAGE_PCT = 10

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const yaml = readFileSync(join(root, 'src/content/projects.yaml'), 'utf8')

// Just enough YAML: top-level `slug:` lines and their indented `repo: a, b` line.
const entries = {}
let slug = null
for (const line of yaml.split(/\r?\n/)) {
  const top = line.match(/^([\w-]+):\s*$/)
  if (top) slug = top[1]
  const repo = line.match(/^\s+repo:\s*(.+?)\s*$/)
  if (slug && repo) entries[slug] = repo[1].split(',').map((r) => r.trim()).filter(Boolean)
}

const api = (path) => JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8' }))
function pages(path) {
  try {
    // --slurp wraps each page in an outer array
    return JSON.parse(execFileSync('gh', ['api', '--paginate', '--slurp', path], { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] })).flat()
  } catch (e) {
    // an empty repo answers 409; count it as no commits instead of stopping the run
    if (String(e.stderr).includes('409')) return []
    throw e
  }
}
const isMine = (c) => MY_LOGINS.has(c.author?.login) || MY_NAMES.has(c.commit.author.name.toLowerCase())

const out = {}
for (const [s, repos] of Object.entries(entries)) {
  let total = 0
  let hidden = false
  const mine = []
  const bytes = {}
  for (const repo of repos) {
    hidden ||= api(`repos/${OWNER}/${repo}`).private
    const commits = pages(`repos/${OWNER}/${repo}/commits?per_page=100`).filter((c) => !SYNC.test(c.commit.message))
    total += commits.length
    mine.push(...commits.filter(isMine).map((c) => c.commit.author.date.slice(0, 10)))
    for (const [lang, n] of Object.entries(api(`repos/${OWNER}/${repo}/languages`))) bytes[lang] = (bytes[lang] ?? 0) + n
  }
  const months = {}
  for (const d of mine) months[d.slice(0, 7)] = (months[d.slice(0, 7)] ?? 0) + 1
  const size = Object.values(bytes).reduce((a, b) => a + b, 0) || 1
  out[s] = {
    // true when any of the entry's repos is private: then no repo of it gets a link
    private: hidden,
    commits: mine.length,
    total,
    // days with at least one of my commits; a later history clean-up adds one day, not years
    days: new Set(mine).size,
    months,
    languages: Object.entries(bytes)
      .filter(([, n]) => (n / size) * 100 >= MIN_LANGUAGE_PCT)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name),
  }
  console.log(`${s}: ${mine.length} of ${total} commits are mine${hidden ? ' (private)' : ''}`)
}

const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(join(root, 'src/data/project-stats.json'), JSON.stringify(sorted, null, 2) + '\n')
console.log(`done: ${Object.keys(out).length} entries written to src/data/project-stats.json`)
