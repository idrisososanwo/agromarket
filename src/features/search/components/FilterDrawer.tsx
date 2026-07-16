'use client'

import React, { useState } from 'react'
import { SearchFilters } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'

interface FilterDrawerProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function FilterDrawer({ filters, onFiltersChange }: FilterDrawerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center gap-1.5 rounded-none border border-border bg-card px-4 h-9 text-[10px] uppercase font-bold tracking-wider cursor-pointer font-sans md:hidden"
      >
        <SlidersHorizontal className="size-3.5" />
        Filters
      </DialogTrigger>
      <DialogContent className="rounded-none font-sans max-w-sm max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="text-xs font-bold uppercase tracking-wider">
            Filter Products
          </DialogTitle>
        </DialogHeader>
        <div className="p-1">
          <FilterSidebar
            filters={filters}
            onFiltersChange={(f) => {
              onFiltersChange(f)
              // Keep open for live changes or let them click close
            }}
            className="border-none bg-transparent"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
