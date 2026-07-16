// ============================================================
// Reviews Feature — TypeScript Types
// ============================================================

export type ReviewReportReason =
  | 'spam'
  | 'fake_review'
  | 'offensive_content'
  | 'irrelevant'
  | 'other'

export type ReviewReportStatus = 'pending' | 'dismissed' | 'actioned'

export interface Review {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  buyer_id: string
  rating: 1 | 2 | 3 | 4 | 5
  title: string | null
  comment: string
  seller_response: string | null
  verified_purchase: boolean
  helpful_count: number
  reported: boolean
  created_at: string
  updated_at: string
  // Joined fields
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
  products?: {
    title: string
    image_url: string | null
  } | null
  // Client-side: did the current user vote this helpful?
  user_voted_helpful?: boolean
}

export interface ReviewReport {
  id: string
  review_id: string
  reported_by: string
  reason: ReviewReportReason
  notes: string | null
  status: ReviewReportStatus
  created_at: string
}

export interface SellerReputation {
  seller_id: string
  total_reviews: number
  average_rating: number
  five_star: number
  four_star: number
  three_star: number
  two_star: number
  one_star: number
  responses: number
  response_rate_pct: number
}

export interface ProductRatingSummary {
  product_id: string
  total_reviews: number
  average_rating: number
  five_star: number
  four_star: number
  three_star: number
  two_star: number
  one_star: number
  verified_count: number
}

// ============================================================
// Service Payloads
// ============================================================

export interface CreateReviewPayload {
  order_id: string
  product_id: string
  seller_id: string
  rating: 1 | 2 | 3 | 4 | 5
  title?: string
  comment: string
}

export interface UpdateReviewPayload {
  id: string
  rating?: 1 | 2 | 3 | 4 | 5
  title?: string
  comment?: string
}

export interface ReviewFilters {
  rating?: number | 'all'
  verified_only?: boolean
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  search?: string
}
