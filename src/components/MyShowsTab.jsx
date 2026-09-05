import { IMG_BASE } from '../lib/tmdb'
import { countWatchedEpisodes } from '../lib/storage'

export default function MyShowsTab({ shows, onSelect }) {
  const list = Object.values(shows).sort((a, b) => b.addedAt - a.addedAt)

  if (list.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-zinc-400">
        <p>Henüz listende dizi yok.</p>
        <p className="text-sm mt-1">"Ara" sekmesinden dizi ekleyebilirsin.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
      {list.map((show) => (
        <button
          key={show.id}
          onClick={() => onSelect(show)}
          className="bg-zinc-800/60 rounded-lg overflow-hidden text-left hover:ring-2 hover:ring-violet-600 transition-all"
        >
          <div className="aspect-[2/3] bg-zinc-700">
            {show.poster_path && (
              <img
                src={IMG_BASE + show.poster_path}
                alt={show.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-3">
            <p className="font-medium text-sm leading-tight">{show.name}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {countWatchedEpisodes(show)} bölüm izlendi
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
