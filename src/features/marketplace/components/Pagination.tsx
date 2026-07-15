import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="cursor-pointer"
      >
        <ChevronLeft className="size-4 mr-1" />
        Previous
      </Button>

      <span className="text-xs text-muted-foreground font-medium px-2">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="cursor-pointer"
      >
        Next
        <ChevronRight className="size-4 ml-1" />
      </Button>
    </div>
  )
}
