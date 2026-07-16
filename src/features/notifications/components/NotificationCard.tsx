'use client'

import React from 'react'
import { Notification } from '../types'
import { useMarkAsRead, useDeleteNotification, useArchiveNotification } from '../hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Archive, ArchiveRestore, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function formatRelativeTime(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateString).toLocaleDateString()
}

interface NotificationCardProps {
  notification: Notification
  compact?: boolean
}

const categoryColors: Record<string, string> = {
  order: 'bg-blue-500',
  payment: 'bg-emerald-500',
  product: 'bg-purple-500',
  account: 'bg-amber-500',
  system: 'bg-zinc-500',
}

export function NotificationCard({ notification, compact = false }: NotificationCardProps) {
  const { mutate: markRead } = useMarkAsRead()
  const { mutate: remove } = useDeleteNotification()
  const { mutate: archive } = useArchiveNotification()

  const handleClick = () => {
    if (!notification.read) {
      markRead(notification.id)
    }
  }

  const dotColor = categoryColors[notification.category] ?? 'bg-zinc-400'

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group relative flex gap-3 border-b border-border p-4 transition-colors hover:bg-muted/30 cursor-pointer select-none font-sans',
        !notification.read && 'bg-emerald-50/30 dark:bg-emerald-950/10'
      )}
    >
      {/* Category dot */}
      <div className="flex flex-col items-center pt-1 shrink-0">
        <span className={cn('size-2 rounded-full', dotColor)} />
        {!notification.read && (
          <span className="mt-1 size-1.5 rounded-full bg-emerald-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn('text-xs font-bold text-foreground', !notification.read && 'font-extrabold')}>
            {notification.title}
          </p>
          <span className="text-[9px] text-muted-foreground shrink-0 font-sans">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>

        {!compact && (
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {notification.message}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="rounded-none text-[9px] font-bold uppercase tracking-wider h-4 px-1.5 border-border"
          >
            {notification.category}
          </Badge>

          {notification.action_url && (
            <Link
              href={notification.action_url}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View <ExternalLink className="size-2.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-none"
          onClick={(e) => {
            e.stopPropagation()
            archive({ id: notification.id, archived: !notification.archived })
          }}
          title={notification.archived ? 'Restore' : 'Archive'}
        >
          {notification.archived ? (
            <ArchiveRestore className="size-3 text-muted-foreground" />
          ) : (
            <Archive className="size-3 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-none"
          onClick={(e) => {
            e.stopPropagation()
            remove(notification.id)
          }}
          title="Delete"
        >
          <Trash2 className="size-3 text-red-400" />
        </Button>
      </div>
    </div>
  )
}
