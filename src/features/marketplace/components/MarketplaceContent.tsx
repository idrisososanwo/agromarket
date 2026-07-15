'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { useProducts } from '@/features/marketplace/hooks/use-marketplace-queries'
import { MarketplaceHeader } from '@/features/marketplace/components/MarketplaceHeader'
import { SearchBar } from '@/features/marketplace/components/SearchBar'
import { CategoryFilter } from '@/features/marketplace/components/CategoryFilter'
import { LoadingSkeleton } from '@/features/marketplace/components/LoadingSkeleton'
import { EmptyState } from '@/features/marketplace/components/EmptyState'
import { ProductGrid } from '@/features/marketplace/components/ProductGrid'
import { ProductCard } from '@/features/marketplace/components/ProductCard'
import { Pagination } from '@/features/marketplace/components/Pagination'
import { Button } from '@/components/ui/button'

export function MarketplaceContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const category = searchParams.get('category') ?? 'All'
  const search = searchParams.get('search') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const [searchInput, setSearchInput] = useState(search)

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchInput(search)
  }, [search])

  const { data: products, isLoading, isError, error, refetch } = useProducts(search, category)

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || (key === 'category' && value === 'All')) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    // Reset page on search or filter change
    if (newParams.category !== undefined || newParams.search !== undefined) {
      params.set('page', '1')
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    updateQueryParams({ search: value })
  }

  const handleCategorySelect = (selectedCategory: string) => {
    updateQueryParams({ category: selectedCategory })
  }

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage.toString() })
  }

  const pageSize = 8
  const totalPages = Math.ceil((products?.length || 0) / pageSize)
  const paginatedProducts = products?.slice((page - 1) * pageSize, page * pageSize) || []

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Navigation header back to home */}
      <div className="flex items-center justify-between pb-2">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground gap-1.5 focus-visible:underline outline-none"
        >
          <ArrowLeft className="size-3.5" />
          Back to Home
        </Link>
      </div>

      <MarketplaceHeader>
        <SearchBar value={searchInput} onChange={handleSearchChange} />
      </MarketplaceHeader>

      <CategoryFilter selectedCategory={category} onSelectCategory={handleCategorySelect} />

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-red-200 dark:border-red-900/50 bg-red-50/10 rounded-none">
          <p className="text-red-600 dark:text-red-400 font-medium">Error loading products</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
            {error?.message || 'We encountered an error loading marketplace data.'}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4 cursor-pointer">
            Try Again
          </Button>
        </div>
      ) : products?.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          <ProductGrid>
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
