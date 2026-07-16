import { createClient } from '@/lib/supabase/client'
import { Notification, NotificationFilters } from '../types'

export async function getNotifications(
  filters: NotificationFilters = {}
): Promise<Notification[]> {
  const supabase = createClient()

  let query = supabase
    .from('notifications')
    .select('*')
    .eq('archived', filters.archived ?? false)
    .order('created_at', { ascending: false })
    .limit(50)

  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  if (filters.read !== 'all' && filters.read !== undefined) {
    query = query.eq('read', filters.read)
  }

  if (filters.search && filters.search.trim()) {
    query = query.ilike('title', `%${filters.search.trim()}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return (data ?? []) as Notification[]
}

export async function getUnreadCount(): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('read', false)
    .eq('archived', false)

  if (error) throw error
  return count ?? 0
}
