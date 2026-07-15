'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useSellerProducts, useDeleteProduct } from '@/features/seller/hooks/use-seller-queries'
import { DashboardHeader } from '@/features/seller/components/DashboardHeader'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ProductTable } from '@/features/seller/components/ProductTable'
import { EmptyProductsState } from '@/features/seller/components/EmptyProductsState'
import { DeleteProductDialog } from '@/features/seller/components/DeleteProductDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { SellerProduct } from '@/features/seller/types'

export default function SellerProductsPage() {
  const supabase = createClient()
  const [sellerId, setSellerId] = useState<string>('')
  
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setSellerId(user.id)
    })
  }, [])

  const { data: products, isLoading } = useSellerProducts(sellerId)
  const { mutate: deleteMutate, isPending: isDeletePending } = useDeleteProduct()

  const handleDeleteClick = (product: SellerProduct) => {
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!selectedProduct) return
    
    deleteMutate(
      { id: selectedProduct.id, sellerId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setSelectedProduct(null)
        },
      }
    )
  }

  if (isLoading || !sellerId) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-96 w-full rounded-none" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="My Products"
        description="View and manage your listed agricultural produce."
      >
        <Link
          href="/seller/products/new"
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }), "cursor-pointer font-sans")}
        >
          <Plus className="size-4 mr-1.5" />
          Add Product
        </Link>
      </DashboardHeader>

      {products && products.length > 0 ? (
        <ProductTable products={products} onDeleteClick={handleDeleteClick} />
      ) : (
        <EmptyProductsState />
      )}

      {selectedProduct && (
        <DeleteProductDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
            setSelectedProduct(null)
          }}
          onConfirm={handleConfirmDelete}
          isPending={isDeletePending}
          productTitle={selectedProduct.title}
        />
      )}
    </div>
  )
}
