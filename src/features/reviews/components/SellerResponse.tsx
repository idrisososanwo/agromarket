'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { sellerResponseSchema, SellerResponseFormValues } from '../schemas'
import { useRespondToReview } from '../hooks/use-reviews'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MessageCircle, CornerDownRight, Edit2 } from 'lucide-react'

interface SellerResponseProps {
  reviewId: string
  response: string | null
  sellerId: string
  isOwnSeller: boolean
}

export function SellerResponse({ reviewId, response, sellerId, isOwnSeller }: SellerResponseProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { mutate: respond, isPending } = useRespondToReview(sellerId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerResponseFormValues>({
    resolver: zodResolver(sellerResponseSchema),
    defaultValues: {
      response: response || '',
    },
  })

  const onSubmit = (data: SellerResponseFormValues) => {
    respond(
      { reviewId, response: data.response },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  // Display existing response
  if (response && !isEditing) {
    return (
      <div className="mt-3 pl-6 border-l-2 border-primary/20 flex gap-2 font-sans select-none text-xs">
        <CornerDownRight className="size-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground">Seller's Response</span>
            {isOwnSeller && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Edit2 className="size-2.5" />
                Edit
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed italic">{response}</p>
        </div>
      </div>
    )
  }

  // Form to add/edit response (only for owner)
  if (isOwnSeller && (isEditing || !response)) {
    if (!isEditing && !response) {
      return (
        <div className="mt-2 font-sans select-none">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsEditing(true)}
            className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1"
          >
            <MessageCircle className="size-3" />
            Respond to Review
          </Button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3 pl-6 border-l-2 border-primary/20 space-y-2 font-sans select-none">
        <div className="space-y-1">
          <Label htmlFor={`response-${reviewId}`} className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Your Response
          </Label>
          <textarea
            id={`response-${reviewId}`}
            {...register('response')}
            placeholder="Write a professional response..."
            className="w-full min-h-[60px] p-2 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
          />
          {errors.response && (
            <p className="text-[10px] text-red-500">{errors.response.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={isPending}
            className="h-7 px-3 rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Submit Response
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="h-7 px-3 rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return null
}
