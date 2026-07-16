'use client'

import React from 'react'
import { SortOption } from '../types'

interface SortDropdownProps {
  value: SortOption
  onChange: (sort: SortOption) => void
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Recently Added', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Rated', value: 'rating_desc' },
  { label: 'Most Reviewed', value: 'reviews_desc' },
  { label: 'Best Selling', value: 'sales_desc' },
  { label: 'Relevance', value: 'relevance' },
  { label: 'Oldest', value: 'oldest' },
]

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2 font-sans select-none text-xs">
      <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground shrink-0">
        Sort By:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
