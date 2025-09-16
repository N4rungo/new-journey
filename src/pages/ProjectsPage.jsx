import ProjectMarkdown from '../components/ProjectMarkdown'
import { projects, resolveProjectLink } from '../lib/content'

function FrontmatterLinks({ links, slug }) {
  if (!links) return null
  const entries = Object.entries(links)
  if (!entries.length) return null
  return (
    <div className="mt-3 text-sm flex flex-wrap gap-4">
      {entries.map(([key, href]) => {
        const url = resolveProjectLink(slug, String(href))
        const external = /^https?:\/\//i.test(url)
        const label = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replace('Presentation', 'Présentation')
          .replace('Cv', 'CV')
        return (
          <a
            key={key}
            href={url}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
            className="link-solid"
          >
            {label}
          </a>
        )
      })}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-hero text-4xl md:text-5xl tracking-wide title-outline">Château</h1>
      <p className="font-medieval text-stone-600 dark:text-stone-300 mt-1">
        Liste de projets (en construction)
      </p>

      <div className="grid md:grid-cols-2 gap-4 !prose-none mt-6">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="rounded-xl border border-stone-200 dark:border-stone-800 p-4"
          >
            <h3 className="font-semibold text-lg">{p.frontmatter?.title || p.slug}</h3>
            {p.frontmatter?.summary && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {p.frontmatter.summary}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(p.frontmatter?.stack || []).map((t) => (
                <span key={t} className="rounded-full px-2 py-1 bg-stone-100 dark:bg-stone-800">
                  {t}
                </span>
              ))}
            </div>
            <div className="text-sm mt-4 prose prose-stone dark:prose-invert max-w-none">
              <ProjectMarkdown slug={p.slug} markdown={p.body || ''} />
            </div>
            <FrontmatterLinks links={p.frontmatter?.links} slug={p.slug} />
          </article>
        ))}
      </div>
    </div>
  )
}
