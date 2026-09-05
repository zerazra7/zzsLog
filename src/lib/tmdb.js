const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export const IMG_BASE = 'https://image.tmdb.org/t/p/w300'

async function tmdbFetch(path, params = {}) {
  if (!API_KEY) {
    throw new Error('TMDB API key eksik. .env dosyasına VITE_TMDB_API_KEY ekle.')
  }
  const url = new URL(BASE_URL + path)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'tr-TR')
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`TMDB isteği başarısız: ${res.status}`)
  }
  return res.json()
}

export function searchShows(query) {
  return tmdbFetch('/search/tv', { query }).then((data) => data.results ?? [])
}

export function getShowDetails(showId) {
  return tmdbFetch(`/tv/${showId}`)
}

export function getSeasonDetails(showId, seasonNumber) {
  return tmdbFetch(`/tv/${showId}/season/${seasonNumber}`)
}
