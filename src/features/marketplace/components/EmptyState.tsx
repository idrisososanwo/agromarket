import React from 'react'
import { Sprout } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'No Products Found',
  description = 'Try adjusting your search query or selecting a different category.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50/50 dark:bg-zinc-900/10">
      <Sprout className="size-12 text-zinc-400 stroke-[1.2] mb-3" />
      <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
    </div>
  )
}
