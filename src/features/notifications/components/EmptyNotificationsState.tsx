'use client'

import React from 'react'
import { Bell } from 'lucide-react'

interface EmptyNotificationsStateProps {
  title?: string
  description?: string
}

export function EmptyNotificationsState({
  title = 'No notifications',
  description = 'You are all caught up. New activity will appear here.',
}: EmptyNotificationsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center select-none font-sans space-y-4">
      <div className="p-4 bg-muted border border-border rounded-full">
        <Bell className="size-8 text-muted-foreground stroke-[1.2]" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
