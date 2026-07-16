'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Review, ReviewFilters, CreateReviewPayload, UpdateReviewPayload } from '../types'
import { createReview } from '../services/createReview'
import { updateReview } from '../services/updateReview'
import { deleteReview } from '../services/deleteReview'
import {
  getProductReviews,
  getProductRatingSummary,
} from '../services/getProductReviews'
import {
  getSellerReviews,
  getSellerReputation,
  getMyReviews,
} from '../services/getSellerReviews'
import { reportReview } from '../services/reportReview'
import { respondToReview } from '../services/respondToReview'
import { markHelpful } from '../services/markHelpful'
import { getUnreviewedItems } from '../services/getUnreviewedItems'

import { ReviewReportReason } from '../types'

// ============================================================
// Query Keys
// ============================================================
export const reviewKeys = {
  all: ['reviews'] as const,
  product: (productId: string, filters: ReviewFilters) =>
    ['reviews', 'product', productId, filters] as const,
  productSummary: (productId: string) =>
    ['reviews', 'product', productId, 'summary'] as const,
  seller: (sellerId: string, filters: ReviewFilters) =>
    ['reviews', 'seller', sellerId, filters] as const,
  sellerReputation: (sellerId: string) =>
    ['reviews', 'seller', sellerId, 'reputation'] as const,
  mine: () => ['reviews', 'mine'] as const,
  unreviewed: () => ['reviews', 'unreviewed'] as const,
}

// ============================================================
// Product Reviews
// ============================================================
export function useProductReviews(productId: string, filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: reviewKeys.product(productId, filters),
    queryFn: () => getProductReviews(productId, filters),
    enabled: !!productId,
  })
}

export function useProductRatingSummary(productId: string) {
  return useQuery({
    queryKey: reviewKeys.productSummary(productId),
    queryFn: () => getProductRatingSummary(productId),
    enabled: !!productId,
  })
}

// ============================================================
// Seller Reviews
// ============================================================
export function useSellerReviews(sellerId: string, filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: reviewKeys.seller(sellerId, filters),
    queryFn: () => getSellerReviews(sellerId, filters),
    enabled: !!sellerId,
  })
}

export function useSellerReputation(sellerId: string) {
  return useQuery({
    queryKey: reviewKeys.sellerReputation(sellerId),
    queryFn: () => getSellerReputation(sellerId),
    enabled: !!sellerId,
  })
}

// ============================================================
// My Reviews (buyer history)
// ============================================================
export function useMyReviews() {
  return useQuery({
    queryKey: reviewKeys.mine(),
    queryFn: getMyReviews,
  })
}

// ============================================================
// Create Review
// ============================================================
export function useCreateReview(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: (newReview) => {
      // Prepend to product reviews
      queryClient.setQueriesData<Review[]>(
        { queryKey: ['reviews', 'product', productId] },
        (old) => (old ? [newReview, ...old] : [newReview])
      )
      queryClient.invalidateQueries({ queryKey: reviewKeys.productSummary(productId) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() })
      toast.success('Review submitted successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to submit review')
    },
  })
}

// ============================================================
// Update Review
// ============================================================
export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateReviewPayload) => updateReview(payload),
    onSuccess: (updated) => {
      queryClient.setQueriesData<Review[]>(
        { queryKey: ['reviews', 'product', productId] },
        (old) => old?.map((r) => (r.id === updated.id ? updated : r)) ?? []
      )
      queryClient.invalidateQueries({ queryKey: reviewKeys.productSummary(productId) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() })
      toast.success('Review updated')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to update review')
    },
  })
}

// ============================================================
// Delete Review
// ============================================================
export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onMutate: async (reviewId) => {
      // Optimistic remove
      queryClient.setQueriesData<Review[]>(
        { queryKey: ['reviews', 'product', productId] },
        (old) => old?.filter((r) => r.id !== reviewId) ?? []
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.productSummary(productId) })
      queryClient.invalidateQueries({ queryKey: reviewKeys.mine() })
      toast.success('Review deleted')
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all })
      toast.error('Failed to delete review')
    },
  })
}

// ============================================================
// Report Review
// ============================================================
export function useReportReview() {
  return useMutation({
    mutationFn: ({
      reviewId,
      reason,
      notes,
    }: {
      reviewId: string
      reason: ReviewReportReason
      notes?: string
    }) => reportReview(reviewId, reason, notes),
    onSuccess: () => toast.success('Review reported. Our team will review it.'),
    onError: (err: Error) => toast.error(err.message ?? 'Failed to report review'),
  })
}

// ============================================================
// Seller Respond to Review
// ============================================================
export function useRespondToReview(sellerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ reviewId, response }: { reviewId: string; response: string }) =>
      respondToReview(reviewId, response),
    onSuccess: (_data, { reviewId, response }) => {
      queryClient.setQueriesData<Review[]>(
        { queryKey: ['reviews', 'seller', sellerId] },
        (old) =>
          old?.map((r) =>
            r.id === reviewId ? { ...r, seller_response: response } : r
          ) ?? []
      )
      toast.success('Response submitted')
    },
    onError: (err: Error) => {
      toast.error(err.message ?? 'Failed to submit response')
    },
  })
}

// ============================================================
// Helpful Vote
// ============================================================
export function useMarkHelpful(productId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewId: string) => markHelpful(reviewId),
    onMutate: async (reviewId) => {
      // Optimistic toggle
      queryClient.setQueriesData<Review[]>(
        { queryKey: ['reviews', 'product', productId] },
        (old) =>
          old?.map((r) => {
            if (r.id !== reviewId) return r
            const voted = r.user_voted_helpful
            return {
              ...r,
              helpful_count: voted ? r.helpful_count - 1 : r.helpful_count + 1,
              user_voted_helpful: !voted,
            }
          }) ?? []
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', productId] })
    },
  })
}

// ============================================================
// Unreviewed Items (Buyer purchases pending review)
// ============================================================
export function useUnreviewedItems() {
  return useQuery({
    queryKey: reviewKeys.unreviewed(),
    queryFn: getUnreviewedItems,
  })
}

