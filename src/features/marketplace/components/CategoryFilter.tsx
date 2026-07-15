import React from 'react'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Tubers',
  'Livestock',
]

interface CategoryFilterProps {
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-1 overflow-x-auto no-scrollbar">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category
        return (
          <Button
            key={category}
            variant={isSelected ? 'default' : 'outline'}
            size="xs"
            onClick={() => onSelectCategory(category)}
            className="cursor-pointer font-sans"
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}
