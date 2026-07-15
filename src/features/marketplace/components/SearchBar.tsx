import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search products...' }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground size-4 stroke-[1.5] pointer-events-none" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-6 h-10 w-full"
      />
    </div>
  )
}
