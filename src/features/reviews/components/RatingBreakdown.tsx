'use client'

import React from 'react'
import { ProductRatingSummary, SellerReputation } from '../types'
import { RatingStars } from './RatingStars'
import { cn } from '@/lib/utils'

type Summary = Pick<
  ProductRatingSummary & SellerReputation,
  'average_rating' | 'total_reviews' | 'five_star' | 'four_star' | 'three_star' | 'two_star' | 'one_star'
>

interface RatingBreakdownProps {
  summary: Summary
  className?: string
}

const BAR_STARS: Array<{ label: string; key: keyof Summary }> = [
  { label: '5', key: 'five_star' },
  { label: '4', key: 'four_star' },
  { label: '3', key: 'three_star' },
  { label: '2', key: 'two_star' },
  { label: '1', key: 'one_star' },
]

export function RatingBreakdown({ summary, className }: RatingBreakdownProps) {
  const total = summary.total_reviews

  return (
    <div className={cn('flex gap-6 font-sans select-none', className)}>
      {/* Big average */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <span className="text-5xl font-black font-heading text-foreground leading-none">
          {Number(summary.average_rating).toFixed(1)}
        </span>
        <RatingStars value={Math.round(summary.average_rating)} size="sm" />
        <span className="text-[10px] text-muted-foreground">
          {total} review{total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex-1 space-y-1.5">
        {BAR_STARS.map(({ label, key }) => {
          const count = (summary[key] as number) ?? 0
          const pct = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground w-3 shrink-0 text-right">
                {label}
              </span>
              <div className="flex-1 h-2 bg-muted border border-border overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground w-7 shrink-0">
                {pct}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
