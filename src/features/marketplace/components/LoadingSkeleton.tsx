import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductGrid } from './ProductGrid'

export function LoadingSkeleton() {
  const items = Array.from({ length: 8 })

  return (
    <ProductGrid>
      {items.map((_, i) => (
        <Card key={i} className="h-full flex flex-col overflow-hidden border border-border">
          <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-muted">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <CardHeader className="p-4 pb-1 space-y-1.5">
            <Skeleton className="h-4 w-3/4 rounded-none" />
            <Skeleton className="h-3 w-1/2 rounded-none" />
          </CardHeader>
          <CardContent className="px-4 py-1 flex-1 space-y-1.5 pt-2">
            <Skeleton className="h-3 w-full rounded-none" />
            <Skeleton className="h-3 w-5/6 rounded-none" />
          </CardContent>
          <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-border bg-zinc-50/50 dark:bg-zinc-900/10">
            <Skeleton className="h-5 w-1/3 rounded-none" />
            <Skeleton className="h-3.5 w-1/4 rounded-none" />
          </CardFooter>
        </Card>
      ))}
    </ProductGrid>
  )
}
