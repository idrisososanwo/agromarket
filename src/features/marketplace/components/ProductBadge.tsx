import React from 'react'
import { Badge } from '@/components/ui/badge'

interface ProductBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

export function ProductBadge({ children, variant = 'secondary' }: ProductBadgeProps) {
  return (
    <Badge
      variant={variant}
      className="rounded-none px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30"
    >
      {children}
    </Badge>
  )
}
