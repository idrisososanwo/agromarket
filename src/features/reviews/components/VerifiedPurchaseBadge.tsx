'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'

export function VerifiedPurchaseBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 select-none">
      <ShieldCheck className="size-3 shrink-0" />
      Verified Purchase
    </span>
  )
}
