import PageShell from '../components/PageShell'
import { getPage } from '../lib/content'

/* export default function MarkdownPage({ title, slug }) {
  const page = getPage(slug)
  return (
    <PageShell title={title}>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageShell>
  )
} */

import PageMarkdown from '../components/PageMarkdown'
export default function MarkdownPage({ title, slug }) {
  const page = getPage(slug)
  return (
    <PageShell title={title}>
      <div className="prose prose-stone dark:prose-invert max-w-none
                       prose-headings:font-hero prose-h2:mt-6 prose-h2:mb-2">
        <PageMarkdown slug={slug} markdown={page.body || ''} />
      </div>
    </PageShell>
  )
}