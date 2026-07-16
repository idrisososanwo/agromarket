'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  value: number
  max?: number
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: number) => void
  className?: string
}

const sizeMap = {
  sm: 'size-3.5',
  md: 'size-5',
  lg: 'size-7',
}

export function RatingStars({
  value,
  max = 5,
  interactive = false,
  size = 'md',
  onChange,
  className,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const displayed = hovered ?? value

  return (
    <div
      className={cn('flex items-center gap-0.5', className)}
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1
        const filled = starValue <= displayed
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            onMouseEnter={() => interactive && setHovered(starValue)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={cn(
              'transition-transform focus-visible:outline-none',
              interactive
                ? 'cursor-pointer hover:scale-110 focus-visible:scale-110'
                : 'cursor-default pointer-events-none'
            )}
            aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeMap[size],
                'transition-colors',
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-zinc-300 dark:text-zinc-600'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
