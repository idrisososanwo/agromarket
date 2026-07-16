'use client'

import React from 'react'
import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NoResultsStateProps {
  onClearFilters?: () => void
}

export function NoResultsState({ onClearFilters }: NoResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none font-sans space-y-4 border border-border bg-card">
      <div className="p-4 bg-muted border border-border rounded-full">
        <Inbox className="size-8 text-muted-foreground stroke-[1.2]" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">
          No Results Found
        </p>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
          We couldn't find any products matching your current search terms or filter settings.
        </p>
      </div>
      {onClearFilters && (
        <Button
          onClick={onClearFilters}
          className="rounded-none h-9 text-[9px] uppercase font-bold tracking-wider cursor-pointer"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
