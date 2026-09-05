import { useEffect, useState } from 'react'
import { getShowDetails, getSeasonDetails, IMG_BASE } from '../lib/tmdb'
import { countWatchedEpisodes } from '../lib/storage'

export default function ShowDetail({ show, onToggleEpisode, onSetSeasonWatched, onRemove, onClose }) {
  const [details, setDetails] = useState(null)
  const [seasonNumber, setSeasonNumber] = useState(1)
  const [seasonData, setSeasonData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getShowDetails(show.id).then((d) => {
      if (cancelled) return
      setDetails(d)
      const firstReal = d.seasons?.find((s) => s.season_number > 0) ?? d.seasons?.[0]
      setSeasonNumber(firstReal?.season_number ?? 1)
    })
    return () => {
      cancelled = true
    }
  }, [show.id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getSeasonDetails(show.id, seasonNumber).then((d) => {
      if (!cancelled) {
        setSeasonData(d)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [show.id, seasonNumber])

  const watchedSet = new Set(show.watched[String(seasonNumber)] ?? [])
  const allWatched = seasonData?.episodes?.length > 0 && seasonData.episodes.every((ep) => watchedSet.has(ep.episode_number))

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center overflow-y-auto z-50 p-4">
      <div className="bg-zinc-900 rounded-xl max-w-2xl w-full my-8 border border-zinc-700">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div>
            <h2 className="text-lg font-semibold">{show.name}</h2>
            <p className="text-xs text-zinc-400">
              {countWatchedEpisodes(show)} bölüm izlendi
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRemove(show.id)}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md border border-red-900/60"
            >
              Listeden çıkar
            </button>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-700"
            >
              Kapat
            </button>
          </div>
        </div>

        <div className="p-4">
          {details?.seasons && (
            <div className="flex gap-2 flex-wrap mb-4">
              {details.seasons
                .filter((s) => s.season_number > 0 || details.seasons.length === 1)
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeasonNumber(s.season_number)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      seasonNumber === s.season_number
                        ? 'bg-violet-600 border-violet-600'
                        : 'border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
            </div>
          )}

          {seasonData && (
            <button
              onClick={() =>
                onSetSeasonWatched(
                  show.id,
                  seasonNumber,
                  seasonData.episodes.map((e) => e.episode_number),
                  !allWatched,
                )
              }
              className="mb-3 text-sm text-violet-400 hover:text-violet-300"
            >
              {allWatched ? 'Sezonun işaretini kaldır' : 'Tüm sezonu izledim işaretle'}
            </button>
          )}

          {loading && <p className="text-zinc-400 text-sm">Yükleniyor...</p>}

          <div className="flex flex-col gap-2">
            {seasonData?.episodes?.map((ep) => {
              const watched = watchedSet.has(ep.episode_number)
              return (
                <label
                  key={ep.id}
                  className={`flex gap-3 items-start p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    watched ? 'border-violet-600 bg-violet-600/10' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={watched}
                    onChange={() => onToggleEpisode(show.id, seasonNumber, ep.episode_number)}
                    className="mt-1 accent-violet-600"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{ep.air_date}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
