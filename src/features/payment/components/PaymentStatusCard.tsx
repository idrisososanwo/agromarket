import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

interface PaymentStatusCardProps {
  status: 'pending' | 'processing' | 'success' | 'failed'
  message?: string
}

export function PaymentStatusCard({ status, message }: PaymentStatusCardProps) {
  return (
    <Card className="border border-border bg-card rounded-none max-w-md mx-auto p-6 text-center select-none">
      <CardContent className="space-y-6 pt-6">
        <div className="flex justify-center">
          {status === 'processing' && (
            <Loader2 className="size-16 text-emerald-600 dark:text-emerald-500 animate-spin stroke-[1.2]" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="size-16 text-emerald-600 dark:text-emerald-500 stroke-[1.2]" />
          )}
          {status === 'failed' && (
            <XCircle className="size-16 text-red-500 dark:text-red-400 stroke-[1.2]" />
          )}
          {status === 'pending' && (
            <AlertTriangle className="size-16 text-amber-500 stroke-[1.2]" />
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight font-heading text-foreground uppercase">
            {status === 'processing' && 'Verifying Payment...'}
            {status === 'success' && 'Payment Verified!'}
            {status === 'failed' && 'Payment Verification Failed'}
            {status === 'pending' && 'Payment Awaiting Broadcast'}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {message ||
              (status === 'processing' && 'Checking Stellar Horizon network for transaction confirmations...') ||
              (status === 'success' && 'Your Stellar transaction has been verified. The order is now confirmed!') ||
              (status === 'failed' && 'The transaction signature, destination address, or amounts did not match the order invoice.') ||
              (status === 'pending' && 'Complete the form to submit a Stellar Testnet transaction.')}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
