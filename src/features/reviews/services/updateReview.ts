import { createClient } from '@/lib/supabase/client'
import { UpdateReviewPayload, Review } from '../types'

export async function updateReview(payload: UpdateReviewPayload): Promise<Review> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const updates: Record<string, unknown> = {}
  if (payload.rating !== undefined) updates.rating = payload.rating
  if (payload.title !== undefined) updates.title = payload.title
  if (payload.comment !== undefined) updates.comment = payload.comment

  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', payload.id)
    .eq('buyer_id', user.id) // RLS + explicit ownership check
    .select('*, profiles(full_name, avatar_url), products(title, image_url)')
    .single()

  if (error) throw error
  return data as Review
}
