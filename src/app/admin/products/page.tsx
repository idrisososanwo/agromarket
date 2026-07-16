'use client'

import React, { useState } from 'react'
import { useAdminProducts } from '@/features/admin/hooks/use-admin-queries'
import { AdminHeader } from '@/features/admin/components/AdminHeader'
import { SearchToolbar } from '@/features/admin/components/SearchToolbar'
import { FilterPanel } from '@/features/admin/components/FilterPanel'
import { ProductTable } from '@/features/admin/components/ProductTable'
import { LoadingSkeleton } from '@/features/admin/components/LoadingSkeleton'
import { EmptyState } from '@/features/admin/components/EmptyState'

export default function AdminProductsPage() {
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('all')

  const { data: products, isLoading, error } = useAdminProducts(search, category)

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Grains', value: 'grains' },
    { label: 'Dairy', value: 'dairy' },
  ]

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Product Moderation"
        description="Inspect, flag, remove, or restore platform marketplace listings."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchToolbar value={search} onChange={setSearch} placeholder="Search products..." />
        <FilterPanel value={category} onChange={setCategory} options={categoryOptions} label="Category" />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-500 font-bold uppercase tracking-wider font-sans">
          Failed to load products list.
        </div>
      ) : !products || products.length === 0 ? (
        <EmptyState title="No products found" description="Try broadening your search term or selecting another category filter." />
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  )
}
