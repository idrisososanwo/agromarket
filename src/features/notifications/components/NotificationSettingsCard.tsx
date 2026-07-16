'use client'

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface NotificationSettingsCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
}

export function NotificationSettingsCard({
  title,
  description,
  icon: Icon,
  children,
}: NotificationSettingsCardProps) {
  return (
    <Card className="border border-border bg-card rounded-none shadow-none font-sans">
      <CardHeader className="p-6 border-b border-border space-y-1">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <Icon className="size-4 text-emerald-600 dark:text-emerald-500" />
            </div>
          )}
          <p className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</p>
        </div>
        {description && (
          <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
        )}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
