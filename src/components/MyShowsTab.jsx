import { useEffect, useState } from 'react'
import { IMG_BASE, getShowDetails, getSeasonDetails } from '../lib/tmdb'
import { countWatchedEpisodes } from '../lib/storage'
import { useLanguage } from '../lib/i18n'

function realSeasonsOf(details) {
  return (
    details.seasons?.filter((s) => s.season_number > 0 || details.seasons.length === 1) || []
  )
}

export default function MyShowsTab({ shows, onSelect, onToggleEpisode }) {
  const { lang, t } = useLanguage()
  const list = Object.values(shows).sort((a, b) => b.addedAt - a.addedAt)
  const [meta, setMeta] = useState({})

  const metaKey = list.map((s) => `${s.id}:${countWatchedEpisodes(s)}`).join(',') + ':' + lang

  useEffect(() => {
    let cancelled = false

    async function loadOne(show) {
      const details = await getShowDetails(show.id, lang)
      const seasons = realSeasonsOf(details)
      const totalEpisodes = seasons.reduce((sum, s) => sum + s.episode_count, 0)
      const watchedCount = countWatchedEpisodes(show)

      let remaining = watchedCount
      let nextSeason = null
      let nextEpisodeNum = null
      for (const s of seasons) {
        if (remaining < s.episode_count) {
          nextSeason = s.season_number
          nextEpisodeNum = remaining + 1
          break
        }
        remaining -= s.episode_count
      }

      let nextTitle = null
      if (nextSeason != null) {
        const seasonData = await getSeasonDetails(show.id, nextSeason, lang)
        nextTitle = seasonData.episodes?.find((e) => e.episode_number === nextEpisodeNum)?.name ?? null
      }

      return { totalEpisodes, watchedCount, nextSeason, nextEpisodeNum, nextTitle }
    }

    list.forEach((show) => {
      loadOne(show)
        .then((data) => {
          if (!cancelled) setMeta((m) => ({ ...m, [show.id]: data }))
        })
        .catch(() => {
          if (!cancelled) setMeta((m) => ({ ...m, [show.id]: { error: true } }))
        })
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaKey])

  if (list.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-[var(--navy)]/50">
        <p>{t.shows.empty1}</p>
        <p className="text-sm mt-1">{t.shows.empty2}</p>
      </div>
    )
  }

  const groups = { notStarted: [], watching: [], completed: [] }
  for (const show of list) {
    const m = meta[show.id]
    if (!m || m.error || !m.totalEpisodes) {
      groups.notStarted.push(show)
    } else if (m.watchedCount <= 0) {
      groups.notStarted.push(show)
    } else if (m.watchedCount >= m.totalEpisodes) {
      groups.completed.push(show)
    } else {
      groups.watching.push(show)
    }
  }

  const sections = [
    { key: 'watching', label: t.shows.watching, items: groups.watching },
    { key: 'notStarted', label: t.shows.notStarted, items: groups.notStarted },
    { key: 'completed', label: t.shows.completed, items: groups.completed },
  ].filter((s) => s.items.length > 0)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {sections.map((section) => (
        <div key={section.key} className="mb-6">
          <h3 className="text-sm font-semibold text-[var(--navy)]/60 mb-2">{section.label}</h3>
          <div className="flex flex-col gap-2">
            {section.items.map((show) => {
              const m = meta[show.id]
              const isDone = m && m.totalEpisodes && m.watchedCount >= m.totalEpisodes
              return (
                <button
                  key={show.id}
                  onClick={() => onSelect(show)}
                  className="flex items-center gap-3 bg-white rounded-lg overflow-hidden text-left border border-[var(--pink-soft)]/55 hover:ring-2 hover:ring-[var(--pink)] transition-all p-2"
                >
                  <div className="w-14 h-20 shrink-0 rounded-md overflow-hidden bg-[var(--blue-pastel)]/30">
                    {show.poster_path && (
                      <img
                        src={IMG_BASE + show.poster_path}
                        alt={show.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-tight text-[var(--navy)] truncate">
                      {show.name}
                    </p>
                    {m && !m.error && m.totalEpisodes ? (
                      isDone ? (
                        <p className="text-xs text-[var(--pink)] mt-1">✓ {t.shows.completed}</p>
                      ) : (
                        <>
                          <p className="text-xs text-[var(--navy)]/50 mt-1">
                            S{String(m.nextSeason).padStart(2, '0')} E
                            {String(m.nextEpisodeNum).padStart(2, '0')} · {m.watchedCount + 1}/
                            {m.totalEpisodes}
                          </p>
                          {m.nextTitle && (
                            <p className="text-xs text-[var(--navy)]/40 truncate">{m.nextTitle}</p>
                          )}
                        </>
                      )
                    ) : (
                      <p className="text-xs text-[var(--navy)]/40 mt-1">
                        {countWatchedEpisodes(show)} {t.shows.watched}
                      </p>
                    )}
                  </div>
                  {m && !m.error && m.totalEpisodes && !isDone && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleEpisode(show.id, m.nextSeason, m.nextEpisodeNum)
                      }}
                      title={t.shows.watched}
                      className="shrink-0 w-8 h-8 rounded-full border border-[var(--pink-soft)]/75 text-[var(--navy)]/50 hover:border-[var(--pink)] hover:text-[var(--pink)] flex items-center justify-center transition-colors"
                    >
                      ✓
                    </button>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
