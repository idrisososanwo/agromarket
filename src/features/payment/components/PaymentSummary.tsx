import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins } from 'lucide-react'
import { PLATFORM_STELLAR_ADDRESS } from '../services/stellar-config'

interface PaymentSummaryProps {
  orderId: string
  subtotal: number
  deliveryFee: number
  totalAmount: number
}

export function PaymentSummary({ orderId, subtotal, deliveryFee, totalAmount }: PaymentSummaryProps) {
  const amountXlm = totalAmount * 10

  return (
    <Card className="border border-border bg-card rounded-none h-fit">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground">
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Order Reference</span>
            <span className="font-mono text-[10px] font-bold text-foreground">{orderId}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Order Total (USD)</span>
            <span className="font-semibold text-foreground">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-baseline border-t border-border pt-4">
            <span className="text-sm font-bold text-foreground uppercase tracking-wider">Amount in XLM</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
              <Coins className="size-5" />
              {amountXlm.toFixed(2)} XLM
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center select-none">
            Exchange Rate: <strong>1.00 USD = 10.00 XLM</strong> (Stellar Testnet Peg)
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-border space-y-2">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block select-none">Platform Recipient Escrow Address</span>
          <code className="text-[10px] font-mono font-bold text-foreground block break-all select-all">
            {PLATFORM_STELLAR_ADDRESS}
          </code>
        </div>
      </CardContent>
    </Card>
  )
}
