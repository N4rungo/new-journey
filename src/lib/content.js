import matter from 'gray-matter'
import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export function loadCollection(globPattern) {
  const modules = import.meta.glob(globPattern, { as: 'raw', eager: true })
  const items = Object.entries(modules).map(([path, raw]) => {
    const { data: frontmatter, content } = matter(raw)
    const html = marked.parse(content)
    const slug = path.split('/').pop().replace(/\.md$/, '')
    return { slug, frontmatter, html }
  })
  items.sort((a, b) => {
    const da = a.frontmatter?.date ? new Date(a.frontmatter.date).getTime() : 0
    const db = b.frontmatter?.date ? new Date(b.frontmatter.date).getTime() : 0
    if (db !== da) return db - da
    return (a.frontmatter?.title || '').localeCompare(b.frontmatter?.title || '')
  })
  return items
}

export function loadPage(globPattern) {
  const modules = import.meta.glob(globPattern, { as: 'raw', eager: true })
  const path = Object.keys(modules)[0]
  if (!path) return { html: '<p>Page non trouvée.</p>', frontmatter: {} }
  const { data: frontmatter, content } = matter(modules[path])
  const html = marked.parse(content)
  return { frontmatter, html }
}
