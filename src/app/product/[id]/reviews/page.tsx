'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RatingBreakdown } from '@/features/reviews/components/RatingBreakdown'
import { ReviewList } from '@/features/reviews/components/ReviewList'
import { ReviewFilters } from '@/features/reviews/components/ReviewFilters'
import { ReviewSearch } from '@/features/reviews/components/ReviewSearch'
import { useProductReviews, useProductRatingSummary } from '@/features/reviews/hooks/use-reviews'
import { ReviewFilters as FiltersType } from '@/features/reviews/types'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'

export default function ProductReviewsPage() {
  const params = useParams()
  const productId = params.id as string

  const [productTitle, setProductTitle] = useState<string | null>(null)
  const [isLoadingTitle, setIsLoadingTitle] = useState(true)

  // Filters State
  const [rating, setRating] = useState<number | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState<FiltersType['sort']>('newest')
  const [search, setSearch] = useState('')

  const { data: summary, isLoading: isLoadingSummary } = useProductRatingSummary(productId)
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(productId, {
    rating,
    verified_only: verifiedOnly,
    sort,
    search,
  })

  useEffect(() => {
    if (!productId) return

    async function loadProductDetails() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('title')
          .eq('id', productId)
          .maybeSingle()

        if (data) {
          setProductTitle(data.title)
        }
      } catch (err) {
        console.error('Error loading product details:', err)
      } finally {
        setIsLoadingTitle(false)
      }
    }

    loadProductDetails()
  }, [productId])

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href={`/marketplace/${productId}`}>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Product Details
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
              {isLoadingTitle ? 'Product Reviews' : `${productTitle || 'Product'} Reviews`}
            </h1>
            <p className="text-xs text-muted-foreground">
              Real opinions and reviews from verified buyers.
            </p>
          </div>
        </div>

        {/* Rating Breakdown Card */}
        {isLoadingSummary ? (
          <Card className="border border-border rounded-none shadow-none">
            <CardContent className="p-6 flex justify-center items-center h-32">
              <Loader2 className="size-6 text-emerald-600 animate-spin" />
            </CardContent>
          </Card>
        ) : summary ? (
          <Card className="border border-border rounded-none shadow-none bg-card">
            <CardContent className="p-6 space-y-6">
              <RatingBreakdown summary={summary as any} />
              
              {/* Additional product rating summary metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-center">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Verified Purchases
                  </p>
                  <p className="text-lg font-black font-heading text-foreground mt-0.5">
                    {summary.verified_count}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Total Reviews
                  </p>
                  <p className="text-lg font-black font-heading text-foreground mt-0.5">
                    {summary.total_reviews}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border rounded-none shadow-none bg-card">
            <CardContent className="p-6 text-center py-10 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                No Reviews Yet
              </p>
              <p className="text-[11px] text-muted-foreground">
                This product hasn't been reviewed yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Search & Filters */}
        <div className="space-y-3">
          <ReviewSearch value={search} onChange={setSearch} />
          <ReviewFilters
            activeRating={rating}
            onRatingChange={setRating}
            activeSort={sort || 'newest'}
            onSortChange={setSort}
            verifiedOnly={verifiedOnly}
            onVerifiedOnlyChange={setVerifiedOnly}
          />
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <ReviewList
            reviews={reviews ?? []}
            productId={productId}
            isLoading={isLoadingReviews}
            emptyTitle="No reviews found"
            emptyDescription="There are no reviews matching your filter preferences."
          />
        </div>
      </div>
    </div>
  )
}
