'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterSidebar } from '@/features/search/components/FilterSidebar'
import { FilterDrawer } from '@/features/search/components/FilterDrawer'
import { SortDropdown } from '@/features/search/components/SortDropdown'
import { ActiveFilters } from '@/features/search/components/ActiveFilters'
import { SearchResults } from '@/features/search/components/SearchResults'
import { useSearchProducts } from '@/features/search/hooks/use-search'
import { SearchFilters, SortOption } from '@/features/search/types'

export default function CategoryBrowsePage() {
  const params = useParams()
  const router = useRouter()
  
  // Normalize category name (e.g. cassava -> Cassava)
  const categorySlug = params.category as string
  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)

  const [filters, setFilters] = useState<SearchFilters>({ category: categoryName })
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useSearchProducts('', filters, sort, page, 9)

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    // Cannot remove category on category page, keep it locked
    if (key === 'category') return
    const nextFilters = { ...filters }
    delete nextFilters[key]
    setFilters(nextFilters)
    setPage(1)
  }

  const handleClearAllFilters = () => {
    // Keep category filter intact
    setFilters({ category: categoryName })
    setPage(1)
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / 9)

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
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
              {categoryName} Products
            </h1>
            <p className="text-xs text-muted-foreground">
              Browse listings specifically filed under the {categoryName} category.
            </p>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0 hidden md:block">
            {/* Locked category filter */}
            <FilterSidebar
              filters={filters}
              onFiltersChange={(f) => setFilters({ ...f, category: categoryName })}
            />
          </aside>

          <main className="flex-1 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 p-4 border border-border bg-card">
              <span className="text-[11px] text-muted-foreground">
                Showing{' '}
                <span className="font-bold text-foreground">
                  {isLoading ? '...' : data?.products.length || 0}
                </span>{' '}
                of <span className="font-bold text-foreground">{isLoading ? '...' : data?.totalCount || 0}</span>{' '}
                results
              </span>
              <div className="flex items-center gap-2">
                <FilterDrawer
                  filters={filters}
                  onFiltersChange={(f) => setFilters({ ...f, category: categoryName })}
                />
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Active Filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Grid */}
            <SearchResults
              products={data?.products || []}
              isLoading={isLoading}
              onClearFilters={handleClearAllFilters}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground font-mono">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
