'use client'

import React from 'react'
import { SearchFilters } from '../types'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface FilterSidebarProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  className?: string
}

const CATEGORIES = [
  'Cassava',
  'Maize',
  'Yam',
  'Tomatoes',
  'Cocoa',
  'Vegetables',
  'Grains',
  'Tubers',
  'Fruits',
  'Livestock',
]

const LOCATIONS = [
  'Lagos',
  'Ibadan',
  'Abuja',
  'Kano',
  'Enugu',
  'Kaduna',
  'Port Harcourt',
  'Jos',
]

export function FilterSidebar({ filters, onFiltersChange, className }: FilterSidebarProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleReset = () => {
    onFiltersChange({})
  }

  return (
    <div className={`space-y-6 font-sans select-none text-xs border border-border p-5 bg-card ${className}`}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="font-bold uppercase tracking-wider text-[10px] text-foreground">Filters</span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[9px] uppercase font-bold text-muted-foreground hover:text-foreground cursor-pointer underline"
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => updateFilter('category', e.target.value === 'all' ? undefined : e.target.value)}
          className="w-full h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Price Range (₦)</Label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice !== undefined ? filters.minPrice : ''}
            onChange={(e) =>
              updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full h-9 px-2 border border-border bg-background rounded-none text-xs text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice !== undefined ? filters.maxPrice : ''}
            onChange={(e) =>
              updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full h-9 px-2 border border-border bg-background rounded-none text-xs text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Location</Label>
        <select
          value={filters.location || 'all'}
          onChange={(e) => updateFilter('location', e.target.value === 'all' ? undefined : e.target.value)}
          className="w-full h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Availability</Label>
        <div className="flex flex-col gap-1.5 pt-1">
          {[
            { label: 'All Products', value: 'all' },
            { label: 'In Stock Only', value: 'in_stock' },
            { label: 'Out of Stock', value: 'out_of_stock' },
          ].map((opt) => (
            <label key={opt.value} className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
              <input
                type="radio"
                name="availability"
                checked={(filters.availability || 'all') === opt.value}
                onChange={() => updateFilter('availability', opt.value === 'all' ? undefined : opt.value)}
                className="border-border bg-background text-primary focus:ring-primary size-3.5"
              />
              <span className="text-muted-foreground">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <Label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Minimum Rating</Label>
        <select
          value={filters.rating || 'all'}
          onChange={(e) => updateFilter('rating', e.target.value === 'all' ? undefined : Number(e.target.value))}
          className="w-full h-9 px-3 border border-border bg-background rounded-none text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Star</option>
        </select>
      </div>
    </div>
  )
}
