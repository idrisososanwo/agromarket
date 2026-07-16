import { createClient } from '@/lib/supabase/client'

export async function suspendUser(userId: string, isSuspended: boolean): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update({ is_suspended: isSuspended, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}
