import React from 'react'
import { ProductWithSeller } from '@/features/marketplace/types'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { ProductGrid } from '@/features/marketplace/components/ProductGrid'

interface RecommendedProductsProps {
  products: ProductWithSeller[]
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
        Recommended For You
      </h3>
      <ProductGrid>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </div>
  )
}
