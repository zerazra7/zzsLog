import { useState } from 'react'
import { searchShows, IMG_BASE } from '../lib/tmdb'
import { useLanguage } from '../lib/i18n'

export default function SearchTab({ shows, onAdd }) {
  const { lang, t } = useLanguage()
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
      const data = await searchShows(query.trim(), lang)
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
          placeholder={t.search.placeholder}
          className="flex-1 rounded-lg bg-white border border-[var(--pink-soft)]/50 px-4 py-2.5 text-[var(--navy)] placeholder-[var(--pink-soft)] focus:outline-none focus:border-[var(--pink)]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--navy)] hover:bg-[var(--navy-soft)] text-white px-5 py-2.5 font-medium transition-colors"
        >
          {t.search.button}
        </button>
      </form>

      {loading && <p className="text-[var(--navy)]/60 text-center">{t.search.searching}</p>}
      {error && <p className="text-rose-500 text-center">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {results.map((show) => {
          const alreadyAdded = Boolean(shows[show.id])
          return (
            <div
              key={show.id}
              className="bg-white rounded-lg overflow-hidden flex flex-col border border-[var(--pink-soft)]/30"
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
              <div className="p-3 flex flex-col gap-2 flex-1">
                <p className="font-medium text-sm leading-tight text-[var(--navy)]">{show.name}</p>
                <p className="text-xs text-[var(--navy)]/50">
                  {show.first_air_date?.slice(0, 4) || '—'}
                </p>
                <button
                  onClick={() => onAdd(show)}
                  disabled={alreadyAdded}
                  className="mt-auto rounded-md bg-[var(--pink)] hover:bg-[var(--pink)]/85 disabled:bg-[var(--pink-soft)]/40 disabled:text-[var(--navy)]/50 text-white text-sm py-1.5 transition-colors"
                >
                  {alreadyAdded ? t.search.inList : t.search.add}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
