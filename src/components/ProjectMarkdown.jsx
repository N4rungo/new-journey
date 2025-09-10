// src/components/ProjectMarkdown.jsx
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { resolveProjectLink } from '../lib/content' // ← tu l'as ajouté dans content.js

/**
 * Rend un Markdown de projet et réécrit href/src relatifs (./brochure.pdf, ./demo.mp4, ./img.png)
 * pour pointer vers les bons fichiers buildés par Vite.
 *
 * @param {string} slug - dossier du projet dans content/projects/<slug>
 * @param {string} markdown - le texte markdown (déjà chargé)
 */
export default function ProjectMarkdown({ slug, markdown }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a({ href = '', ...props }) {
          const url = resolveProjectLink(slug, href)
          const isExternal = /^https?:\/\//i.test(url)
          return (
            <a
              href={url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              className="underline decoration-2 underline-offset-2 decoration-stone-400/60 dark:decoration-stone-500/60 hover:decoration-stone-400 dark:hover:decoration-stone-400"
              {...props}
            />
          )
        },
        img({ src = '', alt = '', ...props }) {
          const url = resolveProjectLink(slug, src)
          return (
            <img
              src={url}
              alt={alt}
              className="rounded-lg border border-stone-200 dark:border-stone-700 max-w-full h-auto"
              {...props}
            />
          )
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}
