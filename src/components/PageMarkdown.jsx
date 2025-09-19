// src/components/PageMarkdown.jsx
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { resolvePageLink } from '../lib/content'

export default function PageMarkdown({ slug, markdown = '' }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        a({ href = '', ...props }) {
          const url = resolvePageLink(slug, href)
          const ext = /^https?:\/\//i.test(url)
          return (
            <a
              href={url}
              target={ext ? '_blank' : undefined}
              rel={ext ? 'noreferrer' : undefined}
              className="link-solid"
              {...props}
            />
          )
        },
        img({ src = '', alt = '', ...props }) {
          const url = resolvePageLink(slug, src)
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
