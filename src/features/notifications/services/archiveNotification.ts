import { createClient } from '@/lib/supabase/client'

export async function archiveNotification(
  notificationId: string,
  archived: boolean = true
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ archived })
    .eq('id', notificationId)

  if (error) throw error
}
