import { supabase } from './supabaseClient'

export function rowToShow(row) {
  return {
    id: row.tmdb_id,
    name: row.name,
    poster_path: row.poster_path,
    episode_run_time: row.episode_run_time,
    watched: row.watched || {},
    rewatchCount: row.rewatch_count ?? 1,
    isFavorite: row.is_favorite ?? false,
    addedAt: new Date(row.added_at).getTime(),
    updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : null,
  }
}

export async function fetchShowsForUser(userId) {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })
  if (error) throw error
  const map = {}
  for (const row of data) map[row.tmdb_id] = rowToShow(row)
  return map
}

export async function insertShow(userId, show) {
  const { data, error } = await supabase
    .from('shows')
    .insert({
      user_id: userId,
      tmdb_id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      episode_run_time: Array.isArray(show.episode_run_time)
        ? (show.episode_run_time[0] ?? 30)
        : (show.episode_run_time ?? 30),
      watched: {},
    })
    .select()
    .single()
  if (error) throw error
  return rowToShow(data)
}

export async function deleteShow(tmdbId) {
  const { error } = await supabase.from('shows').delete().eq('tmdb_id', tmdbId)
  if (error) throw error
}

export async function updateWatched(tmdbId, watched) {
  const { data, error } = await supabase
    .from('shows')
    .update({ watched })
    .eq('tmdb_id', tmdbId)
    .select()
    .single()
  if (error) throw error
  return rowToShow(data)
}

export async function updateWatchedAndRewatch(tmdbId, watched, rewatchCount) {
  const { data, error } = await supabase
    .from('shows')
    .update({ watched, rewatch_count: rewatchCount })
    .eq('tmdb_id', tmdbId)
    .select()
    .single()
  if (error) throw error
  return rowToShow(data)
}

export async function updateFavorite(tmdbId, isFavorite) {
  const { data, error } = await supabase
    .from('shows')
    .update({ is_favorite: isFavorite })
    .eq('tmdb_id', tmdbId)
    .select()
    .single()
  if (error) throw error
  return rowToShow(data)
}
