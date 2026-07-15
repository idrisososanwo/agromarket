'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Calendar, Layers, ShieldCheck, ShoppingCart, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'

import { useProduct } from '@/features/marketplace/hooks/use-marketplace-queries'
import { ProductImage } from '@/features/marketplace/components/ProductImage'
import { ProductPrice } from '@/features/marketplace/components/ProductPrice'
import { ProductBadge } from '@/features/marketplace/components/ProductBadge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const { data: product, isLoading, isError, error } = useProduct(id)

  const handleAddToCart = () => {
    toast.success(`[Placeholder] ${product?.title} added to cart!`)
  }

  const handleContactSeller = () => {
    toast.success(`[Placeholder] Opening message window with ${product?.profiles?.full_name || 'seller'}...`)
  }

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="h-5 w-24">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4 rounded-none" />
            <Skeleton className="h-8 w-3/4 rounded-none" />
            <Skeleton className="h-5 w-1/3 rounded-none" />
            <Skeleton className="h-6 w-1/4 rounded-none" />
            <div className="border-y border-border py-4 space-y-2">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-none" />
              <Skeleton className="h-4 w-1/3 rounded-none" />
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-10 flex-1 rounded-none" />
              <Skeleton className="h-10 flex-1 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Failed to load product</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {error?.message || 'The product you are looking for might have been removed or is currently unavailable.'}
        </p>
        <Button onClick={() => router.push('/marketplace')} variant="outline" size="sm" className="cursor-pointer">
          Return to Marketplace
        </Button>
      </div>
    )
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(product.created_at))

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/marketplace"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5 focus-visible:underline outline-none"
        >
          <ArrowLeft className="size-3.5" />
          Back to Marketplace
        </Link>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        {/* Left Side: Product Image */}
        <div className="relative aspect-square w-full overflow-hidden border border-border bg-muted">
          <ProductImage
            src={product.image_url}
            title={product.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4">
            <ProductBadge>{product.category}</ProductBadge>
          </div>
        </div>

        {/* Right Side: Product Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Seller */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-heading text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1">
                <span>Listed by</span>
                <span className="font-semibold text-foreground">
                  {product.profiles?.full_name || 'AgroMarket Member'}
                </span>
              </p>
            </div>

            {/* Price tag */}
            <div>
              <ProductPrice price={product.price} unit={product.unit} className="text-2xl" />
            </div>

            {/* Stock Quantity */}
            <div className="inline-flex items-center text-xs font-medium text-muted-foreground bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 gap-1 border border-border">
              <Layers className="size-3.5" />
              <span>
                Quantity Available: <strong className="text-foreground">{product.quantity} {product.unit}s</strong>
              </span>
            </div>

            {/* Description */}
            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>

          {/* Location and Date Metadata */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
              <MapPin className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span>Location: <strong>{product.location}</strong></span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
              <Calendar className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span>Listed: <strong>{formattedDate}</strong></span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1.5">
              <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-500" />
              <span>Transactions secured by: <strong>Stellar Network (Ready)</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
            <Button
              onClick={handleAddToCart}
              className="flex-1 cursor-pointer"
              size="lg"
            >
              <ShoppingCart className="size-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={handleContactSeller}
              variant="outline"
              className="flex-1 cursor-pointer"
              size="lg"
            >
              <MessageSquare className="size-4 mr-2" />
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
