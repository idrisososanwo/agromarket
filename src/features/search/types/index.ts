import { ProductWithSeller } from '@/features/marketplace/types'
export { type ProductWithSeller }

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'reviews_desc'
  | 'sales_desc'
  | 'relevance'

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sellerId?: string
  location?: string
  availability?: 'all' | 'in_stock' | 'out_of_stock'
  recentlyAdded?: boolean
  featured?: boolean
}

export interface SearchHistory {
  id: string
  user_id: string
  search_term: string
  created_at: string
}

export interface RecentlyViewed {
  id: string
  user_id: string
  product_id: string
  viewed_at: string
  products?: ProductWithSeller | null
}

export interface SearchSuggestions {
  suggestions: string[]
  popularSearches: string[]
  recentSearches: string[]
}
