import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckoutTotals } from '../types'
import { ShieldCheck } from 'lucide-react'

interface OrderTotalsProps {
  totals: CheckoutTotals
  onAction?: () => void
  actionLabel?: string
  isPending?: boolean
  disabled?: boolean
}

export function OrderTotals({ totals, onAction, actionLabel, isPending, disabled }: OrderTotalsProps) {
  return (
    <Card className="border border-border bg-card rounded-none h-fit">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Billing Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Delivery Fee</span>
            <span className="font-semibold text-foreground text-right">
              {totals.deliveryFee === 0 ? 'Free' : `$${totals.deliveryFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Estimated Tax (8%)</span>
            <span className="font-semibold text-foreground">${totals.tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t border-border pt-4 flex justify-between items-baseline">
          <span className="text-sm font-bold text-foreground uppercase tracking-wider">Grand Total</span>
          <span className="text-xl font-bold text-foreground">
            ${totals.total.toFixed(2)}
          </span>
        </div>

        {onAction && (
          <div className="space-y-3 pt-2">
            <Button
              onClick={onAction}
              disabled={disabled || isPending}
              className="w-full cursor-pointer font-sans text-xs uppercase font-bold tracking-wider rounded-none"
              size="lg"
            >
              {isPending ? 'Processing...' : actionLabel || 'Confirm Action'}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground select-none">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-500" />
              <span>Secure Transactions via Stellar Network</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
