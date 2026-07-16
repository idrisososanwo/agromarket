'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useUpdateProfile } from '../hooks/use-profile-queries'
import { UserProfile } from '../types'

interface NotificationSettingsProps {
  profile: UserProfile
}

export function NotificationSettings({ profile }: NotificationSettingsProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const handleToggle = (key: 'notification_email' | 'notification_push', value: boolean) => {
    updateProfile({
      userId: profile.id,
      updates: {
        [key]: value,
      },
    })
  }

  return (
    <Card className="border border-border bg-card rounded-none">
      <CardHeader className="p-6 border-b border-border">
        <CardTitle className="text-xs font-bold tracking-wider uppercase text-foreground select-none">
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="notify-email" className="text-xs font-bold text-foreground cursor-pointer select-none">
              Email Notifications
            </Label>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Receive invoice receipts, shipment tracking updates, and account security alerts via email.
            </p>
          </div>
          <input
            id="notify-email"
            type="checkbox"
            checked={profile.notification_email}
            disabled={isPending}
            onChange={(e) => handleToggle('notification_email', e.target.checked)}
            className="size-4 cursor-pointer accent-emerald-600 dark:accent-emerald-500 rounded-none border border-border"
          />
        </div>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <div className="space-y-0.5 pr-4">
            <Label htmlFor="notify-push" className="text-xs font-bold text-foreground cursor-pointer select-none">
              Browser Push Notifications
            </Label>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Receive real-time alerts when sellers dispatch orders or product stock levels are updated.
            </p>
          </div>
          <input
            id="notify-push"
            type="checkbox"
            checked={profile.notification_push}
            disabled={isPending}
            onChange={(e) => handleToggle('notification_push', e.target.checked)}
            className="size-4 cursor-pointer accent-emerald-600 dark:accent-emerald-500 rounded-none border border-border"
          />
        </div>
      </CardContent>
    </Card>
  )
}
