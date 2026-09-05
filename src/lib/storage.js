export function toggleEpisode(shows, showId, seasonNumber, episodeNumber) {
  const show = shows[showId]
  if (!show) return shows
  const seasonKey = String(seasonNumber)
  const watchedSeason = new Set(show.watched[seasonKey] ?? [])
  if (watchedSeason.has(episodeNumber)) {
    watchedSeason.delete(episodeNumber)
  } else {
    watchedSeason.add(episodeNumber)
  }
  return {
    ...shows,
    [showId]: {
      ...show,
      watched: {
        ...show.watched,
        [seasonKey]: Array.from(watchedSeason),
      },
    },
  }
}

export function setSeasonWatched(shows, showId, seasonNumber, episodeNumbers, watched) {
  const show = shows[showId]
  if (!show) return shows
  const seasonKey = String(seasonNumber)
  return {
    ...shows,
    [showId]: {
      ...show,
      watched: {
        ...show.watched,
        [seasonKey]: watched ? episodeNumbers : [],
      },
    },
  }
}

export function allEpisodesWatchedMap(seasons) {
  const watched = {}
  for (const s of seasons) {
    watched[String(s.season_number)] = Array.from({ length: s.episode_count }, (_, i) => i + 1)
  }
  return watched
}

export function countWatchedEpisodes(show) {
  return Object.values(show.watched).reduce((sum, eps) => sum + eps.length, 0)
}

export function effectiveWatchCount(show) {
  return countWatchedEpisodes(show) * (show.rewatchCount || 1)
}

export function totalMinutesWatched(shows) {
  return Object.values(shows).reduce(
    (sum, show) => sum + effectiveWatchCount(show) * (show.episode_run_time || 30),
    0,
  )
}
