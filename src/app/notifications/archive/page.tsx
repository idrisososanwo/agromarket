'use client'

import React, { useState } from 'react'
import { useNotifications, useArchiveNotification } from '@/features/notifications/hooks/use-notifications'
import { NotificationList } from '@/features/notifications/components/NotificationList'
import { NotificationCategory } from '@/features/notifications/types'
import { NotificationFilters } from '@/features/notifications/components/NotificationFilters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ArchiveRestore } from 'lucide-react'

export default function NotificationsArchivePage() {
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all')
  const [read, setRead] = useState<'all' | boolean>('all')

  const { data: archived, isLoading } = useNotifications({
    category: category === 'all' ? undefined : category,
    read,
    archived: true,
  })

  const { mutate: restoreAll, isPending } = useArchiveNotification()

  const handleRestoreAll = () => {
    archived?.forEach((n) => restoreAll({ id: n.id, archived: false }))
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/notifications">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-none cursor-pointer text-xs font-bold uppercase tracking-wider gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
                Archived
              </h1>
              <p className="text-xs text-muted-foreground">
                Notifications you have archived are stored here.
              </p>
            </div>
            {(archived?.length ?? 0) > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreAll}
                disabled={isPending}
                className="rounded-none text-[9px] uppercase font-bold tracking-wider cursor-pointer gap-1.5"
              >
                <ArchiveRestore className="size-3.5" />
                Restore All
              </Button>
            )}
          </div>
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
            notifications={archived ?? []}
            isLoading={isLoading}
            emptyTitle="Archive is empty"
            emptyDescription="You have no archived notifications. Archive items from your inbox to store them here."
          />
        </div>
      </div>
    </div>
  )
}
