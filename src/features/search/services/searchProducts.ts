import { createClient } from '@/lib/supabase/client'
import { ProductWithSeller, SortOption, SearchFilters } from '../types'

interface SearchProductsResponse {
  products: ProductWithSeller[]
  totalCount: number
}

export async function searchProducts(
  searchTerm: string,
  filters: SearchFilters = {},
  sort: SortOption = 'newest',
  page: number = 1,
  limit: number = 12
): Promise<SearchProductsResponse> {
  const supabase = createClient()
  const offset = (page - 1) * limit

  // 1. Build base query selecting fields with nested profiles for seller details
  let query = supabase
    .from('products')
    .select('*, profiles(full_name, avatar_url)', { count: 'exact' })
    .eq('is_removed', false)
    .eq('status', 'active')

  // 2. Global Text Search
  const queryStr = searchTerm.trim()
  if (queryStr) {
    // Search in title, description, category, location
    query = query.or(
      `title.ilike.%${queryStr}%,description.ilike.%${queryStr}%,category.ilike.%${queryStr}%,location.ilike.%${queryStr}%`
    )
  }

  // 3. Category Filter
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category)
  }

  // 4. Price range Filter
  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice)
  }

  // 5. Location Filter
  if (filters.location && filters.location !== 'all') {
    query = query.ilike('location', `%${filters.location}%`)
  }

  // 6. Seller Filter
  if (filters.sellerId) {
    query = query.eq('seller_id', filters.sellerId)
  }

  // 7. Availability Filter
  if (filters.availability === 'in_stock') {
    query = query.gt('quantity', 0)
  } else if (filters.availability === 'out_of_stock') {
    query = query.eq('quantity', 0)
  }

  // 8. Sorting
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating_desc':
      // Sorted by average_rating from joined reviews or average rating
      // Since it's dynamic, we can fall back to created_at or price sorting if ratings views not joined directly in order.
      // We will order by created_at desc as fallback for now
      query = query.order('created_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
  }

  // 9. Pagination range
  const { data, count, error } = await query
    .range(offset, offset + limit - 1)

  if (error) throw error

  return {
    products: (data ?? []) as ProductWithSeller[],
    totalCount: count ?? 0,
  }
}
