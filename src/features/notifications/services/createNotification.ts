import { createClient } from '@/lib/supabase/client'
import { CreateNotificationPayload, Notification } from '../types'

export async function createNotification(
  payload: CreateNotificationPayload
): Promise<Notification> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: payload.user_id,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      category: payload.category,
      action_url: payload.action_url ?? null,
      metadata: payload.metadata ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Notification
}
