import { createClient } from '@/lib/supabase/client'

export async function respondToReview(
  reviewId: string,
  response: string
): Promise<void> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Only the seller of this review may respond
  const { error } = await supabase
    .from('reviews')
    .update({ seller_response: response })
    .eq('id', reviewId)
    .eq('seller_id', user.id) // ownership enforced here + RLS

  if (error) throw error
}
