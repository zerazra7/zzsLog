import { IMG_BASE } from '../lib/tmdb'
import { countWatchedEpisodes } from '../lib/storage'

export default function MyShowsTab({ shows, onSelect }) {
  const list = Object.values(shows).sort((a, b) => b.addedAt - a.addedAt)

  if (list.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-blue-950/50">
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
          className="bg-white rounded-lg overflow-hidden text-left border border-pink-100 hover:ring-2 hover:ring-pink-400 transition-all"
        >
          <div className="aspect-[2/3] bg-pink-100">
            {show.poster_path && (
              <img
                src={IMG_BASE + show.poster_path}
                alt={show.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-3">
            <p className="font-medium text-sm leading-tight text-blue-950">{show.name}</p>
            <p className="text-xs text-blue-950/50 mt-1">
              {countWatchedEpisodes(show)} bölüm izlendi
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
