// src/components/VillageMap.jsx
import { BUILDINGS } from '../lib/constants'
import { iconUrl } from '../lib/icons'

export default function VillageMap() {
  // -- chemins d'assets (HD seulement) ---------------------------------------
  const base = import.meta.env.BASE_URL
  const bgHD = base + 'map/village16x9@2x.png' // fond 16:9 HD uniquement
  const haloHD = base + 'sprites/halo-32.png'  // halo HD (affiché 80x80)

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
        {BUILDINGS.map((b) => {
          const isHidden = b.hidden || !b.icon // ← rien de visible si true
          return (
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
                className={
                  isHidden
                    ? 'block ring-0 outline-none focus-visible:outline-none focus-visible:ring-0'
                    : 'marker group relative block rounded-xl outline-none focus-visible:ring-4 ring-amber-500/50'
                }
                aria-label={b.label}
                title={b.label}
                tabIndex={isHidden ? -1 : 0}          // pas focusable si caché
                style={{ width: isHidden ? 48 : 80, height: isHidden ? 48 : 80 }}
              >
                {!isHidden && (
                  <>
                    {/* halo animé (anneau) */}
                    <span
                      className="halo"
                      style={{ backgroundImage: `url(${haloHD})` }}
                      aria-hidden
                    />
                    {/* icône 64x64 (pixel art), sans scaling */}
                    <img
                      src={iconUrl(b.icon)}
                      alt=""
                      width="64"
                      height="64"
                      className="pixel-icon"
                      aria-hidden
                    />
                  </>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
