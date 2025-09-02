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
  const html = marked.parse(body)
  return { frontmatter, html }
}

// ✅ Collections chargées à build-time (arguments littéraux)
const projectsMap = import.meta.glob('/content/projects/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const projects = Object.entries(projectsMap)
  .map(([path, raw]) => {
    const { frontmatter, html } = parseFrontMatter(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    return { slug, frontmatter, html }
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
