'use client'

import React from 'react'
import { Notification } from '../types'
import { NotificationCard } from './NotificationCard'
import { EmptyNotificationsState } from './EmptyNotificationsState'
import { Skeleton } from '@/components/ui/skeleton'

interface NotificationListProps {
  notifications: Notification[]
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  compact?: boolean
}

export function NotificationList({
  notifications,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  compact = false,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 p-4">
            <Skeleton className="size-2 rounded-full mt-1.5 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-3/4 rounded-none" />
              <Skeleton className="h-3 w-full rounded-none" />
              <Skeleton className="h-3 w-1/4 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!notifications.length) {
    return (
      <EmptyNotificationsState title={emptyTitle} description={emptyDescription} />
    )
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} compact={compact} />
      ))}
    </div>
  )
}
