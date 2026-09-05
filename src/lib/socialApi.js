import { supabase } from './supabaseClient'

export async function listProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('email')
  if (error) throw error
  return data
}

export async function fetchWallMessages(profileId) {
  const { data, error } = await supabase
    .from('wall_messages')
    .select('*')
    .eq('profile_id', profileId)
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
