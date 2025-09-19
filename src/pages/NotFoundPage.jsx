import PageShell from '../components/PageShell'

export default function NotFoundPage({ path = '' }) {
  // récupère le ?to=... éventuel (quand on vient de public/404.html)
  const params = new URLSearchParams(location.hash.split('?')[1] || '')
  const to = params.get('to') || path

  return (
    <PageShell title="Page introuvable" subtitle="La page que vous cherchez est dans un autre château (404)">
      {to && (
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Chemin demandé : <code>{decodeURIComponent(to)}</code>
        </p>
      )}
      <p className="mt-4">
        <a className="underline" href="#/">Retour au village</a>
      </p>
    </PageShell>
  )
}
