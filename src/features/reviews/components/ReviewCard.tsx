'use client'

import React, { useState } from 'react'
import { Review } from '../types'
import { RatingStars } from './RatingStars'
import { VerifiedPurchaseBadge } from './VerifiedPurchaseBadge'
import { HelpfulButton } from './HelpfulButton'
import { SellerResponse } from './SellerResponse'
import { ReviewReportDialog } from './ReviewReportDialog'
import { useDeleteReview, useUpdateReview } from '../hooks/use-reviews'
import { useSession } from '@/features/auth/components/SessionProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, ReviewFormValues } from '../schemas'
import { Label } from '@/components/ui/label'

interface ReviewCardProps {
  review: Review
  productId: string
}

function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateString).toLocaleDateString()
}

export function ReviewCard({ review, productId }: ReviewCardProps) {
  const { user, role } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  const { mutate: deleteReviewMutate } = useDeleteReview(productId)
  const { mutate: updateReviewMutate, isPending: isUpdating } = useUpdateReview(productId)

  const isAuthor = user?.id === review.buyer_id
  const isAdmin = role === 'admin'
  const isOwnSeller = user?.id === review.seller_id

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review.rating,
      title: review.title || '',
      comment: review.comment,
    },
  })

  const watchedRating = watch('rating')

  const onSubmit = (data: ReviewFormValues) => {
    updateReviewMutate(
      {
        id: review.id,
        rating: data.rating as any,
        title: data.title || '',
        comment: data.comment,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutate(review.id)
    }
  }

  const authorName = review.profiles?.full_name || 'Anonymous User'
  const initials = authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (isEditing) {
    return (
      <div className="p-4 border border-border bg-card font-sans select-none text-xs">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Edit Review</span>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setIsEditing(false)}
              className="h-7 text-[9px] font-bold"
            >
              Cancel
            </Button>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-bold uppercase tracking-wider">Rating</Label>
            <RatingStars
              value={watchedRating}
              interactive
              onChange={(val) => setValue('rating', val, { shouldValidate: true })}
            />
            {errors.rating && <p className="text-[10px] text-red-500">{errors.rating.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider">Title (Optional)</Label>
            <input
              id="title"
              {...register('title')}
              className="w-full h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {errors.title && <p className="text-[10px] text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="comment" className="text-[10px] font-bold uppercase tracking-wider">Comment</Label>
            <textarea
              id="comment"
              {...register('comment')}
              className="w-full min-h-[100px] p-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
            />
            {errors.comment && <p className="text-[10px] text-red-500">{errors.comment.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isUpdating}
            className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Save Changes
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="group p-4 border border-border bg-card font-sans select-none flex gap-4">
      {/* Avatar */}
      <Avatar className="size-10 rounded-none shrink-0 border border-border">
        <AvatarImage src={review.profiles?.avatar_url || undefined} alt={authorName} />
        <AvatarFallback className="rounded-none font-bold text-xs bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Review details */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-foreground">{authorName}</span>
              {review.verified_purchase && <VerifiedPurchaseBadge />}
            </div>
            <div className="flex items-center gap-2">
              <RatingStars value={review.rating} size="sm" />
              <span className="text-[10px] text-muted-foreground">
                {formatRelativeTime(review.created_at)}
              </span>
            </div>
          </div>

          {/* Action menu (Edit/Delete for author, Delete for Admin) */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-none"
                onClick={() => setIsEditing(true)}
                title="Edit review"
              >
                <Edit2 className="size-3 text-muted-foreground" />
              </Button>
            )}
            {(isAuthor || isAdmin) && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-none"
                onClick={handleDelete}
                title="Delete review"
              >
                <Trash2 className="size-3 text-red-400" />
              </Button>
            )}
          </div>
        </div>

        {/* Title & Comment */}
        <div className="space-y-1">
          {review.title && <p className="font-bold text-xs text-foreground">{review.title}</p>}
          <p className="text-[11px] text-muted-foreground leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>
        </div>

        {/* Footer controls (Helpful / Report) */}
        <div className="flex items-center gap-4 pt-1">
          <HelpfulButton
            reviewId={review.id}
            count={review.helpful_count}
            voted={!!review.user_voted_helpful}
            productId={productId}
          />
          {!isAuthor && (
            <ReviewReportDialog reviewId={review.id} />
          )}
        </div>

        {/* Seller response section */}
        <SellerResponse
          reviewId={review.id}
          response={review.seller_response}
          sellerId={review.seller_id}
          isOwnSeller={isOwnSeller}
        />
      </div>
    </div>
  )
}
