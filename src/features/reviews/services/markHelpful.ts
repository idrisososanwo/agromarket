import { createClient } from '@/lib/supabase/client'

/**
 * Toggle helpful vote on a review.
 * Returns true if now voted, false if vote was removed (toggled off).
 */
export async function markHelpful(reviewId: string): Promise<boolean> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Check if already voted
  const { data: existing } = await supabase
    .from('review_helpful_votes')
    .select('review_id')
    .eq('review_id', reviewId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    // Remove vote
    await supabase
      .from('review_helpful_votes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', user.id)

    // Decrement count
    await supabase.rpc('decrement_helpful_count', { review_id: reviewId }).maybeSingle()
    // Fallback: manual decrement if RPC not available
    const { data: review } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single()
    if (review) {
      await supabase
        .from('reviews')
        .update({ helpful_count: Math.max(0, review.helpful_count - 1) })
        .eq('id', reviewId)
    }
    return false
  } else {
    // Add vote
    await supabase
      .from('review_helpful_votes')
      .insert({ review_id: reviewId, user_id: user.id })

    // Increment count
    const { data: review } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', reviewId)
      .single()
    if (review) {
      await supabase
        .from('reviews')
        .update({ helpful_count: review.helpful_count + 1 })
        .eq('id', reviewId)
    }
    return true
  }
}

export async function getUserHelpfulVotes(reviewIds: string[]): Promise<string[]> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('review_helpful_votes')
    .select('review_id')
    .eq('user_id', user.id)
    .in('review_id', reviewIds)

  return (data ?? []).map((v) => v.review_id)
}
