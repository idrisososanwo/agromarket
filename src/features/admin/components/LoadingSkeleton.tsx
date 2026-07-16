'use client'

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 w-full select-none font-sans">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/4 rounded-none" />
        <Skeleton className="h-8 w-1/6 rounded-none" />
      </div>
      <div className="border border-border p-6 space-y-3">
        <Skeleton className="h-6 w-full rounded-none" />
        <Skeleton className="h-6 w-full rounded-none" />
        <Skeleton className="h-6 w-full rounded-none" />
        <Skeleton className="h-6 w-full rounded-none" />
        <Skeleton className="h-6 w-full rounded-none" />
      </div>
    </div>
  )
}
