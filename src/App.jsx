// src/App.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, getPage } from './lib/content.js'

const BUILDINGS = [
  { id: 'chateau',  label: 'Château (Projets)',            x: 23, y: 36, href: '#/chateau',  icon: 'castle',   desc: 'Mes projets personnels…' },
  { id: 'caserne',  label: "Caserne (Formations)",       x: 68, y: 55, href: '#/caserne',  icon: 'barracks', desc: 'Formations, compétences…' },
  { id: 'auberge',  label: 'Auberge (Passe-temps)',        x: 66, y: 30, href: '#/auberge',  icon: 'tavern',   desc: 'Jeux vidéo & société…' },
  { id: 'place',    label: 'Place du village (Index)',     x: 40, y: 30, href: '#/place',    icon: 'plaza',    desc: 'Index accessible.' },
  { id: 'cv',       label: 'Salle des archives (CV)',      x: 50, y: 20, href: '#/cv',       icon: 'archives', desc: 'CV imprimable.' },
  // { id: 'biblio', label: 'Bibliothèque', x: 58, y: 60, href: '#/biblio', icon: 'book', desc: 'Lectures, notes.' },
];


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

function useKey(key, fn) {
  React.useEffect(() => {
    const on = (e) => {
      if (e.key.toLowerCase() === key.toLowerCase()) fn(e)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [key, fn])
}

function VillageMap() {
  const [showGrid, setShowGrid] = React.useState(false);
  useKey('g', () => setShowGrid(s => !s));

  const base = import.meta.env.BASE_URL

  const prefersReducedMotion = usePrefersReducedMotion()
  const ringAnim = {
    initial: { opacity: 0, scale: 0.8 },
    animate: prefersReducedMotion
      ? { opacity: 1, scale: 1, transition: { duration: 0 } }
      : { opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9], transition: { duration: 3, repeat: Infinity } }
  }

  const spriteUrl = base + 'sprites/ui-32.png';
  //const spriteUrl = (window.devicePixelRatio || 1) > 1
  // ? base + 'sprites/ui-32.png'
  // : base + 'sprites/ui-16.png';

  const haloUrl = (window.devicePixelRatio || 1) > 1
   ? base + 'sprites/halo-32.png'
   : base + 'sprites/halo-16.png';

  return (
     <div className="relative w-full aspect-[1/1] rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800" aria-hidden />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-black/10 rounded-2xl" aria-hidden />

	    <img
	      src={base + 'map/village02.png'}
	      srcSet={`${base}map/village02.png 1x, ${base}map/village02.png 2x`}
	      alt=""
	      className="absolute inset-0 w-full h-full object-cover pixelated"
	      aria-hidden
	    />

	{showGrid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 5,
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,.25), rgba(0,0,0,.25) 1px, transparent 1px, transparent 16px), ' +
                'repeating-linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.25) 1px, transparent 1px, transparent 16px)',
              backgroundSize: '16px 16px',
            }}
            aria-hidden
          />
        )}

	<ul className="absolute inset-0 m-0 list-none p-0">
	  {BUILDINGS.map((b) => (
	    <li 
		key={b.id} 
		style={{ position: 'absolute', left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%, -50%)' }}>
	      <a
	        href={b.href}
	        className="group relative block rounded-xl outline-none focus-visible:ring-4 ring-amber-500/50"
	        aria-label={b.label}
		title={b.label} 
		style={{ width: 56, height: 56 }}
	      >

		<span 
			className="halo" 
			style={{ 
				backgroundImage:`url(${haloUrl})`,
			}} 
			aria-hidden 
		/>	
		<span 
			className={`icon-pixel ico ico-${b.icon}`} 
			style={{ 
				backgroundImage:`url(${spriteUrl})`,
			}} 
			aria-hidden 
		/>
	      </a>
	    </li>
	  ))}
	</ul>

      <div className="absolute left-3 bottom-3 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md rounded-xl px-3 py-2 text-sm shadow">
        <span className="font-medium">Conseil :</span> survolez et cliquez sur un bâtiment pour obtenir des informations.
      </div>
    </div>
  )
}

function PageShell({ title, subtitle, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="fancy-title text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
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


function ThemeToggle() {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(() => localStorage.getItem('theme') || 'system');

  const apply = React.useCallback((nextMode) => {
    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = nextMode === 'dark' || (nextMode === 'system' && systemDark);
    root.classList.toggle('dark', isDark);
  }, []);

  // Applique au montage + écoute le changement système si on est en 'system'
  React.useEffect(() => {
    apply(mode);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if ((localStorage.getItem('theme') || 'system') === 'system') {
        apply('system');
      }
    };
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [apply, mode]);

  const setTheme = (value) => {
    setMode(value);
    localStorage.setItem('theme', value);
    apply(value);
    setOpen(false);
  };

  const label = mode === 'dark' ? 'Sombre' : mode === 'light' ? 'Clair' : 'Thème';
  const icon = mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '🖥️';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Thème"
      >
        <span aria-hidden>{icon}</span>
        <span>{label}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-lg p-1 text-sm z-20"
        >
          <button onClick={() => setTheme('system')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
            🖥️ Système
          </button>
          <button onClick={() => setTheme('light')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
            ☀️ Clair
          </button>
          <button onClick={() => setTheme('dark')} className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800">
            🌙 Sombre
          </button>
        </div>
      )}
    </div>
  );
}


function TopNav() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-stone-900/60 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
        <a href="#/" className="font-black tracking-tight text-lg">🏞️ A New Journey</a>
        <nav className="ml-auto flex items-center gap-3 text-sm">
          <a className="hover:underline" href="#/place">Place</a>
          <a className="hover:underline" href="#/chateau">Château</a>
          <a className="hover:underline" href="#/caserne">Caserne</a>
          <a className="hover:underline" href="#/auberge">Auberge</a>
          <a className="hover:underline" href="#/cv">CV</a>
	  <ThemeToggle />
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
	    <h1 className="fancy-title text-3xl md:text-4xl font-extrabold tracking-tight">Bienvenue dans mon village</h1>
            <p className="text-stone-600 dark:text-stone-300 mt-1">Cliquez sur un bâtiment pour en découvrir plus sur moi.</p>
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
