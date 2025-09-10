import React from 'react'

// Router hash ultra simple: retourne [route, navigate]
export function useHashRoute() {
  const [route, setRoute] = React.useState(() => window.location.hash.replace(/^#\/?/, '/') || '/')
  React.useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash.replace(/^#\/?/, '/') || '/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  const navigate = (path) =>
    (window.location.hash = path.startsWith('#') ? path : `#${path.replace(/^#?/, '')}`)
  return [route, navigate]
}
