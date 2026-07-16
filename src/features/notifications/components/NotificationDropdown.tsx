'use client'

import React from 'react'
import Link from 'next/link'
import { useNotifications } from '../hooks/use-notifications'
import { NotificationCard } from './NotificationCard'
import { EmptyNotificationsState } from './EmptyNotificationsState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function NotificationDropdown() {
  const { data: notifications, isLoading } = useNotifications({ archived: false, read: 'all' })

  const preview = notifications?.slice(0, 5) ?? []

  return (
    <div className="flex flex-col w-80 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Notifications</p>
        <Link
          href="/notifications"
          className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View All
        </Link>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4">
                <Skeleton className="size-2 rounded-full mt-1.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4 rounded-none" />
                  <Skeleton className="h-3 w-full rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : preview.length === 0 ? (
          <EmptyNotificationsState
            title="All caught up"
            description="No new notifications."
          />
        ) : (
          <div className="divide-y divide-border">
            {preview.map((n) => (
              <NotificationCard key={n.id} notification={n} compact />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link href="/notifications/preferences">
          <Button
            variant="ghost"
            size="sm"
            className="w-full rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer"
          >
            Manage Preferences
          </Button>
        </Link>
      </div>
    </div>
  )
}
