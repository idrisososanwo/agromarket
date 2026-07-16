'use client'

import React from 'react'
import { Review } from '../types'
import { ReviewCard } from './ReviewCard'
import { EmptyReviewsState } from './EmptyReviewsState'
import { Skeleton } from '@/components/ui/skeleton'

interface ReviewListProps {
  reviews: Review[]
  productId: string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function ReviewList({
  reviews,
  productId,
  isLoading = false,
  emptyTitle,
  emptyDescription,
}: ReviewListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border border-border bg-card flex gap-4">
            <Skeleton className="size-10 rounded-none shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-1/4 rounded-none" />
              <Skeleton className="h-3 w-1/3 rounded-none" />
              <div className="space-y-1 pt-2">
                <Skeleton className="h-3 w-full rounded-none" />
                <Skeleton className="h-3 w-5/6 rounded-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!reviews.length) {
    return (
      <EmptyReviewsState title={emptyTitle} description={emptyDescription} />
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} productId={productId} />
      ))}
    </div>
  )
}
