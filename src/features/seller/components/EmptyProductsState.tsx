import React from 'react'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EmptyProductsState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-none bg-zinc-50/50 dark:bg-zinc-900/10">
      <Package className="size-12 text-zinc-400 stroke-[1.2] mb-3" />
      <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">No Products Listed</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
        You haven't listed any products for sale yet. Start listing your farm produce now to reach buyers.
      </p>
      <Link
        href="/seller/products/new"
        className={cn(buttonVariants({ variant: 'default', size: 'sm' }), "cursor-pointer font-sans")}
      >
        <Plus className="size-3.5 mr-1.5" />
        Add Your First Product
      </Link>
    </div>
  )
}
