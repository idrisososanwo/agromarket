'use client'

import React from 'react'
import { SearchFilters } from '../types'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface ActiveFiltersProps {
  filters: SearchFilters
  onRemoveFilter: (key: keyof SearchFilters) => void
  onClearAll: () => void
}

export function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  const hasFilters = Object.values(filters).some((val) => val !== undefined)
  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 pb-4 font-sans select-none text-xs">
      <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground mr-1">
        Active Filters:
      </span>

      {filters.category && (
        <Badge variant="secondary" className="rounded-none gap-1 px-2 py-1 text-[10px] font-bold">
          Category: {filters.category}
          <button
            type="button"
            onClick={() => onRemoveFilter('category')}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
        <Badge variant="secondary" className="rounded-none gap-1 px-2 py-1 text-[10px] font-bold">
          Price:{' '}
          {filters.minPrice !== undefined ? `₦${filters.minPrice}` : '₦0'}{' '}
          —{' '}
          {filters.maxPrice !== undefined ? `₦${filters.maxPrice}` : '∞'}
          <button
            type="button"
            onClick={() => {
              onRemoveFilter('minPrice')
              onRemoveFilter('maxPrice')
            }}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {filters.location && (
        <Badge variant="secondary" className="rounded-none gap-1 px-2 py-1 text-[10px] font-bold">
          Location: {filters.location}
          <button
            type="button"
            onClick={() => onRemoveFilter('location')}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {filters.availability && (
        <Badge variant="secondary" className="rounded-none gap-1 px-2 py-1 text-[10px] font-bold">
          Availability: {filters.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}
          <button
            type="button"
            onClick={() => onRemoveFilter('availability')}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {filters.rating && (
        <Badge variant="secondary" className="rounded-none gap-1 px-2 py-1 text-[10px] font-bold">
          Rating: {filters.rating}+ Stars
          <button
            type="button"
            onClick={() => onRemoveFilter('rating')}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-[9px] uppercase font-bold text-muted-foreground hover:text-foreground underline cursor-pointer ml-1"
      >
        Clear All
      </button>
    </div>
  )
}
