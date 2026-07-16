'use client'

import React from 'react'

interface NotificationBadgeProps {
  count: number
  max?: number
}

export function NotificationBadge({ count, max = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null

  return (
    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white leading-none select-none z-10">
      {count > max ? `${max}+` : count}
    </span>
  )
}
