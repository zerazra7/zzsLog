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

export function countWatchedEpisodes(show) {
  return Object.values(show.watched).reduce((sum, eps) => sum + eps.length, 0)
}

export function totalMinutesWatched(shows) {
  return Object.values(shows).reduce(
    (sum, show) => sum + countWatchedEpisodes(show) * (show.episode_run_time || 30),
    0,
  )
}
