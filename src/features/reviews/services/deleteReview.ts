import { createClient } from '@/lib/supabase/client'

export async function deleteReview(reviewId: string): Promise<void> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // RLS policy enforces: only buyer_id === uid OR admin can delete
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)

  if (error) throw error
}
