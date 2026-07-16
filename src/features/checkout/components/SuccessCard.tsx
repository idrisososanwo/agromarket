import React from 'react'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SuccessCardProps {
  orderId: string
}

export function SuccessCard({ orderId }: SuccessCardProps) {
  return (
    <Card className="max-w-md mx-auto border border-border bg-card rounded-none py-8 text-center select-none">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="size-16 text-emerald-600 dark:text-emerald-500 stroke-[1.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight font-heading text-foreground uppercase">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Thank you for purchasing from AgroMarket! Your order has been registered and is awaiting Stellar payment processing.
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-border p-3 rounded-none inline-block">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Order Reference ID</p>
          <code className="text-xs font-mono font-bold text-foreground mt-0.5 block break-all">
            {orderId}
          </code>
        </div>

        <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
          <Link
            href="/buyer/dashboard"
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            <ShoppingBag className="size-4" />
            Go to Buyer Dashboard
          </Link>
          <Link
            href="/marketplace"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            Continue Shopping
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
