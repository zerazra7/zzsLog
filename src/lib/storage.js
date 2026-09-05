const STORAGE_KEY = 'tvtime-clone:shows'

export function loadShows() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveShows(shows) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shows))
}

export function addShow(shows, show) {
  if (shows[show.id]) return shows
  return {
    ...shows,
    [show.id]: {
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      episode_run_time: show.episode_run_time?.[0] ?? 30,
      addedAt: Date.now(),
      watched: {},
    },
  }
}

export function removeShow(shows, showId) {
  const next = { ...shows }
  delete next[showId]
  return next
}

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
