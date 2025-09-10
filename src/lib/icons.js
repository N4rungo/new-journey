// Map icône -> fichier 64x64 (SVG) dans /public/icons
export function iconUrl(key) {
  const base = import.meta.env.BASE_URL
  const map = {
    castle:   'castle-64.png',
    barracks: 'barracks-64.png',
    tavern:   'tavern-64.png',
    plaza:    'plaza-64.png',
    archives: 'archives-64.png',
  }
  const name = map[key] || 'plaza-64.png'
  return `${base}icons/${name}`
}
