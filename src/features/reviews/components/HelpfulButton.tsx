'use client'

import React from 'react'
import { ThumbsUp } from 'lucide-react'
import { useMarkHelpful } from '../hooks/use-reviews'
import { cn } from '@/lib/utils'

interface HelpfulButtonProps {
  reviewId: string
  count: number
  voted: boolean
  productId: string
}

export function HelpfulButton({ reviewId, count, voted, productId }: HelpfulButtonProps) {
  const { mutate, isPending } = useMarkHelpful(productId)

  return (
    <button
      type="button"
      onClick={() => mutate(reviewId)}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors select-none cursor-pointer disabled:opacity-50',
        voted
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-muted-foreground hover:text-foreground'
      )}
      aria-label="Mark review as helpful"
    >
      <ThumbsUp className={cn('size-3.5', voted && 'fill-emerald-500 text-emerald-600')} />
      Helpful {count > 0 && `(${count})`}
    </button>
  )
}
