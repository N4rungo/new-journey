import PageShell from '../components/PageShell'
import { BUILDINGS } from '../lib/constants'

export default function PlacePage() {
  return (
    <PageShell title="Place du village" subtitle="Accédez au contenu du site">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 !prose-none">
        {BUILDINGS.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 hover:shadow"
          >
            <a href={b.href} className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                {b.emoji}
              </span>
              <span>
                <span className="font-semibold block">{b.label}</span>
                <span className="text-sm text-stone-600 dark:text-stone-400">{b.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
