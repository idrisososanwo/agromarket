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
import { useSellerReviews, useSellerReputation } from '@/features/reviews/hooks/use-reviews'
import { ReviewFilters as FiltersType } from '@/features/reviews/types'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'

export default function SellerReviewsPage() {
  const params = useParams()
  const sellerId = params.id as string

  const [sellerName, setSellerName] = useState<string | null>(null)
  const [isLoadingName, setIsLoadingName] = useState(true)

  // Filters State
  const [rating, setRating] = useState<number | 'all'>('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState<FiltersType['sort']>('newest')
  const [search, setSearch] = useState('')

  const { data: reputation, isLoading: isLoadingReputation } = useSellerReputation(sellerId)
  const { data: reviews, isLoading: isLoadingReviews } = useSellerReviews(sellerId, {
    rating,
    verified_only: verifiedOnly,
    sort,
    search,
  })

  useEffect(() => {
    if (!sellerId) return

    async function loadSellerProfile() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', sellerId)
          .maybeSingle()

        if (data) {
          setSellerName(data.full_name)
        }
      } catch (err) {
        console.error('Error loading seller profile:', err)
      } finally {
        setIsLoadingName(false)
      }
    }

    loadSellerProfile()
  }, [sellerId])

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        
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
              {isLoadingName ? 'Seller Reviews' : `${sellerName || 'Seller'} Reviews`}
            </h1>
            <p className="text-xs text-muted-foreground">
              Read reviews from buyers and view the seller's total reputation score.
            </p>
          </div>
        </div>

        {/* Reputation Summary Card */}
        {isLoadingReputation ? (
          <Card className="border border-border rounded-none shadow-none">
            <CardContent className="p-6 flex justify-center items-center h-32">
              <Loader2 className="size-6 text-emerald-600 animate-spin" />
            </CardContent>
          </Card>
        ) : reputation ? (
          <Card className="border border-border rounded-none shadow-none bg-card">
            <CardContent className="p-6 space-y-6">
              <RatingBreakdown summary={reputation as any} />
              
              {/* Additional seller reputation metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-center">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Response Rate
                  </p>
                  <p className="text-lg font-black font-heading text-foreground mt-0.5">
                    {reputation.response_rate_pct}%
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                    Total Responses
                  </p>
                  <p className="text-lg font-black font-heading text-foreground mt-0.5">
                    {reputation.responses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border rounded-none shadow-none bg-card">
            <CardContent className="p-6 text-center py-10 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                No Reputation History
              </p>
              <p className="text-[11px] text-muted-foreground">
                This seller hasn't received any reviews yet.
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
            productId="" // No product-specific actions on this general list
            isLoading={isLoadingReviews}
            emptyTitle="No reviews found"
            emptyDescription="There are no reviews matching your filter preferences."
          />
        </div>
      </div>
    </div>
  )
}
