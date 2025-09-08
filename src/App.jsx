// src/App.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects, getPage } from './lib/content.js'

const BUILDINGS = [
  { id: 'chateau',  label: 'Château (Projets)',            x: 25, y: 39, href: '#/chateau',  icon: 'castle',   desc: 'Mes projets personnels…' },
  { id: 'caserne',  label: "Caserne (Formations)",       x: 60, y: 62, href: '#/caserne',  icon: 'barracks', desc: 'Formations, compétences…' },
  { id: 'auberge',  label: 'Auberge (Passe-temps)',        x: 56, y: 29, href: '#/auberge',  icon: 'tavern',   desc: 'Jeux vidéo & société…' },
  { id: 'place',    label: 'Place du village (Index)',     x: 46, y: 35, href: '#/place',    icon: 'plaza',    desc: 'Index accessible.' },
  { id: 'cv',       label: 'Salle des archives (CV)',      x: 38, y: 23, href: '#/cv',       icon: 'archives', desc: 'CV imprimable.' },
  // { id: 'biblio', label: 'Bibliothèque', x: 58, y: 60, href: '#/biblio', icon: 'book', desc: 'Lectures, notes.' },
];


// Mesure la taille d'un élément (pour recalculer le rectangle d'affichage)
function useElementSize() {
  const ref = React.useRef(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

// Calcule le rectangle réellement occupé par l’image dans le conteneur (fit/contain vs fill/cover)
function getDisplayRect(containerW, containerH, imgW, imgH, mode = 'fit') {
  const imgAspect = imgW / imgH;
  const contAspect = containerW / containerH;
  let w, h;
  if (mode === 'fill') {
    // cover
    if (contAspect > imgAspect) {
      w = containerW; h = containerW / imgAspect;
    } else {
      h = containerH; w = containerH * imgAspect;
    }
  } else {
    // fit (contain)
    if (contAspect > imgAspect) {
      h = containerH; w = containerH * imgAspect;
    } else {
      w = containerW; h = containerW / imgAspect;
    }
  }
  const x = (containerW - w) / 2;
  const y = (containerH - h) / 2;
  return { x, y, w, h };
}

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
  // -- état local -------------------------------------------------------------
  const [showGrid, setShowGrid] = React.useState(false)   // toggle grille (touche "g")
  useKey('g', () => setShowGrid((s) => !s))

  // -- chemins d'assets (HD seulement) ---------------------------------------
  const base = import.meta.env.BASE_URL
  const bgHD   = base + 'map/village16x9@2x.png'   // fond 16:9 HD uniquement
  const icons  = base + 'sprites/ui-32.png'        // sprites icônes HD
  const haloHD = base + 'sprites/halo-32.png'      // halo HD

  return (
    // Conteneur 16:9 avec hauteur max pour garder la rivière visible
    <div
      className="relative mx-auto w-full max-w-7xl rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800"
      style={{ aspectRatio: '16 / 9', maxHeight: '85svh' }}
    >
      {/* Image de fond 16:9 (HD), pas de srcset → rendu identique partout */}
      <img
        src={bgHD}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pixelated"
        aria-hidden
      />

      {/* Grille 96×54 tuiles (16px), utile pour placer les marqueurs */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,.25), rgba(0,0,0,.25) 1px, transparent 1px, transparent 16px),' +
              'repeating-linear-gradient(90deg, rgba(0,0,0,.25), rgba(0,0,0,.25) 1px, transparent 1px, transparent 16px)',
            backgroundSize: 'calc(100% / 96) calc(100% / 54)', // 96x54 tuiles
          }}
          aria-hidden
        />
      )}

      {/* Marqueurs : positions en % (BUILDINGS.{x,y}) */}
      <ul className="absolute inset-0 m-0 list-none p-0 z-20">
        {BUILDINGS.map((b) => (
          <li
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <a
              href={b.href}
              className="marker group relative block rounded-xl outline-none focus-visible:ring-4 ring-amber-500/50"
              aria-label={b.label}
              title={b.label}
              style={{ width: 56, height: 56 }} // hitbox confortable
            >
              {/* halo animé (anneau) */}
              <span className="halo" style={{ backgroundImage: `url(${haloHD})` }} aria-hidden />
              {/* icône pixel (HD, agrandie) */}
              <span className={`icon-pixel ico ico-${b.icon}`} style={{ backgroundImage: `url(${icons})` }} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PageShell({ title, subtitle, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-hero text-3xl md:text-4xl tracking-wide title-outline">{title}</h1>
      {subtitle && <p className="font-medieval text-stone-600 dark:text-stone-300 mt-1">{subtitle}</p>}
      <div className="mt-6 prose prose-stone dark:prose-invert max-w-none">{children}</div>
    </div>
  )
}

function PlacePage() {
  return (
    <PageShell title="Place du village" subtitle="Accédez au contenu du site">
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
    <PageShell title="Château" subtitle="Liste de projets">
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

function Welcome() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 text-center">
      <h1 className="font-hero text-4xl md:text-5xl tracking-wide title-outline">
        Bienvenue dans mon village
      </h1>
      <p className="font-medieval mt-1 text-stone-600 dark:text-stone-300">
        Cliquez sur un bâtiment pour en découvrir plus sur moi.
      </p>
    </section>
  )
}


function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-stone-950/70 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <a href="#/" className="font-hero tracking-wide text-3xl">🛡️ Mon Village</a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#/place" className="hover:underline">Place</a>
          <a href="#/chateau" className="hover:underline">Château</a>
          <a href="#/caserne" className="hover:underline">Caserne</a>
          <a href="#/auberge" className="hover:underline">Auberge</a>
          <a href="#/cv" className="hover:underline">CV</a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}


function Footer() {
  return (
    <footer className="mt-6 border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-center text-stone-600 dark:text-stone-400">
        © {new Date().getFullYear()} Matthieu BORIE — My Journey
      </div>
    </footer>
  )
}

export default function App() {
  const [route] = useHashRoute()
  const path = route || '/'

  const Page = useMemo(() => {
    switch (path) {
      case '/':
        return (
          <main>
            {/* Texte d’intro centré */}
            <Welcome />
            {/* Carte HD-only : le composant VillageMap gère son centrage + aspect 16:9 */}
            <section className="px-4">
              <VillageMap />
            </section>
          </main>
        )
      case '/place':   return <PlacePage />
      case '/chateau': return <ProjectsPage />
      case '/caserne': return <TrainingPage />
      case '/auberge': return <HobbiesPage />
      case '/cv':      return <CVPage />
      default:
        return (
          <PageShell
            title="Page introuvable"
            subtitle="La destination demandée n'existe pas (404)"
          >
            <a className="underline" href="#/">Retour à la carte</a>
          </PageShell>
        )
    }
  }, [path])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50">
      <TopNav />
      {/* Si tu utilises des animations de page, garde AnimatePresence */}
      <AnimatePresence mode="wait">{Page}</AnimatePresence>
      <Footer />
    </div>
  )
}