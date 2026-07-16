'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NotificationBadge } from './NotificationBadge'
import { NotificationDropdown } from './NotificationDropdown'
import { useUnreadNotifications, useRealtimeNotifications } from '../hooks/use-notifications'

export function NotificationBell() {
  // Subscribe to real-time notifications (toast + cache update)
  useRealtimeNotifications()

  const { data: unreadCount = 0 } = useUnreadNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-none border-none bg-transparent hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-5 stroke-[1.5]" />
        <NotificationBadge count={unreadCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-0 rounded-none border border-border shadow-lg w-80"
      >
        <NotificationDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
