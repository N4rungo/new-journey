// src/App.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, getPage } from './lib/content.js'

const BUILDINGS = [
  { id: 'chateau', label: 'Château (Projets)', x: 62, y: 28, href: '#/chateau', emoji: '🏰', desc: 'Mes projets personnels et professionnels.' },
  { id: 'caserne', label: "Caserne d'entraînement (Formations)", x: 34, y: 64, href: '#/caserne', emoji: '⚔️', desc: 'Formations, certifications et compétences clés.' },
  { id: 'auberge', label: 'Auberge (Passe-temps)', x: 20, y: 42, href: '#/auberge', emoji: '🍻', desc: 'Jeux vidéo, jeux de société et autres loisirs.' },
  { id: 'place', label: 'Place du village (Index)', x: 50, y: 52, href: '#/place', emoji: '🧭', desc: 'Index accessible de tous les lieux.' },
  { id: 'cv', label: 'Salle des archives (CV)', x: 78, y: 70, href: '#/cv', emoji: '📜', desc: 'CV imprimable.' }
]

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(!!mq.matches)
    onChange()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

const useHashRoute = () => {
  const [route, setRoute] = useState(() => window.location.hash.replace(/^#\/?/, '/') || '/')
  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#\/?/, '/') || '/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return [route, (path) => (window.location.hash = path.startsWith('#') ? path : `#${path.replace(/^#?/, '')}`)]
}

function VillageMap() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const ringAnim = {
    initial: { opacity: 0, scale: 0.8 },
    animate: prefersReducedMotion
      ? { opacity: 1, scale: 1, transition: { duration: 0 } }
      : { opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9], transition: { duration: 3, repeat: Infinity } }
  }

  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800" aria-hidden />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 rounded-2xl" aria-hidden />
      <svg className="absolute inset-0 w-full h-full" role="img" aria-label="Carte du village — sélectionnez un bâtiment pour en savoir plus" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sun" cx="15%" cy="15%" r="60%"><stop offset="0%" stopColor="#fff7d6" /><stop offset="100%" stopColor="#f1e3b0" /></radialGradient>
          <linearGradient id="river" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8ecae6" stopOpacity="0.35" /><stop offset="100%" stopColor="#219ebc" stopOpacity="0.35" /></linearGradient>
          <pattern id="grain" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="1" cy="1" r="0.15" fill="#000" opacity="0.06" /></pattern>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#sun)" />
        <path d="M-5 30 C 20 40, 40 25, 60 35 S 120 45, 110 60 L 110 70 L -5 70 Z" fill="url(#river)" />
        <rect x="0" y="0" width="100" height="100" fill="url(#grain)" opacity="0.3" />
        {BUILDINGS.map((b) => (
          <g key={b.id} transform={`translate(${b.x}, ${b.y})`}>
            <circle cx="0" cy="0" r="6" fill="#000" opacity="0" />
            <text x="0" y="1" textAnchor="middle" fontSize="6" aria-hidden>{b.emoji}</text>
          </g>
        ))}
      </svg>
      <ul className="absolute inset-0 m-0 list-none p-0">
        {BUILDINGS.map((b) => (
          <li key={b.id} style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}>
            <a href={b.href} className="group relative block rounded-xl outline-none focus-visible:ring-4 ring-amber-500/50" aria-label={b.label} title={b.label}>
              <motion.span {...ringAnim} className="absolute -inset-4 rounded-2xl shadow-[0_0_0_2px_rgba(0,0,0,0.06)] group-hover:shadow-[0_0_0_6px_rgba(245,158,11,0.35)]" />
              <span className="text-3xl select-none drop-shadow-sm" aria-hidden>{b.emoji}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="absolute left-3 bottom-3 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md rounded-xl px-3 py-2 text-sm shadow">
        <span className="font-medium">Conseil :</span> survolez ou touchez un bâtiment pour ouvrir sa page.
      </div>
    </div>
  )
}

function PageShell({ title, subtitle, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      {subtitle && <p className="text-stone-600 dark:text-stone-300 mt-1">{subtitle}</p>}
      <div className="mt-6 prose prose-stone dark:prose-invert max-w-none">{children}</div>
    </div>
  )
}

function PlacePage() {
  return (
    <PageShell title="Place du village" subtitle="Navigation alternative, accessible par liste">
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 !prose-none">
        {BUILDINGS.map((b) => (
          <li key={b.id} className="rounded-xl border border-stone-200 dark:border-stone-800 p-4 hover:shadow">
            <a href={b.href} className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>{b.emoji}</span>
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

function ProjectsPage() {
  return (
    <PageShell title="Château" subtitle="Projets (contenu Markdown)">
      <div className="grid md:grid-cols-2 gap-4 !prose-none">
        {projects.map((p) => (
          <article key={p.slug} className="rounded-xl border border-stone-200 dark:border-stone-800 p-4">
            <h3 className="font-semibold text-lg">{p.frontmatter?.title || p.slug}</h3>
            {p.frontmatter?.summary && <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">{p.frontmatter.summary}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(p.frontmatter?.stack || []).map((t) => (
                <span key={t} className="rounded-full px-2 py-1 bg-stone-100 dark:bg-stone-800">{t}</span>
              ))}
            </div>
            <div className="text-sm mt-4" dangerouslySetInnerHTML={{ __html: p.html }} />
            {p.frontmatter?.links && (
              <div className="mt-3 text-sm flex gap-4">
                {p.frontmatter.links.demo && <a className="underline" href={p.frontmatter.links.demo} target="_blank" rel="noreferrer">Démo</a>}
                {p.frontmatter.links.github && <a className="underline" href={p.frontmatter.links.github} target="_blank" rel="noreferrer">GitHub</a>}
              </div>
            )}
          </article>
        ))}
      </div>
    </PageShell>
  )
}

function MarkdownPage({ title, slug }) {
  const page = getPage(slug)
  return (
    <PageShell title={title}>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </PageShell>
  )
}

function CVPage() { return <MarkdownPage title="Salle des archives" slug="cv" /> }
function TrainingPage() { return <MarkdownPage title="Caserne d'entraînement" slug="training" /> }
function HobbiesPage() { return <MarkdownPage title="Auberge" slug="hobbies" /> }

function TopNav() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <a href="#/" className="font-black tracking-tight text-lg">🏞️ Portfolio Village</a>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <a className="hover:underline" href="#/place">Place</a>
          <a className="hover:underline" href="#/chateau">Château</a>
          <a className="hover:underline" href="#/caserne">Caserne</a>
          <a className="hover:underline" href="#/auberge">Auberge</a>
          <a className="hover:underline" href="#/cv">CV</a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-12 py-8 text-center text-sm text-stone-500">
      <p>© {new Date().getFullYear()} · Votre Nom — Fait avec React, Tailwind & Framer Motion.</p>
      <p><a className="underline" href="https://github.com" target="_blank" rel="noreferrer">Code source</a> · <a className="underline" href="#/place">Plan du site</a></p>
    </footer>
  )
}

export default function App() {
  const [route] = useHashRoute()
  const path = route || '/'

  const Page = useMemo(() => {
    switch (path) {
      case '/': return (
        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bienvenue au village</h1>
            <p className="text-stone-600 dark:text-stone-300 mt-1">Cliquez sur un bâtiment pour découvrir mon profil (contenus Markdown).</p>
          </div>
          <VillageMap />
        </main>
      )
      case '/place': return <PlacePage />
      case '/chateau': return <ProjectsPage />
      case '/caserne': return <TrainingPage />
      case '/auberge': return <HobbiesPage />
      case '/cv': return <CVPage />
      default: return (
        <PageShell title="Page introuvable" subtitle="La destination demandée n'existe pas (404)">
          <a className="underline" href="#/">Retour à la carte</a>
        </PageShell>
      )
    }
  }, [path])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
      <TopNav />
      <AnimatePresence mode="wait">{Page}</AnimatePresence>
      <Footer />
    </div>
  )
}
