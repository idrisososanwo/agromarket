'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReviewForm } from '@/features/reviews/components/ReviewForm'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProductDetails {
  title: string
  image_url: string | null
}

export default function WriteReviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const productId = params.id as string
  const orderId = searchParams.get('order_id')
  const sellerId = searchParams.get('seller_id')

  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!productId) return

    async function loadProduct() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('products')
          .select('title, image_url')
          .eq('id', productId)
          .maybeSingle()

        if (data) {
          setProduct(data)
        }
      } catch (err) {
        console.error('Error loading product details for review:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  if (!orderId || !sellerId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none font-sans">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Invalid Request</p>
        <p className="text-xs text-muted-foreground mb-4">
          Missing order details. Reviews can only be written for completed purchases.
        </p>
        <Link href="/reviews">
          <Button variant="outline" className="rounded-none text-xs font-bold uppercase tracking-wider">
            Back to Reviews
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/reviews">
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
              Write a Review
            </h1>
            <p className="text-xs text-muted-foreground">
              Share your feedback to help other buyers choose.
            </p>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="p-4 border border-border bg-card flex items-center gap-3">
          {isLoading ? (
            <div className="flex items-center justify-center size-12 bg-muted border border-border">
              <Loader2 className="size-5 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <Avatar className="size-12 rounded-none shrink-0 border border-border">
              <AvatarImage src={product?.image_url || undefined} alt={product?.title} />
              <AvatarFallback className="rounded-none font-bold text-xs bg-muted text-muted-foreground">
                PR
              </AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Product</span>
            <p className="font-bold text-xs text-foreground truncate">
              {isLoading ? 'Loading product details...' : product?.title || 'Unknown Product'}
            </p>
          </div>
        </div>

        {/* Review Form */}
        <ReviewForm
          orderId={orderId}
          productId={productId}
          sellerId={sellerId}
          onSuccess={() => {
            router.push('/reviews')
          }}
        />
      </div>
    </div>
  )
}
