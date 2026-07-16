'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon, Inbox } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: LucideIcon
}

export function EmptyState({
  title = 'No records found',
  description = 'There are no active records matching your current filter settings.',
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <Card className="border border-border bg-card rounded-none shadow-none text-center p-12 font-sans select-none">
      <CardContent className="space-y-4 flex flex-col items-center justify-center p-0">
        <div className="p-4 bg-muted text-muted-foreground border border-border rounded-full">
          <Icon className="size-8 stroke-[1.2]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{title}</h3>
          <p className="text-[10px] text-muted-foreground max-w-sm mx-auto leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
