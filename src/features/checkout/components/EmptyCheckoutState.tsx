import React from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function EmptyCheckoutState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-none bg-zinc-50/50 dark:bg-zinc-900/10 max-w-3xl mx-auto">
      <ShoppingBag className="size-16 text-zinc-400 stroke-[1.2] mb-4" />
      <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">Cannot Proceed to Checkout</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
        Your shopping cart is currently empty. You must add at least one product to your cart before checking out.
      </p>
      <Link
        href="/marketplace"
        className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'cursor-pointer font-sans')}
      >
        Explore Produce
      </Link>
    </div>
  )
}
