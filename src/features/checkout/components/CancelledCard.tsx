import React from 'react'
import Link from 'next/link'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function CancelledCard() {
  return (
    <Card className="max-w-md mx-auto border border-border bg-card rounded-none py-8 text-center select-none">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <XCircle className="size-16 text-red-500 dark:text-red-400 stroke-[1.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight font-heading text-foreground uppercase">
            Checkout Cancelled
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Your checkout process has been cancelled. No charges were made, and the items in your shopping cart remain intact.
          </p>
        </div>

        <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
          <Link
            href="/buyer/cart"
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            <ShoppingCart className="size-4" />
            Return to Shopping Cart
          </Link>
          <Link
            href="/marketplace"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            <ArrowLeft className="size-3.5" />
            Back to Marketplace
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
