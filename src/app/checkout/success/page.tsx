'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SuccessCard } from '@/features/checkout/components/SuccessCard'
import { Skeleton } from '@/components/ui/skeleton'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'unknown'

  return <SuccessCard orderId={orderId} />
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={
        <div className="max-w-md w-full mx-auto space-y-4">
          <Skeleton className="h-16 w-16 mx-auto rounded-full" />
          <Skeleton className="h-6 w-3/4 mx-auto rounded-none" />
          <Skeleton className="h-20 w-full rounded-none" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
