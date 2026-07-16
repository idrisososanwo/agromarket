'use client'

import React from 'react'
import { NotificationCategory } from '../types'
import { cn } from '@/lib/utils'

interface NotificationFiltersProps {
  activeCategory: NotificationCategory | 'all'
  onCategoryChange: (cat: NotificationCategory | 'all') => void
  activeRead: 'all' | boolean
  onReadChange: (read: 'all' | boolean) => void
}

const CATEGORIES: { label: string; value: NotificationCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Orders', value: 'order' },
  { label: 'Payments', value: 'payment' },
  { label: 'Products', value: 'product' },
  { label: 'Account', value: 'account' },
  { label: 'System', value: 'system' },
]

const READ_FILTERS: { label: string; value: 'all' | boolean }[] = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: false },
  { label: 'Read', value: true },
]

export function NotificationFilters({
  activeCategory,
  onCategoryChange,
  activeRead,
  onReadChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-3 font-sans select-none">
      {/* Category tabs */}
      <div className="flex items-center gap-0 border border-border overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={cn(
              'px-3 py-2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors border-r border-border last:border-r-0',
              activeCategory === c.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/50'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Read filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status:</span>
        <div className="flex border border-border overflow-hidden">
          {READ_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => onReadChange(f.value)}
              className={cn(
                'px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-r border-border last:border-r-0',
                activeRead === f.value
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
