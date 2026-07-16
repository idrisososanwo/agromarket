'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface ReviewSearchProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export function ReviewSearch({ value, onChange, placeholder = 'Search reviews...' }: ReviewSearchProps) {
  return (
    <div className="relative font-sans select-none">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground stroke-[1.5]" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 rounded-none text-xs h-9"
      />
    </div>
  )
}
