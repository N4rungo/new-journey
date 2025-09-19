// src/lib/content.js
import YAML from 'yaml'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

// Parse front-matter YAML (--- ... ---) + Markdown -> HTML
export function parseFrontMatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/) // front-matter au début du fichier
  let frontmatter = {}
  let body = raw
  if (m) {
    try {
      frontmatter = YAML.parse(m[1]) || {}
    } catch {
      frontmatter = {}
    }
    body = raw.slice(m[0].length)
  }
  const html = marked.parse(body)
  return { frontmatter, body, html }
}

// ✅ Collections chargées à build-time (arguments littéraux)
const projectsMap = import.meta.glob('/content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function numOr(x, fallback) {
  const n = Number(x)
  return Number.isFinite(n) ? n : fallback
}
function dateMs(x) {
  const t = Date.parse(x)
  return Number.isFinite(t) ? t : 0
}

export const projects = Object.entries(projectsMap)
  .map(([path, raw]) => {
    const { frontmatter, html } = parseFrontMatter(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    return { slug, frontmatter, body, html }
  })
  // masquer ceux avec hidden: true
  .filter((p) => !p.frontmatter?.hidden)

  .sort((a, b) => {
    // 1) pinned d'abord
    const pa = !!a.frontmatter?.pinned
    const pb = !!b.frontmatter?.pinned
    if (pa !== pb) return pb - pa

    // 2) order croissant (1,2,3...) ; non défini = +∞ (passe après)
    const wa = numOr(a.frontmatter?.order, Infinity)
    const wb = numOr(b.frontmatter?.order, Infinity)
    if (wa !== wb) return wa - wb

    // 3) date décroissante (plus récent en premier)
    const da = dateMs(a.frontmatter?.date)
    const db = dateMs(b.frontmatter?.date)
    if (db !== da) return db - da

    // 4) titre (fallback stable)
    return (a.frontmatter?.title || '').localeCompare(b.frontmatter?.title || '')
  })

const pagesMap = import.meta.glob('/content/pages/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const parsedPages = Object.fromEntries(
  Object.entries(pagesMap).map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '') // 'cv', 'training', 'hobbies'
    return [slug, parseFrontMatter(raw)]
  }),
)

export function getPage(slug) {
  return parsedPages[slug] || { frontmatter: {}, html: '<p>Page non trouvée.</p>' }
}

// Toutes les pièces jointes possibles (PDF/vidéo/images/zip…)
export const PROJECT_ASSETS = import.meta.glob(
  '/content/projects/**/*.{pdf,mp4,webm,zip,png,jpg,jpeg,gif,webp}',
  { eager: true, query: '?url', import: 'default' },
)

export const PAGES_ASSETS = import.meta.glob(
  '/content/pages/**/*.{pdf,mp4,webm,zip,png,jpg,jpeg,gif,webp}',
  { eager: true, query: '?url', import: 'default' }
)

// Joindre et normaliser un chemin type URL (gère ./ et ../)
function joinNormalize(base, rel) {
  const parts = (base.replace(/\/+$/, '') + '/' + rel).split('/')
  const out = []
  for (const p of parts) {
    if (!p || p === '.') continue
    if (p === '..') out.pop()
    else out.push(p)
  }
  return '/' + out.join('/')
}

/**
 * Resolve des liens relatifs du markdown projet
 * - Cas 1: projet dans un DOSSIER: /content/projects/<slug>/index.md  → "./file.ext"
 * - Cas 2: projet en FICHIER:      /content/projects/<slug>.md        → "../<FOLDER>/file.ext"
 */
export function resolveProjectLink(slug, href) {
  if (!href || /^https?:\/\//i.test(href) || href.startsWith('#')) return href

  // 1) suppose dossier "/content/projects/<slug>/**"
  const key1 = joinNormalize(`/content/projects/${slug}/`, href)
  if (PROJECT_ASSETS[key1]) return PROJECT_ASSETS[key1]

  // 2) permet "../LGMS/file.pdf" depuis "/content/projects/<slug>.md"
  const key2 = joinNormalize('/content/projects/', href)
  if (PROJECT_ASSETS[key2]) return PROJECT_ASSETS[key2]

  // fallback: laisse le lien tel quel (utile pendant l’édition)
  return href
}

export function resolvePageLink(slug, href) {
  if (!href || /^https?:\/\//i.test(href) || href.startsWith('#')) return href
  // page dans un dossier: /content/pages/<slug>/index.md → "./file.ext"
  const key1 = joinNormalize(`/content/pages/${slug}/`, href)

  if (PAGES_ASSETS[key1]) return PAGES_ASSETS[key1]
  // page à la racine: /content/pages/<slug>.md → "../<folder>/file.ext"
  const key2 = joinNormalize('/content/pages/', href)

  if (PAGES_ASSETS[key2]) return PAGES_ASSETS[key2]
  return href
}