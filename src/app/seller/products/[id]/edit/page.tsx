'use client'

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { useProduct } from '@/features/marketplace/hooks/use-marketplace-queries'
import { useUpdateProduct } from '@/features/seller/hooks/use-seller-queries'
import { DashboardHeader } from '@/features/seller/components/DashboardHeader'
import { ProductForm } from '@/features/seller/components/ProductForm'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ProductFormValues } from '@/features/seller/schemas'

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSellerId(user.id)
    })
  }, [])

  const { data: product, isLoading: isProductLoading } = useProduct(id)
  const { mutate: updateMutate, isPending: isUpdatePending } = useUpdateProduct()

  const handleSubmit = (values: ProductFormValues) => {
    updateMutate(
      { id, values, sellerId },
      {
        onSuccess: () => {
          router.push('/seller/products')
        },
      }
    )
  }

  const isLoading = isProductLoading || !sellerId

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-2/3 rounded-none" />
      </div>
    )
  }

  // Security authorization check: verify seller owns the product
  if (product && product.seller_id !== sellerId) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Unauthorized Access</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You do not have permission to edit this product. Listings can only be managed by their respective owners.
        </p>
        <Button onClick={() => router.push('/seller/products')} variant="outline" size="sm" className="cursor-pointer">
          Back to My Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center pb-2">
        <Link
          href="/seller/products"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5 focus-visible:underline outline-none"
        >
          <ArrowLeft className="size-3.5" />
          Back to Listings
        </Link>
      </div>

      <DashboardHeader
        title="Edit Product"
        description={`Update details for "${product?.title || 'Listing'}"`}
      />

      <div className="border border-border bg-card p-6 md:p-8">
        {product && (
          <ProductForm
            initialValues={{
              title: product.title,
              description: product.description,
              category: product.category,
              price: product.price,
              quantity: product.quantity,
              unit: product.unit,
              location: product.location,
              image_url: product.image_url,
              status: (product as any).status || 'active',
            }}
            onSubmit={handleSubmit}
            isPending={isUpdatePending}
            userId={sellerId}
          />
        )}
      </div>
    </div>
  )
}
