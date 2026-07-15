import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ProductStatus } from '../types'

interface ProductStatusBadgeProps {
  status: ProductStatus
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  let label = 'Active'
  let classes = 'bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'

  if (status === 'draft') {
    label = 'Draft'
    classes = 'bg-zinc-50 text-zinc-700 border-zinc-200/50 hover:bg-zinc-50 dark:bg-zinc-900/40 dark:text-zinc-400 dark:border-zinc-800/50'
  } else if (status === 'out_of_stock') {
    label = 'Out of Stock'
    classes = 'bg-red-50 text-red-700 border-red-200/50 hover:bg-red-50 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
  }

  return (
    <Badge variant="outline" className={`rounded-none px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${classes}`}>
      {label}
    </Badge>
  )
}
