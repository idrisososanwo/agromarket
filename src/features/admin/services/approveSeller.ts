import { createClient } from '@/lib/supabase/client'

export async function approveSeller(userId: string, status: 'verified' | 'rejected' | 'pending'): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('seller_profiles')
    .update({ verification_status: status, updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) throw error
}
