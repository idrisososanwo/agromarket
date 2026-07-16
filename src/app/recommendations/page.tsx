'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RecommendationCarousel } from '@/features/search/components/RecommendationCarousel'
import { RecentlyViewed } from '@/features/search/components/RecentlyViewed'
import { CategoryGrid } from '@/features/search/components/CategoryGrid'
import { useRecommendations } from '@/features/search/hooks/use-search'
import { Skeleton } from '@/components/ui/skeleton'

export default function RecommendationsPage() {
  const { data: recommendations, isLoading } = useRecommendations(8)

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        
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
              Personalized Recommendations
            </h1>
            <p className="text-xs text-muted-foreground">
              Based on your browsing patterns, search logs, and popular marketplace items.
            </p>
          </div>
        </div>

        {/* Dynamic Category Browser */}
        <CategoryGrid />

        {/* Recommendations list */}
        {isLoading ? (
          <div className="space-y-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-40 rounded-none" />
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="w-64 shrink-0 border border-border p-4 space-y-4">
                      <Skeleton className="h-40 w-full rounded-none" />
                      <Skeleton className="h-3 w-3/4 rounded-none" />
                      <Skeleton className="h-3 w-1/4 rounded-none" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Recommended For You Section */}
            <RecommendationCarousel
              products={recommendations?.recommendedForYou || []}
              title="Recommended For You"
              description="Personalized picks chosen specifically for you."
            />

            {/* Top Rated Section */}
            <RecommendationCarousel
              products={recommendations?.topRated || []}
              title="Top Rated Products"
              description="Products with highest customer ratings and verification badges."
            />

            {/* Recently Viewed (dynamically loaded via custom subcomponent) */}
            <RecentlyViewed />

            {/* Trending This Week Section */}
            <RecommendationCarousel
              products={recommendations?.trendingThisWeek || []}
              title="Trending This Week"
              description="The most popular items on the market right now."
            />
          </div>
        )}
      </div>
    </div>
  )
}
