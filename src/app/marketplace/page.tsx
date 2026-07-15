import React, { Suspense } from 'react'
import { MarketplaceContent } from '@/features/marketplace/components/MarketplaceContent'
import { LoadingSkeleton } from '@/features/marketplace/components/LoadingSkeleton'

export const metadata = {
  title: 'Marketplace | AgroMarket',
  description: 'Browse agricultural products, grains, vegetables, fruits and livestock.',
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="h-10 w-48 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-none mb-6" />
          <LoadingSkeleton />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  )
}
