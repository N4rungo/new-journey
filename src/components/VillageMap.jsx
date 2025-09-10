import { BUILDINGS } from '../lib/constants'
import { iconUrl } from '../lib/icons'

export default function VillageMap() {
  // -- état local -------------------------------------------------------------
  // const [showGrid] = React.useState(false) // toggle grille (touche "g")
  // useKey('g', () => setShowGrid((s) => !s))

  // -- chemins d'assets (HD seulement) ---------------------------------------
  const base = import.meta.env.BASE_URL
  const bgHD = base + 'map/village16x9@2x.png' // fond 16:9 HD uniquement
  const icons = base + 'sprites/ui-32.png' // sprites icônes HD
  const haloHD = base + 'sprites/halo-32.png' // halo HD

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

      {/* Marqueurs : positions en % (BUILDINGS.{x,y}) */}
      <ul className="absolute inset-0 m-0 list-none p-0 z-20">
        {BUILDINGS.map((b) => (
          <li
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <a
              href={b.href}
              className="marker group relative block rounded-xl outline-none focus-visible:ring-4 ring-amber-500/50"
              aria-label={b.label}
              title={b.label}
              style={{ width: 80, height: 80 }}
            >
              {/* halo animé (anneau) */}
              <span className="halo" style={{ backgroundImage: `url(${haloHD})` }} aria-hidden />
              {/* icône pixel (HD, agrandie) */}
              {b.icon && (
                <img
                  src={iconUrl(b.icon)}
                  alt=""
                  width="64"
                  height="64"
                  className="pixel-icon"
                  aria-hidden
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
