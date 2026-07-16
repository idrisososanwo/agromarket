import { createClient } from '@/lib/supabase/client'
import { ReviewReportReason } from '../types'

export async function reportReview(
  reviewId: string,
  reason: ReviewReportReason,
  notes?: string
): Promise<void> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('review_reports')
    .insert({
      review_id: reviewId,
      reported_by: user.id,
      reason,
      notes: notes ?? null,
      status: 'pending',
    })

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already reported this review')
    }
    throw error
  }

  // Mark review as reported for UI indication
  await supabase
    .from('reviews')
    .update({ reported: true })
    .eq('id', reviewId)
}
