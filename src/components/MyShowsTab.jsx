import { IMG_BASE } from '../lib/tmdb'
import { countWatchedEpisodes } from '../lib/storage'
import { useLanguage } from '../lib/i18n'

export default function MyShowsTab({ shows, onSelect }) {
  const { t } = useLanguage()
  const list = Object.values(shows).sort((a, b) => b.addedAt - a.addedAt)

  if (list.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[var(--navy)]/50">
        <p>{t.shows.empty1}</p>
        <p className="text-sm mt-1">{t.shows.empty2}</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {list.map((show) => (
        <button
          key={show.id}
          onClick={() => onSelect(show)}
          className="bg-white rounded-lg overflow-hidden text-left border border-[var(--pink-soft)]/30 hover:ring-2 hover:ring-[var(--pink)] transition-all"
        >
          <div className="aspect-[2/3] bg-[var(--blue-pastel)]/30">
            {show.poster_path && (
              <img
                src={IMG_BASE + show.poster_path}
                alt={show.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-3">
            <p className="font-medium text-sm leading-tight text-[var(--navy)]">{show.name}</p>
            <p className="text-xs text-[var(--navy)]/50 mt-1">
              {countWatchedEpisodes(show)} {t.shows.watched}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
