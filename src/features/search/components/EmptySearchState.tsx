'use client'

import React from 'react'
import { Search } from 'lucide-react'

export function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none font-sans space-y-4 border border-border bg-card">
      <div className="p-4 bg-muted border border-border rounded-full">
        <Search className="size-8 text-muted-foreground stroke-[1.2]" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">
          Find Agricultural Products
        </p>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Type a search term above or select a category below to start browsing the marketplace.
        </p>
      </div>
    </div>
  )
}
