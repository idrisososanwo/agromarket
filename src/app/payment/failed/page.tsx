'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

function FailedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const retryUrl = orderId ? `/payment?orderId=${orderId}` : '/buyer/dashboard'

  return (
    <Card className="max-w-md mx-auto border border-border bg-card rounded-none py-8 text-center select-none">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <XCircle className="size-16 text-red-500 dark:text-red-400 stroke-[1.2]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold tracking-tight font-heading text-foreground uppercase">
            Payment Failed
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Your Stellar Testnet transaction could not be verified on the Horizon ledger, or the transaction properties did not match the invoice.
          </p>
        </div>

        <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
          <Link
            href={retryUrl}
            className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            <RefreshCw className="size-4" />
            Retry Payment
          </Link>
          <Link
            href="/buyer/dashboard"
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'w-full cursor-pointer font-sans gap-1.5')}
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto space-y-4">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-6 w-3/4 mx-auto rounded-none" />
        </div>
      }>
        <FailedContent />
      </Suspense>
    </div>
  )
}
