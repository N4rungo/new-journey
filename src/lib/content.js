// src/lib/content.js
import YAML from 'yaml'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

// Parse front-matter YAML (--- ... ---) + Markdown -> HTML
function parseFrontMatter(raw) {
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
  /* const html = marked.parse(body)
  return { frontmatter, html } */
  const html = marked.parse(body)
  return { frontmatter, body, html }  // ← on expose aussi le body brut
}

// ✅ Collections chargées à build-time (arguments littéraux)
const projectsMap = import.meta.glob('/content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const projects = Object.entries(projectsMap)
  .map(([path, raw]) => {
    /* const { frontmatter, html } = parseFrontMatter(raw) */
    const { frontmatter, body, html } = parseFrontMatter(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    /* return { slug, frontmatter, html } */
    return { slug, frontmatter, body, html } // ← ajoute body
  })
  .sort((a, b) => {
    const da = a.frontmatter?.date ? new Date(a.frontmatter.date).getTime() : 0
    const db = b.frontmatter?.date ? new Date(b.frontmatter.date).getTime() : 0
    if (db !== da) return db - da
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
  })
)

export function getPage(slug) {
  return parsedPages[slug] || { frontmatter: {}, html: '<p>Page non trouvée.</p>' }
}

// Toutes les pièces jointes possibles (PDF/vidéo/images/zip…)
export const PROJECT_ASSETS = import.meta.glob(
  '/content/projects/**/*.{pdf,mp4,webm,zip,png,jpg,jpeg,gif,webp}',
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