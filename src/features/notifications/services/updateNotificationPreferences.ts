import { createClient } from '@/lib/supabase/client'
import { NotificationPreferences } from '../types'

export async function updateNotificationPreferences(
  preferences: Partial<Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<NotificationPreferences> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(
      { user_id: user.id, ...preferences },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data as NotificationPreferences
}

export async function getNotificationPreferences(): Promise<NotificationPreferences | null> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) throw error
  return data as NotificationPreferences | null
}
