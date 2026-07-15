'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { useCreateProduct } from '@/features/seller/hooks/use-seller-queries'
import { DashboardHeader } from '@/features/seller/components/DashboardHeader'
import { ProductForm } from '@/features/seller/components/ProductForm'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductFormValues } from '@/features/seller/schemas'

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSellerId(user.id)
    })
  }, [])

  const { mutate: createMutate, isPending } = useCreateProduct()

  const handleSubmit = (values: ProductFormValues) => {
    createMutate(
      { values, sellerId },
      {
        onSuccess: () => {
          router.push('/seller/products')
        },
      }
    )
  }

  if (!sellerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-2/3 rounded-none" />
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
        title="Add New Product"
        description="Fill out the details below to add a new agricultural produce listing."
      />

      <div className="border border-border bg-card p-6 md:p-8">
        <ProductForm onSubmit={handleSubmit} isPending={isPending} userId={sellerId} />
      </div>
    </div>
  )
}
