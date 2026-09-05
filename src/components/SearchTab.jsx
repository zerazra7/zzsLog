import { useState } from 'react'
import { searchShows, IMG_BASE } from '../lib/tmdb'

export default function SearchTab({ shows, onAdd }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await searchShows(query.trim())
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Dizi ara... (ör. Breaking Bad)"
          className="flex-1 rounded-lg bg-white border border-pink-200 px-4 py-2.5 text-blue-950 placeholder-pink-300 focus:outline-none focus:border-pink-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 font-medium transition-colors"
        >
          Ara
        </button>
      </form>

      {loading && <p className="text-blue-950/60 text-center">Aranıyor...</p>}
      {error && <p className="text-rose-500 text-center">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {results.map((show) => {
          const alreadyAdded = Boolean(shows[show.id])
          return (
            <div
              key={show.id}
              className="bg-white rounded-lg overflow-hidden flex flex-col border border-pink-100"
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
              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="font-medium text-sm leading-tight text-blue-950">{show.name}</p>
                <p className="text-xs text-blue-950/50">
                  {show.first_air_date?.slice(0, 4) || '—'}
                </p>
                <button
                  onClick={() => onAdd(show)}
                  disabled={alreadyAdded}
                  className="mt-auto rounded-md bg-pink-400 hover:bg-pink-500 disabled:bg-pink-100 disabled:text-pink-400 text-white text-sm py-1.5 transition-colors"
                >
                  {alreadyAdded ? 'Listede ✓' : 'Listeye ekle'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
