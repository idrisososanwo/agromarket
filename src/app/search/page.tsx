'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/features/search/components/SearchBar'
import { FilterSidebar } from '@/features/search/components/FilterSidebar'
import { FilterDrawer } from '@/features/search/components/FilterDrawer'
import { SortDropdown } from '@/features/search/components/SortDropdown'
import { ActiveFilters } from '@/features/search/components/ActiveFilters'
import { SearchResults } from '@/features/search/components/SearchResults'
import { useSearchProducts } from '@/features/search/hooks/use-search'
import { SearchFilters, SortOption } from '@/features/search/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  // Filter & Sorting states
  const [filters, setFilters] = useState<SearchFilters>({})
  const [sort, setSort] = useState<SortOption>('newest')
  const [page, setPage] = useState(1)

  // Sync category if passed as param (optional fallback)
  useEffect(() => {
    const catParam = searchParams.get('category')
    if (catParam) {
      setFilters((prev) => ({ ...prev, category: catParam }))
    }
  }, [searchParams])

  const { data, isLoading } = useSearchProducts(query, filters, sort, page, 9)

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    const nextFilters = { ...filters }
    delete nextFilters[key]
    setFilters(nextFilters)
    setPage(1)
  }

  const handleClearAllFilters = () => {
    setFilters({})
    setPage(1)
  }

  const totalPages = Math.ceil((data?.totalCount || 0) / 9)

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Navigation & Search Hub */}
        <div className="flex flex-col gap-4">
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
            <h1 className="text-lg font-bold uppercase tracking-wide font-heading text-foreground">
              Marketplace Search
            </h1>
          </div>
          <SearchBar initialValue={query} />
        </div>

        {/* Layout: Sidebar + Results */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar — Desktop only */}
          <aside className="w-full md:w-64 shrink-0 hidden md:block">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </aside>

          {/* Results Area */}
          <main className="flex-1 space-y-4">
            {/* Toolbar: mobile filter trigger, sorting, status info */}
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
                <FilterDrawer filters={filters} onFiltersChange={setFilters} />
                <SortDropdown value={sort} onChange={setSort} />
              </div>
            </div>

            {/* Badges of active filters */}
            <ActiveFilters
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Results Grid */}
            <SearchResults
              products={data?.products || []}
              isLoading={isLoading}
              onClearFilters={handleClearAllFilters}
            />

            {/* Pagination controls */}
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
