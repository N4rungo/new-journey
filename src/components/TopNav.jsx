import ThemeToggle from './ThemeToggle'

export default function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-stone-950/70 backdrop-blur border-b border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <a href="#/" className="font-semibold">
          🛖 Mon Village
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="#/place" className="hover:underline">
            Place
          </a>
          <a href="#/chateau" className="hover:underline">
            Château
          </a>
          <a href="#/caserne" className="hover:underline">
            Caserne
          </a>
          <a href="#/auberge" className="hover:underline">
            Auberge
          </a>
          <a href="#/forge" className="hover:underline">
            Forge
          </a>
          <a href="#/cv" className="hover:underline">
            CV
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
