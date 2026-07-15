import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-none bg-zinc-50/50 dark:bg-zinc-900/10">
      <ShoppingCart className="size-16 text-zinc-400 stroke-[1.2] mb-4" />
      <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">Your Cart is Empty</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
        You haven't added any products to your shopping cart yet. Browse our selection of fresh farm produce to get started.
      </p>
      <Link
        href="/marketplace"
        className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'cursor-pointer font-sans')}
      >
        Browse Produce
      </Link>
    </div>
  )
}
