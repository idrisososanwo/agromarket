'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRecentSearches, useSaveSearchHistory } from '../hooks/use-search'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  initialValue?: string
  placeholder?: string
  className?: string
  onSearchChange?: (val: string) => void
}

export function SearchBar({
  initialValue = '',
  placeholder = 'Search agricultural products...',
  className,
  onSearchChange,
}: SearchBarProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: suggestionsData, isLoading: isLoadingSuggestions } = useRecentSearches()
  const { mutate: saveSearch } = useSaveSearchHistory()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    // Debounce search input changes if callback provided
    if (onSearchChange) {
      const handler = setTimeout(() => {
        onSearchChange(value)
      }, 300)
      return () => clearTimeout(handler)
    }
  }, [value, onSearchChange])

  // Handle outside clicks to close suggestions popover
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const triggerSearch = (term: string) => {
    const trimmed = term.trim()
    if (!trimmed) return

    saveSearch(trimmed)
    setIsFocused(false)
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    triggerSearch(value)
  }

  const handleSuggestionClick = (term: string) => {
    setValue(term)
    triggerSearch(term)
  }

  const handleClear = () => {
    setValue('')
    if (onSearchChange) onSearchChange('')
  }

  const showSuggestions =
    isFocused &&
    suggestionsData &&
    (suggestionsData.recentSearches.length > 0 || suggestionsData.popularSearches.length > 0)

  return (
    <div ref={containerRef} className={cn('relative w-full font-sans select-none', className)}>
      <form onSubmit={handleSubmit} className="flex gap-0 border border-border bg-background">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground stroke-[1.5]" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="pl-9 pr-8 rounded-none border-none text-xs h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-9 px-4 rounded-none text-[10px] uppercase font-bold tracking-wider cursor-pointer border-l border-border bg-foreground text-background hover:bg-foreground/90"
        >
          Search
        </Button>
      </form>

      {/* Autocomplete / Recent Searches Popover */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-border bg-popover shadow-lg z-50 p-4 max-h-80 overflow-y-auto rounded-none">
          <div className="space-y-4">
            {/* Recent Searches */}
            {suggestionsData.recentSearches.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Recent Searches
                </p>
                <div className="flex flex-col">
                  {suggestionsData.recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="w-full text-left py-1.5 px-2 hover:bg-muted text-xs text-foreground cursor-pointer transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {suggestionsData.popularSearches.length > 0 && (
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestionsData.popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSuggestionClick(term)}
                      className="px-2.5 py-1 bg-muted hover:bg-muted-foreground/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer transition-colors border border-border"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
