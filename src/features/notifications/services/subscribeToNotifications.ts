import { createClient } from '@/lib/supabase/client'
import { Notification } from '../types'

/**
 * Subscribe to real-time notifications for the current user.
 * Returns an unsubscribe function to clean up on component unmount.
 *
 * Usage:
 *   const unsubscribe = subscribeToNotifications(userId, (n) => {
 *     // prepend to local state, show toast, etc.
 *   })
 *   return () => unsubscribe()
 */
export function subscribeToNotifications(
  userId: string,
  onNew: (notification: Notification) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNew(payload.new as Notification)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
