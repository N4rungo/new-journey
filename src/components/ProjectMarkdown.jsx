// src/components/ProjectMarkdown.jsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
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
      rehypePlugins={[rehypeRaw]}
      components={{
        a({ node, href = '', ...props }) {
          const url = resolveProjectLink(slug, href)
          const isExternal = /^https?:\/\//i.test(url)
          return (
            <a
              href={url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer' : undefined}
              className="underline decoration-dashed underline-offset-2 hover:decoration-solid"
              {...props}
            />
          )
        },
        img({ node, src = '', alt = '', ...props }) {
          const url = resolveProjectLink(slug, src)
          return <img src={url} alt={alt} className="rounded-lg border border-stone-200 dark:border-stone-700 max-w-full h-auto" {...props} />
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
  )
}