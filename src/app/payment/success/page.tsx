'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SuccessCard } from '@/features/checkout/components/SuccessCard'
import { TransactionDetails } from '@/features/payment/components/TransactionDetails'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'unknown'
  const txHash = searchParams.get('txHash') || ''

  return (
    <div className="max-w-xl mx-auto space-y-8 select-none">
      <SuccessCard orderId={orderId} />
      {txHash && (
        <TransactionDetails txHash={txHash} />
      )}
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] py-16 px-4">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto space-y-4">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-6 w-3/4 mx-auto rounded-none" />
          <Skeleton className="h-24 w-full rounded-none" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
