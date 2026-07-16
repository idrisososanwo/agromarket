'use client'

import React from 'react'
import { MessageSquare } from 'lucide-react'

interface EmptyReviewsStateProps {
  title?: string
  description?: string
}

export function EmptyReviewsState({
  title = 'No reviews yet',
  description = 'Be the first to share your experience with this product.',
}: EmptyReviewsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none font-sans space-y-4">
      <div className="p-4 bg-muted border border-border rounded-full">
        <MessageSquare className="size-8 text-muted-foreground stroke-[1.2]" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
