'use client'

import React from 'react'
import { useRelatedProducts } from '../hooks/use-search'
import { RecommendationCarousel } from './RecommendationCarousel'

interface RelatedProductsProps {
  productId: string
  category: string
}

export function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const { data: products, isLoading } = useRelatedProducts(productId, category, 6)

  if (isLoading || !products || products.length === 0) return null

  return (
    <RecommendationCarousel
      products={products}
      title="Related Products"
      description="Other options in the same category."
    />
  )
}
