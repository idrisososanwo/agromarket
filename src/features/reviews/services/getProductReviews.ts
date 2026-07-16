import { createClient } from '@/lib/supabase/client'
import { Review, ReviewFilters, ProductRatingSummary } from '../types'

export async function getProductReviews(
  productId: string,
  filters: ReviewFilters = {}
): Promise<Review[]> {
  const supabase = createClient()

  let query = supabase
    .from('reviews')
    .select('*, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
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

  // Sorting
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

export async function getProductRatingSummary(
  productId: string
): Promise<ProductRatingSummary | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('product_rating_summary')
    .select('*')
    .eq('product_id', productId)
    .maybeSingle()

  if (error) throw error
  return data as ProductRatingSummary | null
}
