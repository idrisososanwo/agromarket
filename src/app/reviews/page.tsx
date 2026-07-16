'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMyReviews, useUnreviewedItems } from '@/features/reviews/hooks/use-reviews'
import { RatingStars } from '@/features/reviews/components/RatingStars'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export default function ReviewsHistoryPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'written'>('pending')
  const { data: writtenReviews, isLoading: isLoadingWritten } = useMyReviews()
  const { data: pendingItems, isLoading: isLoadingPending } = useUnreviewedItems()

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/buyer">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
              My Ratings & Reviews
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage reviews for your recent purchases and view your reputation as a buyer.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border border-border bg-card">
          <button
            onClick={() => setActiveTab('pending')}
            className={cn(
              'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-r border-border last:border-r-0',
              activeTab === 'pending'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            Pending Reviews ({(pendingItems ?? []).length})
          </button>
          <button
            onClick={() => setActiveTab('written')}
            className={cn(
              'flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-r border-border last:border-r-0',
              activeTab === 'written'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            Reviews Written ({(writtenReviews ?? []).length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' ? (
          <div className="space-y-4">
            {isLoadingPending ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border border-border bg-card flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-none" />
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-24 rounded-none" />
                </div>
              ))
            ) : !pendingItems || pendingItems.length === 0 ? (
              <div className="text-center py-16 border border-border bg-card space-y-4">
                <div className="p-4 bg-muted border border-border rounded-full inline-block">
                  <MessageSquare className="size-8 text-muted-foreground stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground">All purchases reviewed</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    You have reviewed all eligible purchases. Check back after your next order!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingItems.map((item) => (
                  <div key={item.id} className="p-4 border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="size-12 rounded-none shrink-0 border border-border">
                        <AvatarImage src={item.products?.image_url || undefined} alt={item.products?.title} />
                        <AvatarFallback className="rounded-none font-bold text-xs bg-muted text-muted-foreground">
                          PR
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-foreground truncate">{item.products?.title}</p>
                        <p className="text-[10px] text-muted-foreground">Order ID: #{item.order_id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <Link
                      href={`/reviews/${item.product_id}?order_id=${item.order_id}&seller_id=${item.seller_id}`}
                      className="w-full sm:w-auto shrink-0"
                    >
                      <Button className="w-full sm:w-auto rounded-none h-8 text-[9px] uppercase font-bold tracking-wider cursor-pointer">
                        Write Review
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {isLoadingWritten ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 border border-border bg-card space-y-2">
                  <Skeleton className="h-3 w-1/4" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : !writtenReviews || writtenReviews.length === 0 ? (
              <div className="text-center py-16 border border-border bg-card space-y-4">
                <div className="p-4 bg-muted border border-border rounded-full inline-block">
                  <Star className="size-8 text-muted-foreground stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground">No reviews written</p>
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    You have not written any reviews yet. Share your experience to help the community!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {writtenReviews.map((review) => (
                  <div key={review.id} className="p-4 border border-border bg-card flex gap-4">
                    <Avatar className="size-12 rounded-none shrink-0 border border-border">
                      <AvatarImage src={review.products?.image_url || undefined} alt={review.products?.title} />
                      <AvatarFallback className="rounded-none font-bold text-xs bg-muted text-muted-foreground">
                        PR
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-xs text-foreground truncate">{review.products?.title}</span>
                        <span className="text-[9px] text-muted-foreground font-sans">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RatingStars value={review.rating} size="sm" />
                      </div>
                      <div className="space-y-1">
                        {review.title && <p className="font-bold text-xs text-foreground">{review.title}</p>}
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                      {review.seller_response && (
                        <div className="mt-2 pl-4 border-l-2 border-primary/20 space-y-0.5">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                            Seller Response
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            {review.seller_response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
