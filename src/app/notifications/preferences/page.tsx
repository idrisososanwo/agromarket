'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Bell, Mail, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NotificationPreferencesForm } from '@/features/notifications/components/NotificationPreferencesForm'
import { NotificationSettingsCard } from '@/features/notifications/components/NotificationSettingsCard'

export default function NotificationsPreferencesPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

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
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold uppercase tracking-wide font-heading text-foreground">
              Notification Preferences
            </h1>
            <p className="text-xs text-muted-foreground">
              Control how and when AgroMarket notifies you.
            </p>
          </div>
        </div>

        {/* Preferences Form in a settings card */}
        <NotificationSettingsCard
          title="Notification Settings"
          description="Choose which notification channels and categories you want to receive. Changes are saved automatically."
          icon={Bell}
        >
          <NotificationPreferencesForm />
        </NotificationSettingsCard>

        {/* Info cards */}
        <NotificationSettingsCard
          title="Email Notifications"
          description="Transactional emails (order confirmations, payment receipts, security alerts) are always delivered regardless of your preferences above, as they contain important account information."
          icon={Mail}
        >
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            To unsubscribe from all marketing communications, disable the{' '}
            <span className="font-bold text-foreground">Marketing Emails</span> toggle above.
            Transactional emails cannot be disabled.
          </p>
        </NotificationSettingsCard>

        <NotificationSettingsCard
          title="Security Alerts"
          description="Security notifications such as login from a new device, password changes, and suspicious activity cannot be disabled. They are essential for protecting your account."
          icon={ShieldCheck}
        >
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            If you receive a security alert you do not recognise, please immediately change
            your password and contact AgroMarket support.
          </p>
        </NotificationSettingsCard>
      </div>
    </div>
  )
}
