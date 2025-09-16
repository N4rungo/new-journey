// src/App.jsx
import { useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'

import TopNav from './components/TopNav'
import Footer from './components/Footer'
import VillageMap from './components/VillageMap'
import ProjectsPage from './pages/ProjectsPage'
import PlacePage from './pages/PlacePage'
import CVPage from './pages/CVPage'
import TrainingPage from './pages/TrainingPage'
import HobbiesPage from './pages/HobbiesPage'
import ForgePage from './pages/ForgePage'
import { useHashRoute } from './lib/router'

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

export default function App() {
  const [route] = useHashRoute()
  const path = route || '/'

  const Page = useMemo(() => {
    switch (path) {
      case '/':
        return (
          <main>
            <Welcome />
            {/* Carte du village */}
            <section className="px-4">
              <VillageMap />
            </section>
          </main>
        )
      case '/place':
        return <PlacePage />
      case '/chateau':
        return <ProjectsPage />
      case '/caserne':
        return <TrainingPage />
      case '/auberge':
        return <HobbiesPage />
      case '/cv':
        return <CVPage />
      case '/forge':
        return <ForgePage />
      default:
        return (
          <PageShell title="Page introuvable" subtitle="La destination demandée n'existe pas (404)">
            <a className="link-solid" href="#/">
              Retour à la carte
            </a>
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
