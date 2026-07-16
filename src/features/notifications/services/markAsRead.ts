import { createClient } from '@/lib/supabase/client'

export async function markAsRead(notificationId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) throw error
}
