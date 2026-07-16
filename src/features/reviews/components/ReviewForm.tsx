'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reviewSchema, ReviewFormValues } from '../schemas'
import { useCreateReview } from '../hooks/use-reviews'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RatingStars } from './RatingStars'

interface ReviewFormProps {
  orderId: string
  productId: string
  sellerId: string
  onSuccess?: () => void
}

export function ReviewForm({ orderId, productId, sellerId, onSuccess }: ReviewFormProps) {
  const { mutate: create, isPending } = useCreateReview(productId)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      title: '',
      comment: '',
    },
  })

  const watchedRating = watch('rating')

  const onSubmit = (data: ReviewFormValues) => {
    create(
      {
        order_id: orderId,
        product_id: productId,
        seller_id: sellerId,
        rating: data.rating as any,
        title: data.title || undefined,
        comment: data.comment,
      },
      {
        onSuccess: () => {
          reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans select-none text-xs border border-border p-6 bg-card">
      <div className="space-y-1">
        <Label className="text-[10px] font-bold uppercase tracking-wider">Rating</Label>
        <RatingStars
          value={watchedRating}
          interactive
          size="lg"
          onChange={(val) => setValue('rating', val, { shouldValidate: true })}
        />
        {errors.rating && (
          <p className="text-[10px] text-red-500 font-medium">{errors.rating.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-wider">
          Review Title (Optional)
        </Label>
        <input
          id="title"
          {...register('title')}
          placeholder="Summarize your experience..."
          className="w-full h-10 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {errors.title && (
          <p className="text-[10px] text-red-500 font-medium">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="comment" className="text-[10px] font-bold uppercase tracking-wider">
          Review Details
        </Label>
        <textarea
          id="comment"
          {...register('comment')}
          placeholder="Tell us what you liked or disliked. Minimum 20 characters."
          className="w-full min-h-[120px] p-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
        />
        {errors.comment && (
          <p className="text-[10px] text-red-500 font-medium">{errors.comment.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
      >
        Submit Review
      </Button>
    </form>
  )
}
