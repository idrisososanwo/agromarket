'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { useTrendingProducts } from '@/features/search/hooks/use-search'
import { Skeleton } from '@/components/ui/skeleton'

export default function TrendingPage() {
  const { data: products, isLoading } = useTrendingProducts(12)

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/marketplace">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Marketplace
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
              Trending Agricultural Products
            </h1>
            <p className="text-xs text-muted-foreground">
              Top items in high demand this week from verified local sellers.
            </p>
          </div>
        </div>

        {/* Grid of trending products */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-border p-4 space-y-4">
                <Skeleton className="h-40 w-full rounded-none" />
                <Skeleton className="h-3 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/4 rounded-none" />
              </div>
            ))}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 border border-border bg-card">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              No Trending Items
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
