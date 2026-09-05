import { supabase } from './supabaseClient'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export function displayName(profile) {
  if (!profile) return '???'
  return profile.nickname?.trim() || profile.email
}

export async function listProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('email')
  if (error) throw error
  return data
}

export async function listProfilesByActivity() {
  const [{ data: profiles, error: profilesError }, { data: showRows, error: showsError }] =
    await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('shows').select('user_id, updated_at'),
    ])
  if (profilesError) throw profilesError
  if (showsError) throw showsError

  const lastActivity = {}
  for (const row of showRows) {
    const t = new Date(row.updated_at).getTime()
    if (!lastActivity[row.user_id] || t > lastActivity[row.user_id]) {
      lastActivity[row.user_id] = t
    }
  }

  return [...profiles].sort((a, b) => (lastActivity[b.id] ?? 0) - (lastActivity[a.id] ?? 0))
}

export async function updateNickname(userId, nickname) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ nickname: nickname.trim() || null })
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function fetchWallMessages(profileId) {
  const cutoff = new Date(Date.now() - ONE_DAY_MS).toISOString()

  // Best-effort cleanup of expired messages (RLS allows anyone to delete these)
  await supabase.from('wall_messages').delete().eq('profile_id', profileId).lt('created_at', cutoff)

  const { data, error } = await supabase
    .from('wall_messages')
    .select('*')
    .eq('profile_id', profileId)
    .gte('created_at', cutoff)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function postWallMessage(profileId, authorId, text) {
  const { data, error } = await supabase
    .from('wall_messages')
    .insert({ profile_id: profileId, author_id: authorId, text })
    .select()
    .single()
  if (error) throw error
  return data
}
