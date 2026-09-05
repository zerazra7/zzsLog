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
    <div className="fixed inset-0 bg-[var(--navy)]/60 flex items-start justify-center overflow-y-auto z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 border border-[var(--pink-soft)]/50">
        <div className="flex items-center justify-between p-4 border-b border-[var(--pink-soft)]/30">
          <div>
            <h2 className="text-lg font-semibold text-[var(--navy)]">{show.name}</h2>
            <p className="text-xs text-[var(--navy)]/50">
              {countWatchedEpisodes(show)} bölüm izlendi
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onRemove(show.id)}
              className="text-xs text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-md border border-rose-200"
            >
              Listeden çıkar
            </button>
            <button
              onClick={onClose}
              className="text-[var(--navy)]/60 hover:text-[var(--navy)] px-3 py-1.5 rounded-md border border-[var(--pink-soft)]/50"
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
                        ? 'bg-[var(--navy)] border-[var(--navy)] text-white'
                        : 'border-[var(--pink-soft)]/50 text-[var(--navy)] hover:border-[var(--pink)]'
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
              className="mb-3 text-sm text-[var(--pink)] hover:text-[var(--navy)]"
            >
              {allWatched ? 'Sezonun işaretini kaldır' : 'Tüm sezonu izledim işaretle'}
            </button>
          )}

          {loading && <p className="text-[var(--navy)]/50 text-sm">Yükleniyor...</p>}

          <div className="flex flex-col gap-2">
            {seasonData?.episodes?.map((ep) => {
              const watched = watchedSet.has(ep.episode_number)
              return (
                <label
                  key={ep.id}
                  className={`flex gap-3 items-start p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    watched
                      ? 'border-[var(--pink)] bg-[var(--pink-soft)]/15'
                      : 'border-[var(--pink-soft)]/30 hover:border-[var(--pink-soft)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={watched}
                    onChange={() => onToggleEpisode(show.id, seasonNumber, ep.episode_number)}
                    className="mt-1 accent-[var(--pink)]"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--navy)]">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <p className="text-xs text-[var(--navy)]/50 mt-0.5">{ep.air_date}</p>
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
