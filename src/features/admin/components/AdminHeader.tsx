'use client'

import React from 'react'

interface AdminHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans select-none border-b border-border pb-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground uppercase tracking-wide font-heading">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}
