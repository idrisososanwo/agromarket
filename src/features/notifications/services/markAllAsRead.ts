import { createClient } from '@/lib/supabase/client'

export async function markAllAsRead(): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false)
    .eq('archived', false)

  if (error) throw error
}
