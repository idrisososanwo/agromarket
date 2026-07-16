'use client'

import React from 'react'
import { ProductWithSeller } from '@/features/marketplace/types'
import { ProductCard } from '@/features/marketplace/components/ProductCard'

interface RecommendationCarouselProps {
  products: ProductWithSeller[]
  title: string
  description?: string
}

export function RecommendationCarousel({
  products,
  title,
  description,
}: RecommendationCarouselProps) {
  if (!products || products.length === 0) return null

  return (
    <div className="space-y-4 font-sans select-none">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        {description && (
          <p className="text-[10px] text-muted-foreground leading-normal">{description}</p>
        )}
      </div>

      {/* Horizontal scrolling container for carousel experience */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {products.map((product) => (
          <div key={product.id} className="w-64 shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}
