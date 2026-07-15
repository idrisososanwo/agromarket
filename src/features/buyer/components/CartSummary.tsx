import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

interface CartSummaryProps {
  subtotal: number
  totalQuantity: number
  onCheckout: () => void
  isPending?: boolean
}

export function CartSummary({ subtotal, totalQuantity, onCheckout, isPending }: CartSummaryProps) {
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  const grandTotal = subtotal + shipping + tax

  return (
    <Card className="border border-border bg-card rounded-none h-fit">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total Items</span>
            <span className="font-semibold text-foreground">{totalQuantity}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Shipping</span>
            <span className="font-semibold text-foreground">
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Estimated Tax (8%)</span>
            <span className="font-semibold text-foreground">${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-baseline">
          <span className="text-sm font-bold text-foreground uppercase tracking-wider">Grand Total</span>
          <span className="text-xl font-bold text-foreground">
            ${grandTotal.toFixed(2)}
          </span>
        </div>

        {shipping > 0 && (
          <p className="text-[10px] text-muted-foreground text-center">
            Tip: Add <strong>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
          </p>
        )}

        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            disabled={isPending || totalQuantity === 0}
            className="w-full cursor-pointer font-sans"
            size="lg"
          >
            Proceed to Checkout
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground select-none">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-500" />
            <span>Secure Payments with Stellar Network</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
