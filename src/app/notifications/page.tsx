'use client'

import React, { useState } from 'react'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { NotificationList } from '@/features/notifications/components/NotificationList'
import { NotificationFilters } from '@/features/notifications/components/NotificationFilters'
import { MarkAllReadButton } from '@/features/notifications/components/MarkAllReadButton'
import { NotificationCategory } from '@/features/notifications/types'
import { Input } from '@/components/ui/input'
import { Search, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotificationsPage() {
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all')
  const [read, setRead] = useState<'all' | boolean>('all')
  const [search, setSearch] = useState('')

  const { data: notifications, isLoading } = useNotifications({
    category: category === 'all' ? undefined : category,
    read,
    archived: false,
    search,
  })

  const hasUnread = notifications?.some((n) => !n.read) ?? false

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
              Notifications
            </h1>
            <p className="text-xs text-muted-foreground">
              Stay informed about your orders, payments, and platform activity.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <MarkAllReadButton disabled={!hasUnread} />
            <Link href="/notifications/preferences">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1.5"
              >
                <Settings className="size-3.5" />
                Preferences
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground stroke-[1.5]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="pl-9 rounded-none text-xs"
          />
        </div>

        {/* Filters */}
        <NotificationFilters
          activeCategory={category}
          onCategoryChange={setCategory}
          activeRead={read}
          onReadChange={setRead}
        />

        {/* List */}
        <div className="border border-border bg-card">
          <NotificationList
            notifications={notifications ?? []}
            isLoading={isLoading}
            emptyTitle="No notifications"
            emptyDescription="No notifications match your current filters."
          />
        </div>

        {/* Archive link */}
        <div className="text-center">
          <Link
            href="/notifications/archive"
            className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            View Archived Notifications →
          </Link>
        </div>
      </div>
    </div>
  )
}
