'use client'

import React from 'react'
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/use-notifications'
import { NotificationPreferences } from '../types'
import { Skeleton } from '@/components/ui/skeleton'

interface ToggleRowProps {
  label: string
  description?: string
  checked: boolean
  onChange: () => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-b-0">
      <div>
        <p className="text-xs font-bold text-foreground font-sans">{label}</p>
        {description && (
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">{description}</p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-input'
        }`}
      >
        <span
          className={`pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

export function NotificationPreferencesForm() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const { mutate: update } = useUpdateNotificationPreferences()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-none" />
        ))}
      </div>
    )
  }

  const current: Partial<NotificationPreferences> = prefs ?? {}

  const toggle = (key: keyof Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    update({ [key]: !(current[key] ?? true) })
  }

  return (
    <div className="space-y-8 font-sans select-none">
      {/* Channels */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Delivery Channels
        </p>
        <div className="border border-border px-4">
          <ToggleRow
            label="In-App Notifications"
            description="Receive notifications inside the platform."
            checked={current.in_app_enabled ?? true}
            onChange={() => toggle('in_app_enabled')}
          />
          <ToggleRow
            label="Email Notifications"
            description="Receive important updates via email."
            checked={current.email_enabled ?? true}
            onChange={() => toggle('email_enabled')}
          />
          <ToggleRow
            label="Marketing Emails"
            description="Receive news, tips, and special offers."
            checked={current.marketing_enabled ?? false}
            onChange={() => toggle('marketing_enabled')}
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Notification Categories
        </p>
        <div className="border border-border px-4">
          <ToggleRow
            label="Order Updates"
            description="Confirmations, status changes, and dispatch notifications."
            checked={current.order_updates ?? true}
            onChange={() => toggle('order_updates')}
          />
          <ToggleRow
            label="Payment Updates"
            description="Payment confirmations, failures, and receipts."
            checked={current.payment_updates ?? true}
            onChange={() => toggle('payment_updates')}
          />
          <ToggleRow
            label="Product Updates"
            description="Approval status changes and listing removals."
            checked={current.product_updates ?? true}
            onChange={() => toggle('product_updates')}
          />
          <ToggleRow
            label="Security Alerts"
            description="Login activity, password changes, and account warnings."
            checked={current.security_updates ?? true}
            onChange={() => toggle('security_updates')}
          />
          <ToggleRow
            label="System Announcements"
            description="Platform updates, maintenance windows, and new features."
            checked={current.system_updates ?? true}
            onChange={() => toggle('system_updates')}
          />
        </div>
      </div>
    </div>
  )
}
