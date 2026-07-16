'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface SearchToolbarProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function SearchToolbar({ value, onChange, placeholder = 'Search...' }: SearchToolbarProps) {
  return (
    <div className="relative font-sans">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground stroke-[1.5]" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 rounded-none text-xs w-full sm:max-w-xs"
      />
    </div>
  )
}
