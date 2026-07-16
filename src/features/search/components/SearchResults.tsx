'use client'

import React from 'react'
import { ProductWithSeller } from '@/features/marketplace/types'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { NoResultsState } from './NoResultsState'

interface SearchResultsProps {
  products: ProductWithSeller[]
  isLoading: boolean
  onClearFilters?: () => void
}

export function SearchResults({ products, isLoading, onClearFilters }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-border p-4 space-y-4">
            <Skeleton className="h-40 w-full rounded-none animate-pulse" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-none" />
              <Skeleton className="h-3 w-1/2 rounded-none" />
              <Skeleton className="h-3 w-1/4 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return <NoResultsState onClearFilters={onClearFilters} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-sans">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
