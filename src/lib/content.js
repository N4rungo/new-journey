// src/lib/content.js
import matter from 'gray-matter'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

function parseMarkdownRaw(raw) {
  const { data: frontmatter, content } = matter(raw)
  const html = marked.parse(content)
  return { frontmatter, html }
}

/** Projects collection (chargée à build-time) */
const projectsMap = import.meta.glob('/content/projects/*.md', { as: 'raw', eager: true })
export const projects = Object.entries(projectsMap)
  .map(([path, raw]) => {
    const { frontmatter, html } = parseMarkdownRaw(raw)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    return { slug, frontmatter, html }
  })
  .sort((a, b) => {
    const da = a.frontmatter?.date ? new Date(a.frontmatter.date).getTime() : 0
    const db = b.frontmatter?.date ? new Date(b.frontmatter.date).getTime() : 0
    if (db !== da) return db - da
    return (a.frontmatter?.title || '').localeCompare(b.frontmatter?.title || '')
  })

/** Pages simples (CV, training, hobbies) */
const pagesMap = import.meta.glob('/content/pages/*.md', { as: 'raw', eager: true })
const parsedPages = Object.fromEntries(
  Object.entries(pagesMap).map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '') // ex: 'cv'
    return [slug, parseMarkdownRaw(raw)]
  })
)

/** Récupérer une page par slug (ex: 'cv', 'training', 'hobbies') */
export function getPage(slug) {
  return parsedPages[slug] || { frontmatter: {}, html: '<p>Page non trouvée.</p>' }
}
