import { createClient } from '@/lib/supabase/client'

export async function saveSearchHistory(searchTerm: string): Promise<void> {
  const trimmed = searchTerm.trim()
  if (!trimmed) return

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // 1. Delete if search term already exists for this user to keep it unique and update the recency
  await supabase
    .from('search_history')
    .delete()
    .eq('user_id', user.id)
    .eq('search_term', trimmed)

  // 2. Insert new search history entry
  await supabase
    .from('search_history')
    .insert({
      user_id: user.id,
      search_term: trimmed,
    })

  // 3. Keep history capped at 10 items
  const { data: history } = await supabase
    .from('search_history')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (history && history.length > 10) {
    const idsToDelete = history.slice(10).map((h) => h.id)
    await supabase.from('search_history').delete().in('id', idsToDelete)
  }
}
