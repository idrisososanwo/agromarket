import { createClient } from '@/lib/supabase/client'
import { Review, ReviewFilters, SellerReputation } from '../types'

export async function getSellerReviews(
  sellerId: string,
  filters: ReviewFilters = {}
): Promise<Review[]> {
  const supabase = createClient()

  let query = supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url), products(title, image_url)')
    .eq('seller_id', sellerId)
    .eq('reported', false)

  if (filters.rating && filters.rating !== 'all') {
    query = query.eq('rating', filters.rating)
  }

  if (filters.verified_only) {
    query = query.eq('verified_purchase', true)
  }

  if (filters.search?.trim()) {
    query = query.or(
      `title.ilike.%${filters.search}%,comment.ilike.%${filters.search}%`
    )
  }

  switch (filters.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'highest':
      query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
      break
    case 'lowest':
      query = query.order('rating', { ascending: true }).order('created_at', { ascending: false })
      break
    case 'helpful':
      query = query.order('helpful_count', { ascending: false }).order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query.limit(100)
  if (error) throw error
  return (data ?? []) as Review[]
}

export async function getSellerReputation(
  sellerId: string
): Promise<SellerReputation | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('seller_reputation')
    .select('*')
    .eq('seller_id', sellerId)
    .maybeSingle()

  if (error) throw error
  return data as SellerReputation | null
}

export async function getMyReviews(): Promise<Review[]> {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('reviews')
    .select('*, products(title, image_url)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Review[]
}
