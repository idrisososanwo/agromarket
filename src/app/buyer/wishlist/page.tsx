'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { DashboardHeader } from '@/features/buyer/components/DashboardHeader'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Wishlist"
        description="View farm listings you've saved to buy later."
      />

      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-none bg-zinc-50/50 dark:bg-zinc-900/10">
        <Heart className="size-16 text-zinc-400 stroke-[1.2] mb-4" />
        <h3 className="text-sm font-semibold tracking-wider uppercase font-heading text-foreground mb-1">Your Wishlist is Empty</h3>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
          Saving products allows you to track pricing and availability before adding items to your cart.
        </p>
        <Link
          href="/marketplace"
          className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'cursor-pointer font-sans')}
        >
          Explore Produce
        </Link>
      </div>
    </div>
  )
}
