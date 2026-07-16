'use client'

import React from 'react'
import { useTrendingProducts } from '../hooks/use-search'
import { RecommendationCarousel } from './RecommendationCarousel'

export function TrendingProducts() {
  const { data: products, isLoading } = useTrendingProducts(8)

  if (isLoading || !products || products.length === 0) return null

  return (
    <RecommendationCarousel
      products={products}
      title="Trending This Week"
      description="The most popular items on the market right now."
    />
  )
}
