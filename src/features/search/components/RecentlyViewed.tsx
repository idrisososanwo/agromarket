'use client'

import React from 'react'
import { useRecentlyViewed } from '../hooks/use-search'
import { RecommendationCarousel } from './RecommendationCarousel'

export function RecentlyViewed() {
  const { data: products, isLoading } = useRecentlyViewed()

  if (isLoading || !products || products.length === 0) return null

  return (
    <RecommendationCarousel
      products={products}
      title="Recently Viewed"
      description="Products you have looked at recently."
    />
  )
}
