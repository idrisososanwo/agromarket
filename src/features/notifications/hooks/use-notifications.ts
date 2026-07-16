'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useSession } from '@/features/auth/components/SessionProvider'
import { Notification, NotificationFilters } from '../types'
import { getNotifications, getUnreadCount } from '../services/getNotifications'
import { markAsRead } from '../services/markAsRead'
import { markAllAsRead } from '../services/markAllAsRead'
import { deleteNotification } from '../services/deleteNotification'
import { archiveNotification } from '../services/archiveNotification'
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../services/updateNotificationPreferences'
import { subscribeToNotifications } from '../services/subscribeToNotifications'
import { NotificationPreferences } from '../types'

// ============================================================
// Query Keys
// ============================================================
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filters: NotificationFilters) => ['notifications', 'list', filters] as const,
  unread: () => ['notifications', 'unread'] as const,
  preferences: () => ['notifications', 'preferences'] as const,
}

// ============================================================
// useNotifications — paginated list with filters
// ============================================================
export function useNotifications(filters: NotificationFilters = {}) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => getNotifications(filters),
  })
}

// ============================================================
// useUnreadNotifications — count for badge display
// ============================================================
export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: getUnreadCount,
    refetchInterval: 30_000, // poll every 30s as fallback
  })
}

// ============================================================
// useRealtimeNotifications — Supabase channel subscription
// ============================================================
export function useRealtimeNotifications() {
  const { session } = useSession()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!session?.user?.id) return

    const unsubscribe = subscribeToNotifications(session.user.id, (newNotification) => {
      // Prepend to all cached notification list queries
      queryClient.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old) => (old ? [newNotification, ...old] : [newNotification])
      )

      // Increment unread count
      queryClient.setQueryData<number>(notificationKeys.unread(), (old) => (old ?? 0) + 1)

      // Show toast
      toast.info(newNotification.title, {
        description: newNotification.message,
        action: newNotification.action_url
          ? { label: 'View', onClick: () => window.location.assign(newNotification.action_url!) }
          : undefined,
      })
    })

    return unsubscribe
  }, [session?.user?.id, queryClient])
}

// ============================================================
// useMarkAsRead
// ============================================================
export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onMutate: async (notificationId) => {
      // Optimistic: set read=true in all caches
      queryClient.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old) =>
          old?.map((n) => (n.id === notificationId ? { ...n, read: true } : n)) ?? []
      )
      queryClient.setQueryData<number>(notificationKeys.unread(), (old) =>
        Math.max(0, (old ?? 1) - 1)
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() })
    },
  })
}

// ============================================================
// useMarkAllAsRead
// ============================================================
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old) => old?.map((n) => ({ ...n, read: true })) ?? []
      )
      queryClient.setQueryData<number>(notificationKeys.unread(), 0)
      toast.success('All notifications marked as read')
    },
    onError: () => {
      toast.error('Failed to mark all as read')
    },
  })
}

// ============================================================
// useDeleteNotification
// ============================================================
export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      // Optimistic remove
      queryClient.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old) => old?.filter((n) => n.id !== notificationId) ?? []
      )
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      toast.error('Failed to delete notification')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() })
    },
  })
}

// ============================================================
// useArchiveNotification
// ============================================================
export function useArchiveNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, archived }: { id: string; archived: boolean }) =>
      archiveNotification(id, archived),
    onSuccess: (_data, { archived }) => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all })
      queryClient.invalidateQueries({ queryKey: notificationKeys.unread() })
      toast.success(archived ? 'Notification archived' : 'Notification restored')
    },
    onError: () => {
      toast.error('Failed to update notification')
    },
  })
}

// ============================================================
// useNotificationPreferences
// ============================================================
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: getNotificationPreferences,
  })
}

// ============================================================
// useUpdateNotificationPreferences
// ============================================================
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      prefs: Partial<
        Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>
      >
    ) => updateNotificationPreferences(prefs),
    onSuccess: (data) => {
      queryClient.setQueryData(notificationKeys.preferences(), data)
      toast.success('Notification preferences saved')
    },
    onError: () => {
      toast.error('Failed to save preferences')
    },
  })
}
