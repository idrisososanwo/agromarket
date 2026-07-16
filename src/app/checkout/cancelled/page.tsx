'use client'

import React from 'react'
import { CancelledCard } from '@/features/checkout/components/CancelledCard'

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <CancelledCard />
    </div>
  )
}
