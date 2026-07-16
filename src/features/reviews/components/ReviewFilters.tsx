'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ReviewFiltersProps {
  activeRating: number | 'all'
  onRatingChange: (rating: number | 'all') => void
  activeSort: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'
  onSortChange: (sort: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful') => void
  verifiedOnly: boolean
  onVerifiedOnlyChange: (verified: boolean) => void
}

const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'newest' },
  { label: 'Most Helpful', value: 'helpful' },
  { label: 'Highest Rated', value: 'highest' },
  { label: 'Lowest Rated', value: 'lowest' },
  { label: 'Oldest', value: 'oldest' },
] as const

const RATING_OPTIONS = [
  { label: 'All Stars', value: 'all' },
  { label: '5 Stars', value: 5 },
  { label: '4 Stars', value: 4 },
  { label: '3 Stars', value: 3 },
  { label: '2 Stars', value: 2 },
  { label: '1 Star', value: 1 },
] as const

export function ReviewFilters({
  activeRating,
  onRatingChange,
  activeSort,
  onSortChange,
  verifiedOnly,
  onVerifiedOnlyChange,
}: ReviewFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border bg-card font-sans select-none text-xs">
      <div className="flex flex-wrap items-center gap-4">
        {/* Rating filter */}
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Rating:</span>
          <select
            value={activeRating}
            onChange={(e) => {
              const val = e.target.value
              onRatingChange(val === 'all' ? 'all' : Number(val))
            }}
            className="h-8 px-2 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Verified Purchase Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
            className="rounded-none border-border bg-background text-primary focus:ring-primary size-3.5"
          />
          <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
            Verified Purchases Only
          </span>
        </label>
      </div>

      {/* Sort selection */}
      <div className="flex items-center gap-2">
        <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Sort By:</span>
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="h-8 px-2 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
