import { createClient } from '@/lib/supabase/client'
import { CreateReviewPayload, Review } from '../types'

/**
 * Create a review.
 *
 * Server-side enforcement:
 * 1. The order must exist and belong to the current user (buyer_id)
 * 2. The order status must be 'delivered'
 * 3. No existing review for this (order_id, product_id, buyer_id) combo
 *    (enforced by UNIQUE constraint in DB)
 *
 * verified_purchase is set to true automatically because we verify
 * the order belongs to the buyer before inserting.
 */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  // Verify the order exists, belongs to this buyer, and is delivered
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_status, buyer_id')
    .eq('id', payload.order_id)
    .eq('buyer_id', user.id)
    .maybeSingle()

  if (orderError) throw orderError
  if (!order) throw new Error('Order not found or does not belong to you')
  if (order.order_status !== 'delivered') {
    throw new Error('You can only review orders that have been delivered')
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      order_id: payload.order_id,
      product_id: payload.product_id,
      seller_id: payload.seller_id,
      buyer_id: user.id,
      rating: payload.rating,
      title: payload.title ?? null,
      comment: payload.comment,
      verified_purchase: true,
    })
    .select('*, profiles(full_name, avatar_url), products(title, image_url)')
    .single()

  if (error) {
    // Postgres unique constraint violation code
    if (error.code === '23505') {
      throw new Error('You have already reviewed this product for this order')
    }
    throw error
  }

  return data as Review
}
