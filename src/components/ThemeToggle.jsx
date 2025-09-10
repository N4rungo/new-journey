import React from 'react'

export default function ThemeToggle() {
  const [open, setOpen] = React.useState(false)
  const [mode, setMode] = React.useState(() => localStorage.getItem('theme') || 'system')

  const apply = React.useCallback((nextMode) => {
    const root = document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = nextMode === 'dark' || (nextMode === 'system' && systemDark)
    root.classList.toggle('dark', isDark)
  }, [])

  React.useEffect(() => {
    apply(mode)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if ((localStorage.getItem('theme') || 'system') === 'system') apply('system')
    }
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [apply, mode])

  const setTheme = (value) => {
    setMode(value)
    localStorage.setItem('theme', value)
    apply(value)
    setOpen(false)
  }

  const label = mode === 'dark' ? 'Sombre' : mode === 'light' ? 'Clair' : 'Thème'
  const icon = mode === 'dark' ? '🌙' : mode === 'light' ? '☀️' : '🖥️'

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
          <button
            onClick={() => setTheme('system')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            🖥️ Système
          </button>
          <button
            onClick={() => setTheme('light')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            ☀️ Clair
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            🌙 Sombre
          </button>
        </div>
      )}
    </div>
  )
}
